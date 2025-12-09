import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIPlanner from '../components/AIPlanner';
import PredictorForm from '../components/PredictorForm';
import AboutAIPlanner from '../components/AboutAIPlanner';
import Hero from '../components/Hero';

const HomePage: React.FC = () => {
  const [showPredictorForm, setShowPredictorForm] = useState(false);

  const handleUsePlannerClick = () => {
    setShowPredictorForm(true);
  };

  const handleHomeClick = () => {
    setShowPredictorForm(false);
  };

  return (
    <div>
      <Header onHomeClick={handleHomeClick} />
      <Hero />
      {showPredictorForm ? (
        <>
          <AboutAIPlanner />
          <PredictorForm />
        </>
      ) : (
        <AIPlanner onUsePlannerClick={handleUsePlannerClick} />
      )}
      <Footer />
    </div>
  );
};

export default HomePage;
