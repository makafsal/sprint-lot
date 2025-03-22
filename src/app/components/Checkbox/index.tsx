"use client";

import { useEffect, useState } from "react";
import styles from "./checkbox.module.css";
import { CheckboxProps } from "@/app/types";

export const Checkbox = ({
  className,
  onToggle,
  checked,
  disabled
}: CheckboxProps) => {
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
