import { PropsWithChildren } from "react";
import styles from "./Card.module.css";

interface Card extends PropsWithChildren {
  className?: string;
}

export const CardHeader = ({ children, className }: Card) => {
  return <div className={`${styles.title} ${className}`}>{children}</div>;
};

export const CardBody = ({ children, className }: Card) => {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
};

export const Card = ({ children, className }: Card) => {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
};
