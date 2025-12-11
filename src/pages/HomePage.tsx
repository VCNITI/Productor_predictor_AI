import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIPlanner from '../components/AIPlanner';
import FindProf from '../components/FindProf';
import Hero from '../components/Hero';


const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <Hero />

      <AIPlanner />
      <FindProf />
      <Footer />
    </div>
  );
};

export default HomePage;
