"use client";

import { useState } from "react";
import styles from "./checkbox.module.css";

export const Checkbox = () => {
  const [check, setCheck] = useState("[ ]");

  const toggle = () => {
    setCheck((prev) => {
      const _check = prev === "[ ]" ? "[x]" : "[ ]";

      return _check;
    });
  };

  return (
    <span role="button" className={styles.checkbox} onClick={toggle}>
      {check}
    </span>
  );
};
