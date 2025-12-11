import React from "react";
import { Users } from "lucide-react";
import professionalImage from "../assets/vcniti find profetional.png"; 

const FindProf: React.FC = () => {
  return (
    <section id="find-professional" className="py-20 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* LEFT — Image */}
          <div className="md:w-1/2">
            <div className="relative">
              <img 
                src={professionalImage} 
                alt="Find Professionals" 
                className="rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-4 -left-4 bg-primary p-4 rounded-full text-white shadow-lg">
                <Users size={32} />
              </div>
            </div>
          </div>

          {/* RIGHT — Info */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Find a Construction Professional <span className="text-base align-middle text-gray-500">(Coming Soon)</span>
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Connect instantly with verified contractors, masons, carpenters, electricians, plumbers, 
              and construction experts in your area. Choose your state, city, and pincode to get 
              location-specific results.  
            </p>

            <button
              disabled
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-md opacity-50 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindProf;
