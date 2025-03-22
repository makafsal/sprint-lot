import { CardProps } from "@/app/types";
import styles from "./Card.module.css";



export const CardHeader = ({ children, className, selected }: CardProps) => {
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

export const CardBody = ({ children, className }: CardProps) => {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
};

export const Card = ({ children, className, onClick, disabled }: CardProps) => {
  return (
    <div
      className={`${styles.card} ${className} ${disabled ? styles.disabled : ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </div>
  );
};
