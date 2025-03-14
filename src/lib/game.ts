import { Game } from "@/app/context/AppCxt";
import { supabase } from "./supabaseClient";

const TABLE = "games";

export const createGame = async (name: string, playerID: number) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ name, owner: playerID }])
    .select();

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
