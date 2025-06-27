import { DialogProps } from "@/app/types";
import { useEffect, useRef } from "react";

export const ScoreInfoModal = ({ open, onClose }: DialogProps) => {
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
      <h2>Scoreboard Info</h2>
      <section className="mt-1">
        <table>
          <thead>
            <tr>
              <th>🧠 Your Guess is...</th>
              <th>🎯 You Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Within ±0.5 of the average</td>
              <td>⭐️ 5 points</td>
            </tr>
            <tr>
              <td>Within ±1.0 of the average</td>
              <td>👍 3 points</td>
            </tr>
            <tr>
              <td>Within ±1.5 of the average</td>
              <td>👌 2 points</td>
            </tr>
            <tr>
              <td>More than ±1.5 away from the average</td>
              <td>😐 0 points</td>
            </tr>
          </tbody>
        </table>
      </section>
      <footer className="mt-1 text-align-right">
        <button onClick={onClose}>Close</button>
      </footer>
    </dialog>
  );
};
