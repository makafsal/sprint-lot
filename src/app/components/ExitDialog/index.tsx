interface ExitDialog {
  open?: boolean;
  onYes?: () => void;
  onNo?: () => void;
}

export const ExitDialog = (prop: ExitDialog) => {
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
