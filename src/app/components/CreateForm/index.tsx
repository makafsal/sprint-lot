import { createGame } from "@/lib/game";
import { createPlayer, updatePlayerByID } from "@/lib/player";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "../Loader";
import { GameType } from "@/app/types";

export const CreateForm = () => {
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [gameType, setGameType] = useState<GameType>("fibonacci");
  const [playerName, setPlayerName] = useState("");
  const router = useRouter();

  const onCreate = async () => {
    setLoading(true);
    if (!gameName?.trim() || !playerName?.trim()) return;

    let newPlayer = await createPlayer({ name: playerName });
    const newGame = await createGame({
      name: gameName,
      owner: newPlayer.id,
      type: gameType
    });
    newPlayer = await updatePlayerByID(newPlayer.id, { game: newGame.id });

    // Create session for current user in localStorage
    localStorage.setItem("player", JSON.stringify(newPlayer));

    if (newGame) {
      router.push(`/game/${newGame.game_id}`);
    }

    setLoading(false);
    setGameName("");
    setPlayerName("");
  };

  return (
    <>
      {loading && <Loader />}
      <div className="form vertical">
        <input
          type="text"
          placeholder="Game Name... *"
          onChange={(ev) => setGameName(ev?.target?.value)}
        />
        <input
          type="text"
          placeholder="Your Name..... *"
          onChange={(ev) => setPlayerName(ev?.target?.value)}
        />
        <select onChange={(ev) => setGameType(ev?.target?.value as GameType)}>
          <option value="fibonacci">
            Fibonacci (0, 1, 2, 3, 5, 8, 13, 21)
          </option>
          <option value="t-shirt">T-Shirts (XXS, XS, S, M, L, XL, XXL)</option>
          <option value="confidence">
            Confidence Score (0, 1, 2 ,3, 4, 5)
          </option>
        </select>
        <button onClick={() => onCreate()} disabled={loading}>
          Create
        </button>
      </div>
    </>
  );
};
