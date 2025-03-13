import { useSearchParams } from "next/navigation";
import styles from "./Home.module.css";
import { CreateForm } from "../CreateForm";

export const Home = () => {
  const searchParams = useSearchParams();
  const formType = searchParams.get("type") || "create";

  const getForm = () => {
    if (formType === "join") {
      return (
        <div className="form vertical">
          <input type="text" placeholder="Game ID... *" />
          <input type="text" placeholder="Your Name... *" />
          <button>Join</button>
        </div>
      );
    } else {
      return <CreateForm />;
    }
  };

  return (
    <div className={styles.home}>
      <h1>SprintLot</h1>
      <section className={styles.formSection}>{getForm()}</section>
    </div>
  );
};
