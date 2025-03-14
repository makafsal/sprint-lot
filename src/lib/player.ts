import { Player } from "@/app/context/AppCxt";
import { supabase } from "./supabaseClient";

const TABLE = "players";

export const createPlayer = async ({ name, game }: Player) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ name, game }])
    .select();

  if (error) {
    console.error("Error creating player:", error);
    return null;
  }

  return data[0]; // Return the newly created player object
};

export const updatePlayer = async (playerID: number, payload: Player) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload })
    .eq("id", playerID)
    .select();

  if (error) {
    console.error(`Error updating player with ${payload}:`, error);
    return null;
  }

  return data;
};

export const getAllPlayersByGameID = async (gameId: number) => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("game", gameId); // Filter by game_id

  if (error) {
    console.error("Error fetching players:", error);
    return [];
  }

  return data; // Return the list of players
};
