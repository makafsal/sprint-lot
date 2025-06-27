import { DialogProps } from "@/app/types";
import { useEffect, useRef } from "react";

export const ExitDialog = ({ open, onYes, onNo }: DialogProps) => {
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

  return (
    <dialog ref={dialogRef}>
      <p>Do you want to exit from this game?</p>
      <footer className="mt-1 text-align-right">
        <button onClick={onYes}>Yes</button>
        <button onClick={onNo}>No</button>
      </footer>
    </dialog>
  );
};
