import { Suspense } from "react";
import { FacilitatorView } from "../components/FacilitatorView/FacilitatorView";

const FacilitatorPage = () => (
  <Suspense>
    <FacilitatorView />
  </Suspense>
);

export default FacilitatorPage;
