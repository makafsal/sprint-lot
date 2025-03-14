import { useSearchParams } from "next/navigation";
import styles from "./Home.module.css";
import { CreateForm } from "../CreateForm";
import { JoinForm } from "../JoinForm";

export const Home = () => {
  const searchParams = useSearchParams();
  const formType = searchParams.get("type") || "create";

  const getForm = () => {
    if (formType === "join") {
      return <JoinForm />;
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
