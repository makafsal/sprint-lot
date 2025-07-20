"use client";

import { useContext, useEffect, useState } from "react";
import "./header.css";
import { AppCxt } from "@/app/context/AppCxt";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Player } from "@/app/types";
import { playBeep, playLightSwitch } from "@/app/utils/sounds";

export const Header = () => {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<Player | null>(null);
  const { state, dispatch } = useContext(AppCxt);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = searchParams.get("type") || "create";

  const toggleTheme = () => dispatch({ type: "TOGGLE_THEME" });
  const toggleSound = () => dispatch({ type: "TOGGLE_SOUND" });

  const handleSetForm = (type: "create" | "join") => {
    router.push(`?type=${type}`, { scroll: false }); // Update URL without reload
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");
    const player = JSON.parse(storedPlayer || "{}");

    setUser(player);
  }, [state.game]);

  const getPageTitle = () => {
    if (pathname === "/") {
      return "";
    } else {
      return state.game?.name || "SprintLot";
    }
  };

  const getFormButton = () => {
    if (pathname?.toString()?.includes("/game/")) {
      return;
    } else if (formType === "join") {
      return <button onClick={() => handleSetForm("create")}>Create</button>;
    } else if (pathname !== "/facilitator") {
      return <button onClick={() => handleSetForm("join")}>Join</button>;
    }
  };

  const getGameButton = () => {
    if (
      isClient &&
      state.game?.owner === user?.id &&
      pathname !== "/" &&
      pathname !== "/facilitator"
    ) {
      return (
        <a
          className="btn"
          href={`/facilitator?gameId=${state.game?.game_id}`}
          target="_blank"
        >
          Facilitator
        </a>
      );
    }

    if (isClient && pathname === "/facilitator") {
      return (
        <a
          className="btn"
          href={`/game/${state.game?.game_id}`}
          target="_blank"
        >
          Back to game
        </a>
      );
    }
  };

  return (
    <header>
      <h1>{getPageTitle()}</h1>
      <menu>
        <button
          onClick={() => {
            if (state.sound) {
              playLightSwitch();
            }
            toggleTheme();
          }}
          title={`${
            isClient && state.theme === "dark" ? "Light" : "Dark"
          } mode`}
        >
          {isClient && state.theme === "dark" ? "[☀️]" : "[🌙]"}
        </button>
        <button
          onClick={() => {
            if (!state.sound) {
              playBeep();
            }
            toggleSound();
          }}
          title={`Sound ${isClient && state.sound ? "off" : "on"}`}
        >
          {isClient && state.sound ? "[🔊]" : "[🔇]"}
        </button>
        {getGameButton()}
        {getFormButton()}
      </menu>
    </header>
  );
};
