import { Game } from "@/app/types";
import { supabase } from "./supabaseClient";

const TABLE = "games";

export const createGame = async (game: Game) => {
  const { data, error } = await supabase.from(TABLE).insert([game]).select();

  if (error) {
    console.error("Error creating game:", error);
    return null;
  }

  return data[0]; // Return the newly created game object
};

export const getGameByID = async (game_id: string) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("game_id", game_id)
    .single();

  if (error) {
    console.error("Error creating game:", error);
    return null;
  }

  return data;
};

export const updateGame = async (gameID: number, payload: Game) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload })
    .eq("id", gameID)
    .select();

  if (error) {
    console.error(`Error updating game with ${payload}:`, error);
    return null;
  }

  return data[0];
};

export const deleteGameByID = async (gameID: number) => {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", gameID)
    .select();

  if (error) {
    console.error(`Error deleting game with id ${gameID}:`, error);
    return false;
  }

  return data[0];
};
