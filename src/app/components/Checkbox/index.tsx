"use client";

import { useEffect, useState } from "react";
import styles from "./checkbox.module.css";

interface Checkbox {
  className?: string;
  onToggle?: () => void;
  checked?: boolean;
  disabled?: boolean;
}

export const Checkbox = ({
  className,
  onToggle,
  checked,
  disabled
}: Checkbox) => {
  const [check, setCheck] = useState<boolean>(checked || false);

  const toggle = () => {
    setCheck(!check);

    onToggle?.();
  };

  useEffect(() => {
    setCheck(checked || false);
  }, [checked]);

  return (
    <span
      role="button"
      className={`${styles.checkbox} ${className}`}
      onClick={!disabled ? toggle : undefined}
    >
      {check ? "[x]" : "[ ]"}
    </span>
  );
};
