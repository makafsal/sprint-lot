import { createContext } from "react";

export type Theme = "light" | "dark";

export interface Game {
  average?: number;
  created_at?: string;
  game_id?: string;
  id?: number;
  name?: string;
  owner?: number | null;
  status?: "started" | "in_progress" | "done";
}

export interface Player {
  created_at?: string;
  game?: number;
  id?: number;
  name?: string;
  vote?: number | null;
}

export interface Store {
  theme?: Theme;
  game?: Game;
}

type Action = { type: "TOGGLE_THEME" | "UPDATE_GAME"; payload?: Store };

export const defaultState: Store = {
  theme:
    ((typeof window !== "undefined" &&
      localStorage.getItem("theme")) as Theme) || "light"
};

export const AppCxt = createContext<{
  state: Store;
  dispatch: React.Dispatch<Action>;
}>({
  state: defaultState,
  dispatch: () => {}
});

export const appReducer = (state: Store, action: Action): Store => {
  switch (action.type) {
    case "TOGGLE_THEME":
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);

      return {
        ...state,
        theme: newTheme
      };

    case "UPDATE_GAME":
      return {
        ...state,
        game: action.payload?.game
      };

    default:
      return state;
  }
};
