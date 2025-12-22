import React from "react";
import PredictorForm from "../components/PredictorForm";
import AboutAIPlanner from "../components/AboutAIPlanner";

const PlannerPage: React.FC = () => {
  return (
    <div>
      <AboutAIPlanner />
      <PredictorForm />
    </div>
  );
};

export default PlannerPage;
