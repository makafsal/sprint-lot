import { PropsWithChildren } from "react";

export interface CardProps extends PropsWithChildren {
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export interface CheckboxProps {
  className?: string;
  onToggle?: () => void;
  checked?: boolean;
  disabled?: boolean;
}

export interface DialogProps {
  open?: boolean;
  onYes?: () => void;
  onNo?: () => void;
  onClose?: () => void;
  // Dialog specific
  gameID?: string;
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

export type Action = { type: "TOGGLE_THEME" | "UPDATE_GAME"; payload?: Store };
