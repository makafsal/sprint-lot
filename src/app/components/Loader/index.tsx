import styles from "./loader.module.css";

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <p className={styles.text}>Loading...</p>
    </div>
  );
};
