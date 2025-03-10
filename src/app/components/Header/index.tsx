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
    console.log(pathname);
    if (pathname === "/") {
      return "";
    } else {
      return "SprintLot";
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
        {formType === "join" ? (
          <button onClick={() => handleSetForm("create")}>Create</button>
        ) : (
          <button onClick={() => handleSetForm("join")}>Join</button>
        )}
      </menu>
    </header>
  );
};
