import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIPlanner from '../components/AIPlanner';
import Hero from '../components/Hero';


const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <Hero />

      <AIPlanner />
      <Footer />
    </div>
  );
};

export default HomePage;
