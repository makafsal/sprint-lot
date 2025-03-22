import { DialogProps } from "@/app/types";

export const ReadyNotification = ({ open }: DialogProps) => {
  return <dialog open={open}>Ready to reveal! 🤠</dialog>;
};
