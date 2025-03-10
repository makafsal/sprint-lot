import { useSearchParams } from "next/navigation";
import styles from "./Home.module.css";

export const Home = () => {
  const searchParams = useSearchParams();
  const formType = searchParams.get("type") || "create";

  const getForm = () => {
    if (formType === "join") {
      return (
        <form className="vertical">
          <input type="text" placeholder="Game ID... *" />
          <input type="text" placeholder="Your Name... *" />
          <button>Join</button>
        </form>
      );
    } else {
      return (
        <form className="vertical">
          <input type="text" placeholder="Game Name... *" />
          <input type="text" placeholder="Your Name... *" />
          <button>Create</button>
        </form>
      );
    }
  };

  return (
    <div className={styles.home}>
      <h1>SprintLot</h1>
      <section className={styles.formSection}>{getForm()}</section>
    </div>
  );
};
