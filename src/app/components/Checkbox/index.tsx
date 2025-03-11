"use client";

import { useState } from "react";
import styles from "./checkbox.module.css";

interface Checkbox {
  className?: string;
}

export const Checkbox = ({ className }: Checkbox) => {
  const [check, setCheck] = useState("[ ]");

  const toggle = () => {
    setCheck((prev) => {
      const _check = prev === "[ ]" ? "[x]" : "[ ]";

      return _check;
    });
  };

  return (
    <span
      role="button"
      className={`${styles.checkbox} ${className}`}
      onClick={toggle}
    >
      {check}
    </span>
  );
};
