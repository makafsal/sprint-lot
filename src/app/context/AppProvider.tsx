"use client";

import { ReactNode, useEffect, useReducer } from "react";
import { AppCxt, appReducer, defaultState } from "./AppCxt";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, defaultState);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state]);

  return (
    <AppCxt.Provider value={{ state, dispatch }}>{children}</AppCxt.Provider>
  );
};
