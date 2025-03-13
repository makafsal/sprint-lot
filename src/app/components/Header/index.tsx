"use client";

import { useContext, useEffect, useState } from "react";
import "./header.css";
import { AppCxt } from "@/app/context/AppCxt";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const Header = () => {
  const [isClient, setIsClient] = useState(false);
  const { state, dispatch } = useContext(AppCxt);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = searchParams.get("type") || "create";

  const toggleTheme = () => dispatch({ type: "TOGGLE_THEME" });

  const handleSetForm = (type: "create" | "join") => {
    router.push(`?type=${type}`, { scroll: false }); // Update URL without reload
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getPageTitle = () => {
    if (pathname === "/") {
      return "";
    } else {
      return state.game?.name || "SprintLot";
    }
  };

  const getButton = () => {
    if (pathname?.toString()?.includes("/game/")) {
      return <button>Exit</button>;
    } else if (formType === "join") {
      return <button onClick={() => handleSetForm("create")}>Create</button>;
    } else {
      return <button onClick={() => handleSetForm("join")}>Join</button>;
    }
  };

  return (
    <header>
      <h1>{getPageTitle()}</h1>
      <menu>
        <button
          onClick={toggleTheme}
          title={`${
            isClient && state.theme === "dark" ? "Light" : "Dark"
          } mode`}
        >
          {isClient && state.theme === "dark" ? "[☀️]" : "[🌙]"}
        </button>
        {getButton()}
      </menu>
    </header>
  );
};
