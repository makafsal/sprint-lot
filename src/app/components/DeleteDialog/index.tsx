interface DeleteDialog {
  open?: boolean;
  onYes?: () => void;
  onNo?: () => void;
}

export const DeleteDialog = (props: DeleteDialog) => {
  return (
    <dialog open={props.open}>
      <p>Do you want to delete this game?</p>
      <br />
      <small>Warning: All other players will lose access to it.</small>
      <div className="mt-1">
      <button onClick={props.onYes}>Yes</button>
      <button onClick={props.onNo}>No</button>
      </div>
    </dialog>
  );
};
