interface ReadyNotification {
  open?: boolean;
}

export const ReadyNotification = ({ open }: ReadyNotification) => {
  return <dialog open={open}>Ready to reveal! 🤠</dialog>;
};
