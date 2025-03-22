import { Player } from "@/app/types";
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

export const updatePlayerByID = async (playerID: number, payload: Player) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload })
    .eq("id", playerID)
    .select();

  if (error) {
    console.error(`Error updating player with ${payload}:`, error);
    return null;
  }

  return data[0];
};

export const getAllPlayersByGameID = async (gameId: number) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("game", gameId); // Filter by game_id

  if (error) {
    console.error("Error fetching players:", error);
    return [];
  }

  return data; // Return the list of players
};

export const updateAllPlayersByGameID = async (
  gameId: number,
  payload: Player
) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload })
    .eq("game", gameId);

  if (error) {
    console.error("Error resetting votes:", error);
    return [];
  }

  return data;
};

export const deletePlayerByID = async (playerID: number) => {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", playerID)
    .select();

  if (error) {
    console.error(`Error deleting player with id ${playerID}:`, error);
    return false;
  }

  return data[0];
};

export const deleteAllPlayerByGameID = async (gameID: number) => {
  const { error } = await supabase.from(TABLE).delete().eq("game", gameID);

  if (error) {
    console.error(`Error deleting player with game id ${gameID}:`, error);
    return false;
  }

  return true;
};
