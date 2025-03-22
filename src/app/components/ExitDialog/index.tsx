import { DialogProps } from "@/app/types";


export const ExitDialog = (prop: DialogProps) => {
  return (
    <dialog open={prop.open}>
      <p>Do you want to exit from this game?</p>
      <div className="mt-1">
        <button onClick={prop.onYes}>Yes</button>
        <button onClick={prop.onNo}>No</button>
      </div>
    </dialog>
  );
};
