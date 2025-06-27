import { DialogProps } from "@/app/types";
import { useEffect, useRef } from "react";

export const Notification = ({ open, children }: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal(); // ensures backdrop
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return <dialog ref={dialogRef}>{children}</dialog>;
};
