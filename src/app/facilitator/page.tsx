"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { Game, Player, Ticket } from "../types";
import { useSearchParams, useRouter } from "next/navigation";
import { deleteGameByID, getGameByID, updateGame } from "@/lib/game";
import { Loader } from "../components/Loader";
import { AppCxt } from "../context/AppCxt";
import styles from "./facilitatorPage.module.css";
import { supabase } from "@/lib/supabaseClient";
import {
  deleteAllPlayerByGameID,
  getAllPlayersByGameID,
  updateAllPlayersByGameID,
  updatePlayerByID
} from "@/lib/player";
import { getConfidenceIndicator } from "../utils/getConfidenceIndicator";
import { Checkbox } from "../components/Checkbox";
import { displayVote } from "../utils/displayVote";
import { getScoreFromVote } from "../utils/getScoreFromVote";
import { DeleteDialog } from "../components/DeleteDialog";
import { ScoreInfoModal } from "../components/ScoreInfoModal";
import { createTicket, deleteTicket, getAllTickets } from "@/lib/tickets";
import { isUrl } from "../utils/isUrl";

const FacilitatorView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [player, setPlayer] = useState<Player>();
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scoreInfoDialogOpen, setScoreInfoDialogOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketUrl, setTicketUrl] = useState<string>();
  const [showUrlError, setShowUrlError] = useState<boolean>(false);
  const { state, dispatch } = useContext(AppCxt);
  const gameID: string = searchParams.get("gameId") || "";

  useEffect(() => {
    const initView = async () => {
      const game: Game = await getGameByID(gameID);

      const localPlayer = localStorage?.getItem("player");
      const parsedPlayer = localPlayer
        ? (JSON.parse(localPlayer) as Player)
        : null;

      if (game?.owner === parsedPlayer?.id) {
        dispatch({ type: "UPDATE_GAME", payload: { game } });
        // setPlayer(parsedPlayer as Player);
        // setGame(game);
        setLoading(false);
      } else {
        router.push("/");
      }
    };

    initView();
  }, [dispatch, gameID, router]);

  const fetchTickets = useCallback(async () => {
    const _tickets: Ticket[] = await getAllTickets(state.game?.id);
    setTickets(_tickets);
  }, [state.game?.id]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

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

          // setPlayer((prevPlayer) => {
          //   if (prevPlayer?.id === newPlayer?.id) {
          //     localStorage.setItem("player", JSON.stringify(newPlayer));
          //     return newPlayer;
          //   } else {
          //     return prevPlayer;
          //   }
          // });
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
          // setPlayer((prevPlayer) =>
          //   prevPlayer?.id === newPlayer?.id ? newPlayer : prevPlayer
          // );
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

  const reveal = async () => {
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

  const toggleHasScoreboard = async () => {
    if (state?.game?.id) {
      await updateGame(state.game?.id, {
        has_scoreboard: !state?.game?.has_scoreboard
      });
    }
  };

  const onAddTicket = async () => {
    if (ticketUrl?.trim() && isUrl(ticketUrl)) {
      await createTicket({
        gameId: state.game?.id,
        url: ticketUrl
      });

      setShowUrlError(false);
      setTicketUrl("");
      fetchTickets();
    } else {
      setShowUrlError(true);
    }
  };

  const onDeleteTicket = async (ticketId?: number) => {
    if (ticketId !== undefined) {
      await deleteTicket(ticketId);
      fetchTickets();
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        onYes={() => deleteGame()}
        onNo={() => setDeleteDialogOpen(false)}
      />

      <ScoreInfoModal
        open={scoreInfoDialogOpen}
        onClose={() => setScoreInfoDialogOpen(false)}
      />

      <div className={styles.content}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <td colSpan={3}>
                  <div className={styles.averageDisplay}>
                    <div>Average</div>
                    <div>
                      {state.game?.average === -1
                        ? "?"
                        : state.game?.average?.toFixed(2)}{" "}
                      {getConfidenceIndicator(state.game)}
                    </div>
                  </div>
                  <div className={styles.gameControls}>
                    <div>
                      <button
                        disabled={state?.game?.status !== "in_progress"}
                        onClick={() => reveal()}
                      >
                        Reveal
                      </button>
                      <button
                        onClick={() => reset()}
                        disabled={state?.game?.status === "started"}
                        className="ml-1"
                      >
                        Reset
                      </button>
                      <button
                        className="ml-1"
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        Delete
                      </button>
                      {state?.game?.type !== "t-shirt" && (
                        <div className="d-inline-block ml-1">
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
                    <div className={styles.gameStatus}>
                      {state.game?.status?.toUpperCase()}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Player</th>
                <th>Vote</th>
                {state.game?.has_scoreboard && <th>Score</th>}
              </tr>
            </thead>
            <tbody>
              {players.map((_player) => (
                <tr key={_player.id}>
                  <td>{_player.name}</td>
                  <td>
                    {state.game?.status === "done" ? (
                      <>{displayVote(_player, state.game)}</>
                    ) : (
                      <Checkbox
                        className={styles.checkboxAlt}
                        checked={_player.vote !== null ? true : false}
                        disabled
                      />
                    )}
                  </td>
                  {state.game?.has_scoreboard && <td>{_player.score}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.listContainer}>
          <h1>Tickets</h1>
          <div className="mt-1">
            {tickets.map((_ticket) => (
              <div key={_ticket.id} className={styles.listItem}>
                <a href={_ticket.url} target="_blank">
                  {_ticket.url}
                </a>
                <button
                  title="Delete"
                  className="ml-1"
                  onClick={() => onDeleteTicket(_ticket?.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <div className={styles.horizontalForm}>
            <div className={styles.itemInput}>
              <input
                id="ticket-url"
                name="ticket url"
                placeholder="Ticket URL"
                value={ticketUrl ?? ""}
                onChange={(ev) => setTicketUrl(ev.target.value)}
              />
              {showUrlError && (
                <p className="error-message">Please provide an URL!</p>
              )}
            </div>
            <button className="ml-1" onClick={onAddTicket}>
              ✓ Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacilitatorView;
