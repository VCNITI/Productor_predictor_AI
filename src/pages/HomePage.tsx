import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AIPlanner from "../components/AIPlanner";
import FindProf from "../components/FindProf";
import Hero from "../components/Hero";

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div>
      <Hero />

      <AIPlanner />
      <FindProf />
    </div>
  );
};

export default HomePage;
