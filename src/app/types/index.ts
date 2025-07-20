import { PropsWithChildren } from "react";

export interface CardProps extends PropsWithChildren {
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  hint?: string;
}

export interface CheckboxProps {
  className?: string;
  onToggle?: () => void;
  checked?: boolean;
  disabled?: boolean;
}

export interface DialogProps extends PropsWithChildren {
  open?: boolean;
  onYes?: () => void;
  onNo?: () => void;
  onClose?: () => void;
}

export interface JoinFormProps {
  sessionID?: string;
}

export type Theme = "light" | "dark";
export type GameType = "fibonacci" | "t-shirt" | "confidence";

export interface Game {
  average?: number;
  created_at?: string;
  game_id?: string;
  id?: number;
  name?: string;
  owner?: number | null;
  status?: "started" | "in_progress" | "done";
  type?: GameType;
  has_scoreboard?: boolean;
}

export interface Player {
  created_at?: string;
  game?: number;
  id?: number;
  name?: string;
  vote?: number | null;
  score?: number;
}

export interface Store {
  theme?: Theme;
  game?: Game;
}

export type Action = { type: "TOGGLE_THEME" | "UPDATE_GAME"; payload?: Store };

export interface Ticket {
  url: string;
  id?: number;
  gameId?: number;
}
