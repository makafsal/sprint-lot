import { PropsWithChildren } from "react";
import styles from "./Card.module.css";

interface Card extends PropsWithChildren {
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export const CardHeader = ({ children, className, selected }: Card) => {
  return (
    <div
      className={`${styles.title} ${className} ${
        selected ? styles.selected : ""
      }`}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className }: Card) => {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
};

export const Card = ({ children, className, onClick, disabled }: Card) => {
  return (
    <div
      className={`${styles.card} ${className} ${disabled ? styles.disabled : ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </div>
  );
};
