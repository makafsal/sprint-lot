"use client";

import { Card, CardBody, CardHeader } from "@/app/components/Card";
import { Checkbox } from "@/app/components/Checkbox";
import { useContext, useEffect, useState } from "react";
import styles from "./gamePage.module.css";
import { useParams } from "next/navigation";
import { deleteGameByID, getGameByID, updateGame } from "@/lib/game";
import { AppCxt } from "@/app/context/AppCxt";
import {
  deleteAllPlayerByGameID,
  deletePlayerByID,
  getAllPlayersByGameID,
  updateAllPlayersByGameID,
  updatePlayerByID
} from "@/lib/player";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { DeleteDialog } from "@/app/components/DeleteDialog";
import { ExitDialog } from "@/app/components/ExitDialog";
import { Notification } from "@/app/components/Notification";
import { DialogProps, Game, GameType, Player } from "@/app/types";
import { Loader } from "@/app/components/Loader";
import { ScoreInfoModal } from "@/app/components/ScoreInfoModal";
import { getConfidenceIndicator } from "@/app/utils/getConfidenceIndicator";
import { CONFIDENCE, FIBONACCI, T_SHIRT } from "@/app/constants";
import { displayVote } from "@/app/utils/displayVote";
import { getScoreFromVote } from "@/app/utils/getScoreFromVote";
import { getHint } from "@/app/utils/getHint";
import {
  playBell,
  playCardFlip,
  playError,
  playLightSwitch,
  playSelectClick,
  playSuccess
} from "@/app/utils/sounds";

