"use client";

import { Card, CardBody, CardHeader } from "@/app/components/Card";
import { Checkbox } from "@/app/components/Checkbox";
import styles from "./gamePage.module.css";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { deleteGameByID, getGameByID, updateGame } from "@/lib/game";
import { AppCxt, Game, Player } from "@/app/context/AppCxt";
import {
  deleteAllPlayerByGameID,
  deletePlayerByID,
  getAllPlayersByGameID,
  updateAllPlayersByGameID,
  updatePlayerByID
} from "@/lib/player";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const SIZES = [0, 1, 2, 3, 5, 8, 13, 21];

const GamePage = () => {
  const router = useRouter();
  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    const currentPlayer = localStorage?.getItem("player");

    if (!currentPlayer) {
      router.push("/?type=join");
    } else {
      setPlayer(JSON.parse(currentPlayer));
    }
  }, [router]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [inviteOpen, setInviteOpen] = useState<boolean>(false);
  const { id: gameID } = useParams();
  const { state, dispatch } = useContext(AppCxt);

  useEffect(() => {
    const fetchGame = async () => {
      const game = await getGameByID(gameID as string);

      if (game) {
        dispatch({ type: "UPDATE_GAME", payload: { game } });
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
                ? { ...player, vote: newPlayer.vote }
                : player
            )
          );
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
    const fetchPlayers = async () => {
      if (state.game?.id) {
        const _players = await getAllPlayersByGameID(state.game.id);

        setPlayers(_players);
      }
    };

    fetchPlayers();
  }, [state?.game?.id]);

  const castVote = async (size: number) => {
    if (player?.id) {
      await updatePlayerByID(player.id, { vote: size });
      setPlayer((prevPlayer) => ({ ...prevPlayer, vote: size }));
    }
  };

  const reveal = async () => {
    // Average and update it in the table, then state
    let count = 0;
    let sum = 0;

    players?.forEach((_player) => {
      if (_player?.vote && _player?.vote !== null) {
        count++;
        sum += _player?.vote;
      }
    });

    const average = sum / count;

    if (
      (!Number.isNaN(average) || Number.isFinite(average)) &&
      state.game?.id
    ) {
      await updateGame(state.game?.id, {
        average: average,
        status: "done"
      });
    }
  };

  const reset = async () => {
    if (state.game?.id) {
      await updateGame(state.game?.id, { status: "started", average: 0 });
      await updateAllPlayersByGameID(state.game?.id, { vote: null });
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

  const exit = async () => {
    if (player?.id) {
      const deletedPlayer = await deletePlayerByID(player.id);

      if (deletedPlayer) {
        router.push("/");
        localStorage.removeItem("player");
      }
    }
  };

  const copy = async () => {
    if (state.game?.game_id) {
      await navigator.clipboard.writeText(state.game?.game_id);

      setTimeout(() => {
        setInviteOpen(false);
      }, 1000);
    }
  };

  return (
    <>
      <dialog open={inviteOpen}>
        <code>{state.game?.game_id}</code>
        <button className={styles.copyButton} onClick={() => copy()}>
          {" "}
          &#x2398;
        </button>
        <button onClick={() => setInviteOpen(false)}>X</button>
      </dialog>
      <section className={`${styles.playersList}`}>
        {players?.map((_player: Player) => (
          <Card className={styles.playerCard} key={_player.id}>
            <CardHeader selected={player?.id === _player.id ? true : false}>
              {_player.name}
            </CardHeader>
            <CardBody className={styles.cardBodyAlt}>
              <div className={styles.cardContent}>
                {state.game?.status === "done" ? (
                  <>{_player?.vote || "?"}</>
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
      <section className={styles.gameBoard}>
        <div className={styles.boardActions}>
          <button onClick={() => reveal()}>Reveal</button>
          <button onClick={() => reset()}>Reset</button>
          <button onClick={() => setInviteOpen(true)}>Invite</button>
          {state.game?.owner === player?.id && (
            <button onClick={() => deleteGame()}>Delete</button>
          )}
          <button onClick={() => exit()}>Exit</button>
        </div>
        <div className={styles.gameData}>
          <div className={styles.gameStatus}>
            {state.game?.status?.toUpperCase()}
          </div>
          <h3>Average: {state.game?.average}</h3>
        </div>
      </section>
      <section className={styles.sizeList}>
        {SIZES.map((size) => (
          <Card
            className={`${styles.numberCard} ${
              player?.vote === size ? styles.selected : ""
            }`}
            key={size}
            onClick={() => castVote(size)}
            disabled={state.game?.status === "done"}
          >
            <CardBody className={styles.cardBodyAlt}>
              <div className={styles.cardContent}>{size}</div>
            </CardBody>
          </Card>
        ))}
      </section>
    </>
  );
};

export default GamePage;
