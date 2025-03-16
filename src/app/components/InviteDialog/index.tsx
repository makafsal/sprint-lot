"use client";

import { useState } from "react";

interface InviteDialog {
  open?: boolean;
  gameID?: string;
  onClose?: () => void;
}

export const InviteDialog = (props: InviteDialog) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (props.gameID) {
      await navigator.clipboard.writeText(props.gameID);
      setCopied(true);

      setTimeout(() => {
        props.onClose?.();
        setCopied(false);
      }, 1000);
    }
  };

  return (
    <dialog open={props.open}>
      <code>{props.gameID}</code>
      <button className="ml-1" onClick={() => copy()}>
        {" "}
        &#x2398;
      </button>
      <button onClick={() => props.onClose?.()}>X</button>
      {copied && (
        <div className="mt-1">
          <small>Copied!</small>
        </div>
      )}
    </dialog>
  );
};
