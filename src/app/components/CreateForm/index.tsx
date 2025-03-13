import { createGame } from "@/lib/game";
import { createPlayer, updatePlayer } from "@/lib/player";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const CreateForm = () => {
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState("");
  const [player, setPlayer] = useState("");
  const router = useRouter();

  const onCreate = async () => {
    setLoading(true);
    if (!game?.trim() || !player?.trim()) return;

    let newPlayer = await createPlayer(player);
    const newGame = await createGame(game, newPlayer.id);
    newPlayer = await updatePlayer(newPlayer.id, { game: newGame.id });

    // Create session for current user in localStorage
    localStorage.setItem("player", JSON.stringify(newPlayer));

    if (newGame) {
      alert(`Game created: ${newGame.name}`);
      setTimeout(() => {
        setLoading(false);
        setGame("");
        setPlayer("");
        router.push(`/game/${newGame.game_id}`);
      }, 1000);
    }
  };

  return (
    <div className="form vertical">
      <input
        type="text"
        placeholder="Game Name... *"
        onChange={(ev) => setGame(ev?.target?.value)}
      />
      <input
        type="text"
        placeholder="Your Name..... *"
        onChange={(ev) => setPlayer(ev?.target?.value)}
      />
      <button onClick={() => onCreate()} disabled={loading}>
        Create
      </button>
    </div>
  );
};