const GamePage = () => {
  const router = useRouter();
  const [player, setPlayer] = useState<Player>();
  const { state, dispatch } = useContext(AppCxt);
  const { id: gameID } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [scoreInfoDialogOpen, setScoreInfoDialogOpen] = useState(false);
  const [notification, setNotification] = useState<DialogProps>({
    open: false
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGame = async () => {
      const game: Game = await getGameByID(gameID as string);

      if (game) {
        dispatch({ type: "UPDATE_GAME", payload: { game } });

        const localPlayer = localStorage?.getItem("player");
        const parsedPlayer = localPlayer
          ? (JSON.parse(localPlayer) as Player)
          : null;

        if (parsedPlayer && parsedPlayer?.game === game?.id) {
          setPlayer(parsedPlayer);
          setLoading(false);
        } else {
          router.push(`/?type=join&id=${gameID}`);
        }
      } else {
        router.push("/");
      }
    };

    fetchGame();
  }, [dispatch, gameID, router]);

  useEffect(() => {
    const playersChannel = supabase
      .channel("players-votes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `game=eq.${state.game?.id}`
        },
        (payload) => {
          const newPlayer = payload.new as Player;

          setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
              player.id === newPlayer.id
                ? { ...player, vote: newPlayer.vote, score: newPlayer?.score }
                : player
            )
          );
          setPlayer((prevPlayer) => {
            if (prevPlayer?.id === newPlayer?.id) {
              localStorage.setItem("player", JSON.stringify(newPlayer));
              return newPlayer;
            } else {
              return prevPlayer;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
    };
  }, [state.game?.id]);

  useEffect(() => {
    const playersChannel = supabase
      .channel("players-join")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "players",
          filter: `game=eq.${state.game?.id}`
        },
        (payload) => {
          const newPlayer = payload.new as Player;
          setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
          setPlayer((prevPlayer) =>
            prevPlayer?.id === newPlayer?.id ? newPlayer : prevPlayer
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
    };
  }, [state.game?.id]);

  useEffect(() => {
    const playersChannel = supabase
      .channel("players-exit")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "players"
        },
        (payload) => {
          setPlayers((prevPlayers) =>
            prevPlayers.filter((_player) => _player.id !== payload?.old?.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
    };
  }, [state.game?.id]);

  useEffect(() => {
    const gameChannel = supabase
      .channel("game-average")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games"
        },
        (payload) => {
          const newGame = payload.new as Game;
          if (newGame.id === state.game?.id) {
            dispatch({
              type: "UPDATE_GAME",
              payload: { game: newGame as Game }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [dispatch, state.game]);

  useEffect(() => {
    const gameChannel = supabase
      .channel("game-delete")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "games"
        },
        (deletedGame) => {
          if (deletedGame?.old?.id === state.game?.id) {
            router.push("/");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [router, state.game?.id]);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (state.game?.id) {
        const _players = await getAllPlayersByGameID(state.game.id);
        setPlayers(_players);
      }
    };

    fetchPlayers();
  }, [state?.game?.id]);

  useEffect(() => {
    if (state?.game?.status === "in_progress") {
      let count = 0;

      players.forEach((_player) => {
        if (
          _player.vote !== null &&
          _player.vote !== undefined &&
          typeof _player.vote == "number" &&
          isFinite(_player.vote)
        ) {
          count++;

          if (
            count > 0 &&
            count === players?.length &&
            sessionStorage?.getItem("ready_to_reveal") !== "Yes"
          ) {
            if (state.sound) {
              playBell();
            }
            setNotification({ open: true, children: "Ready to reveal! 🤠" });
            sessionStorage?.setItem("ready_to_reveal", "Yes");

            setTimeout(
              () => setNotification({ open: false, children: null }),
              3000
            );
          }
        }
      });
    } else if (sessionStorage?.getItem("ready_to_reveal")) {
      sessionStorage?.removeItem("ready_to_reveal");
    }
  }, [players, state?.game?.status, state?.game?.type, state.sound]);

  const castVote = async (size: number) => {
    if (state.sound) {
      playSelectClick();
    }

    if (player?.id) {
      await updatePlayerByID(player.id, { vote: size });
      if (state?.game?.status === "started" && state.game?.id) {
        await updateGame(state.game?.id, {
          status: "in_progress"
        });
      }
      setPlayer((prevPlayer) => ({ ...prevPlayer, vote: size }));
    }
  };

  const toggleHasScoreboard = async () => {
    if (state?.game?.id) {
      await updateGame(state.game?.id, {
        has_scoreboard: !state?.game?.has_scoreboard
      });
    }
  };

  const reveal = async () => {
    if (state.sound) {
      playSuccess();
    }

    if (state.game?.id && state?.game?.type === "t-shirt") {
      await updateGame(state.game?.id, {
        status: "done"
      });
    } else {
      // Average and update it in the table, then state
      let count = 0;
      let sum = 0;
      let average = -1;

      players?.forEach((_player) => {
        if (
          _player?.vote !== undefined &&
          _player?.vote !== null &&
          typeof _player?.vote === "number" &&
          _player?.vote >= 0
        ) {
          count++;
          average = 0;
          sum += _player?.vote;
        }
      });

      if (sum > 0 && count > 0) {
        average = sum / count;
      }

      if (
        (!Number.isNaN(average) || Number.isFinite(average)) &&
        state.game?.id
      ) {
        const newGame = await updateGame(state.game?.id, {
          average: average,
          status: "done"
        });

        // Update the scoreboard
        if (newGame && newGame?.has_scoreboard && newGame?.status === "done") {
          const _scoreboard: Player[] = [];
          players?.forEach((boardPlayer) => {
            let myScore = boardPlayer?.score || 0;

            if (
              newGame?.average !== undefined &&
              boardPlayer?.vote !== null &&
              boardPlayer?.vote !== undefined
            ) {
              myScore += getScoreFromVote(boardPlayer.vote, average);
            }

            if (myScore > 0) {
              _scoreboard?.push({
                id: boardPlayer.id,
                score: myScore
              });
            }
          });

          if (_scoreboard?.length) {
            await Promise.all(
              _scoreboard?.map(async (scoreItem) => {
                if (scoreItem?.id) {
                  await updatePlayerByID(scoreItem.id, {
                    score: scoreItem?.score
                  });
                }
              })
            );
          }
        }
      }
    }
  };

  const reset = async () => {
    if (state.game?.id) {
      await updateAllPlayersByGameID(state.game?.id, { vote: null });
      await updateGame(state.game?.id, { status: "started", average: 0 });
    }

    if (state.sound) {
      playCardFlip();
    }
  };

  const deleteGame = async () => {
    if (state.game?.id) {
      await updateGame(state.game?.id, { owner: null });
      await deleteAllPlayerByGameID(state.game?.id);
      const deletedGame = await deleteGameByID(state.game?.id);
      localStorage.removeItem("player");

      if (deletedGame) {
        router.push("/");
      }
    }
  };

  const invite = async () => {
    await navigator.clipboard.writeText(window?.location?.href);

    if (state.sound) {
      playLightSwitch();
    }

    setNotification({ open: true, children: "Invite URL copied! 📋" });

    setTimeout(() => setNotification({ open: false, children: null }), 1000);
  };

  const exit = async () => {
    if (player?.id) {
      const deletedPlayer = await deletePlayerByID(player.id);

      if (deletedPlayer) {
        router.push("/");
        localStorage.removeItem("player");
      }
    }
  };

  const getGameCards = (type?: GameType) => {
    if (type === "t-shirt") {
      return (
        <>
          {T_SHIRT.map((size) => (
            <Card
              className={`${styles.voteCard} ${
                player?.vote === size.value ? styles.selected : ""
              }`}
              key={size.value}
              onClick={() => castVote(size.value)}
              disabled={state.game?.status === "done"}
              hint={getHint(state.game?.type, size.text)}
            >
              <CardBody className={styles.cardBodyAlt}>
                <div className={styles.cardContent}>{size.text}</div>
              </CardBody>
            </Card>
          ))}
        </>
      );
    } else {
      const sizes = type === "confidence" ? CONFIDENCE : FIBONACCI;
      return (
        <>
          {sizes.map((size) => (
            <Card
              className={`${styles.voteCard} ${
                player?.vote === size ? styles.selected : ""
              }`}
              key={size}
              onClick={() => castVote(size)}
              disabled={state.game?.status === "done"}
              hint={getHint(state.game?.type, size)}
            >
              <CardBody className={styles.cardBodyAlt}>
                <div className={styles.cardContent}>{size}</div>
              </CardBody>
            </Card>
          ))}
        </>
      );
    }
  };

  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        onYes={() => deleteGame()}
        onNo={() => setDeleteDialogOpen(false)}
      />

      <ExitDialog
        open={exitDialogOpen}
        onNo={() => setExitDialogOpen(false)}
        onYes={() => exit()}
      />

      <ScoreInfoModal
        open={scoreInfoDialogOpen}
        onClose={() => setScoreInfoDialogOpen(false)}
      />

      <Notification open={notification.open}>
        {notification.children}
      </Notification>

      {loading && <Loader />}
      {/* Players list */}
      <section className={`${styles.playersList}`}>
        {players?.map((_player: Player) => (
          <Card className={styles.playerCard} key={_player.id}>
            <CardHeader selected={player?.id === _player.id ? true : false}>
              {_player.name}
            </CardHeader>
            <CardBody className={styles.cardBodyAlt}>
              <div className={styles.cardContent}>
                {state.game?.status === "done" ? (
                  <>{displayVote(_player, state.game)}</>
                ) : (
                  <Checkbox
                    className={styles.checkboxAlt}
                    checked={_player.vote !== null ? true : false}
                    disabled
                  />
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </section>
      {/* Game controls */}
      <section className={styles.gameBoard}>
        <div className={styles.boardActions}>
          <button
            disabled={state?.game?.status !== "in_progress"}
            onClick={() => reveal()}
          >
            Reveal
          </button>
          <button
            onClick={() => reset()}
            disabled={state?.game?.status === "started"}
          >
            Reset
          </button>
          <button onClick={() => invite()}>Invite</button>
          {state.game?.owner === player?.id && (
            <button
              onClick={() => {
                if (state.sound) {
                  playError();
                }
                setDeleteDialogOpen(true);
              }}
            >
              Delete
            </button>
          )}
          {state.game?.owner !== player?.id && (
            <button
              title="Exit"
              onClick={() => {
                if (state.sound) {
                  playError();
                }
                setExitDialogOpen(true);
              }}
            >
              Exit
            </button>
          )}
          {state?.game?.type !== "t-shirt" && (
            <div>
              <Checkbox
                onToggle={() => toggleHasScoreboard()}
                checked={state?.game?.has_scoreboard}
                className={styles.checkboxThick}
              />
              <label htmlFor="scoreboard">
                {" "}
                Enable Scoreboard
                <sup>
                  <button
                    className="inline"
                    onClick={() => setScoreInfoDialogOpen(true)}
                  >
                    ?
                  </button>
                </sup>
              </label>
            </div>
          )}
        </div>
        <div className={styles.gameData}>
          <div className={styles.gameStatus}>
            {state.game?.status?.toUpperCase()}
          </div>
          {state?.game?.type !== "t-shirt" && (
            <h3>
              Average:{" "}
              {state.game?.average === -1
                ? "?"
                : state.game?.average?.toFixed(2)}{" "}
              {getConfidenceIndicator(state.game)}
            </h3>
          )}
        </div>
      </section>
      {/* Vote cards */}
      <section className={styles.sizeList}>
        <Card
          className={`${styles.voteCard} ${
            player?.vote === -1 ? styles.selected : ""
          }`}
          key={"🤔"}
          onClick={() => castVote(-1)}
          disabled={state.game?.status === "done"}
          hint="I don't know"
        >
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>🤔</div>
          </CardBody>
        </Card>
        {getGameCards(state?.game?.type)}
      </section>
      {/* Scoreboard */}
      {state?.game?.has_scoreboard && (
        <section className="mt-2">
          <h3>Scoreboard (🏆 Top 3)</h3>
          <div className={`${styles.scoreboard} mt-1`}>
            {players
              ?.sort((a, b) => {
                const scoreA = a?.score !== undefined ? a.score : 0;
                const scoreB = b?.score !== undefined ? b.score : 0;
                return scoreB - scoreA;
              })
              .slice(0, 3)
              ?.map((scoreboardPlayer) => (
                <div
                  key={scoreboardPlayer?.id}
                  className={styles.scoreboardItem}
                >
                  <div className={styles.scoreboardPlayer}>
                    {scoreboardPlayer.name}
                  </div>
                  <div className={styles.scoreboardScore}>
                    {scoreboardPlayer.score}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </>
  );
};

export default GamePage;
