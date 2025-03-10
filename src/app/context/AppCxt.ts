import { createContext } from "react";

export type Theme = "light" | "dark";

export interface Store {
  theme: Theme;
}

type Action = { type: "TOGGLE_THEME" };

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

    default:
      return state;
  }
};
