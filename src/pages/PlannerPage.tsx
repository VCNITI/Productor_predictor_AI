import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PredictorForm from "../components/PredictorForm";
import AboutAIPlanner from "../components/AboutAIPlanner";

const PlannerPage: React.FC = () => {
  return (
    <div>
      <Header />
      <AboutAIPlanner />
      <PredictorForm />
      <Footer />
    </div>
  );
};

export default PlannerPage;
