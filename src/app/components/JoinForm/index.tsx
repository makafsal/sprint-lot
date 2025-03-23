"use client";

import { useState } from "react";
import { getGameByID } from "@/lib/game";
import { createPlayer } from "@/lib/player";
import { useRouter } from "next/navigation";
import { Loader } from "../Loader";
import { Game, JoinFormProps } from "@/app/types";

export const JoinForm = ({ sessionID }: JoinFormProps) => {
  const [gameID, setGameID] = useState<string | undefined>(sessionID);
  const [playerName, setPlayerName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [showNoFoundErr, setShowNoFoundErr] = useState(false);
  const router = useRouter();

  const onJoin = async () => {
    if (gameID?.trim()?.length && playerName?.trim()?.length) {
      setLoading(true);

      const game: Game = await getGameByID(gameID);

      if (game) {
        setShowNoFoundErr(false);
        const newPlayer = await createPlayer({
          name: playerName,
          game: game.id
        });
        localStorage.setItem("player", JSON.stringify(newPlayer));

        router.push(`/game/${gameID}`);
      } else {
        setLoading(false);
        setShowNoFoundErr(true);
      }

      setGameID("");
      setPlayerName("");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="form vertical">
        <input
          defaultValue={gameID}
          onChange={(ev) => setGameID(ev?.target?.value)}
          type="text"
          placeholder="Game ID... *"
        />
        <input
          onChange={(ev) => setPlayerName(ev?.target?.value)}
          type="text"
          placeholder="Your Name... *"
        />
        <button
          onClick={() => onJoin()}
          disabled={
            loading || !gameID?.trim()?.length || !playerName?.trim()?.length
          }
        >
          Join
        </button>
        {showNoFoundErr && <p className="error-message">Game not found! 🔍</p>}
      </div>
    </>
  );
};
