"use client";

import { Card, CardBody, CardHeader } from "@/app/components/Card";
import { Checkbox } from "@/app/components/Checkbox";
import styles from "./gamePage.module.css";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGameByID } from "@/lib/game";
import { AppCxt, Player } from "@/app/context/AppCxt";
import { getAllPlayersByGameID } from "@/lib/player";
import { supabase } from "@/lib/supabaseClient";

const GamePage = () => {
  const { id: gameID } = useParams();
  const { state, dispatch } = useContext(AppCxt);
  const [players, setPlayers] = useState<Player[]>([]);

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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
    };
  }, [players, state.game?.id]);

  useEffect(() => {
    const fetchGame = async () => {
      const game = await getGameByID(gameID as string);

      dispatch({ type: "UPDATE_GAME", payload: { game } });
    };

    fetchGame();
  }, [dispatch, gameID]);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (state.game?.id) {
        const _players = await getAllPlayersByGameID(state.game.id);

        setPlayers(_players);
      }
    };

    fetchPlayers();
  }, [state]);

  return (
    <>
      <section className={`${styles.playersList}`}>
        {players?.map((player: Player) => (
          <Card className={styles.playerCard} key={player.id}>
            <CardHeader>{player.name}</CardHeader>
            <CardBody className={styles.cardBodyAlt}>
              <div className={styles.cardContent}>
                <Checkbox
                  className={styles.checkboxAlt}
                  checked={player.vote !== null ? true : false}
                  disabled
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </section>
      <section className={styles.gameBoard}>
        <div className={styles.boardActions}>
          <button>Reveal</button>
          <button>Reset</button>
          <button>Delete</button>
          <button>Invite</button>
        </div>
        <div className={styles.gameData}>
          <div className={styles.gameStatus}>In Progress</div>
          <h3>Average: 0</h3>
        </div>
      </section>
      <section className={styles.sizeList}>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>0</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>1</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>2</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>3</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>5</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>8</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>13</div>
          </CardBody>
        </Card>
        <Card className={styles.numberCard}>
          <CardBody className={styles.cardBodyAlt}>
            <div className={styles.cardContent}>21</div>
          </CardBody>
        </Card>
      </section>
    </>
  );
};

export default GamePage;
