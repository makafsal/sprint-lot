import { createContext } from "react";
import { Action, Store, Theme } from "../types";

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
