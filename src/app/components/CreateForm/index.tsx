import { createGame } from "@/lib/game";
import { createPlayer, updatePlayerByID } from "@/lib/player";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const CreateForm = () => {
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const router = useRouter();

  const onCreate = async () => {
    setLoading(true);
    if (!gameName?.trim() || !playerName?.trim()) return;

    let newPlayer = await createPlayer({ name: playerName });
    const newGame = await createGame(gameName, newPlayer.id);
    newPlayer = await updatePlayerByID(newPlayer.id, { game: newGame.id });
    console.log(newPlayer)

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
      <button onClick={() => onCreate()} disabled={loading}>
        Create
      </button>
    </div>
  );
};
