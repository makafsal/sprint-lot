import { PropsWithChildren } from "react";
import styles from "./Card.module.css";

export const CardHeader = ({ children }: PropsWithChildren) => {
  return <div className={styles.title}>{children}</div>;
};

export const CardBody = ({ children }: PropsWithChildren) => {
  return <div className={styles.body}>{children}</div>;
};

export const Card = ({ children }: PropsWithChildren) => {
  return <div className={styles.card}>{children}</div>;
};
