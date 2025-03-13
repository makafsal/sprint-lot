import { supabase } from "./supabaseClient";

export const createGame = async (name: string, playerID: number) => {
  const { data, error } = await supabase
    .from("games")
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
    .from("games")
    .select("*")
    .eq("game_id", game_id)
    .single();

  if (error) {
    console.error("Error creating game:", error);
    return null;
  }

  return data;
};
