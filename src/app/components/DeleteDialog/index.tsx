import { DialogProps } from "@/app/types";
import { useEffect, useRef } from "react";

export const DeleteDialog = ({ open, onYes, onNo }: DialogProps) => {
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
      <p>Do you want to delete this game?</p>
      <br />
      <small>Warning: All other players will lose access to it.</small>
      <div className="mt-1">
        <button onClick={onYes}>Yes</button>
        <button onClick={onNo}>No</button>
      </div>
    </dialog>
  );
};
