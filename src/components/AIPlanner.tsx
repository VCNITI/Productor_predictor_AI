import React from 'react';
import { HardHat } from 'lucide-react';
import plannerImage from '../assets/vcniti product planner page.png';

interface AIPlannerProps {
  onUsePlannerClick: () => void;
}

const AIPlanner: React.FC<AIPlannerProps> = ({ onUsePlannerClick }) => {
  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-10">
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          <div className="md:w-1/2">
            <div className="relative">
              <img src={plannerImage} alt="Building Planner" className="rounded-xl shadow-lg" />
              <div className="absolute -bottom-4 -left-4 bg-primary p-4 rounded-full text-white shadow-lg">
                <HardHat size={32} />
              </div>
            </div>
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">VCNITI Building Material Planner</h2>
            <p className="text-lg text-gray-600 mb-8">
              Plan your construction project with our innovative Building Material Planner. Estimate material quantities, costs, and timelines with ease, ensuring your project stays on budget and on schedule.
            </p>
            <a
              onClick={onUsePlannerClick}
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-transform transform hover:scale-105 shadow-md"
            >
              Use the Planner
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIPlanner;
