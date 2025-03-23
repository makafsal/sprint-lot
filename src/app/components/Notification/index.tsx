import { DialogProps } from "@/app/types";

export const Notification = ({ open, children }: DialogProps) => {
  return <dialog open={open}>{children}</dialog>;
};
