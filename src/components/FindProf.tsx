import React from "react";
import { Users, ArrowRight, CheckCircle2 } from "lucide-react";
import professionalImage from "../assets/vcniti find profetional.png";
import { useNavigate } from "react-router-dom";

const FindProf: React.FC = () => {
  const navigate = useNavigate();

  const handleFindProsClick = () => {
    navigate("/find-professionals");
  };

  return (
    <section 
      id="find-professional" 
      // --- UPDATED PADDING HERE (py-10 instead of py-20 for mobile) ---
      className="py-10 md:py-20 relative overflow-hidden bg-white"
    >
      
      {/* Background Decor (Matching AI Planner style) */}
      <div className="absolute inset-0 bg-gray-50/50 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-3xl -ml-32 -mb-32"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- MAIN CARD CONTAINER --- */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-900/5 border border-gray-100 p-8 md:p-12 overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            
            {/* LEFT — Image Section */}
            <div className="lg:w-1/2 relative group">
              {/* Image Back Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#a852e5] to-purple-400 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative rounded-[2rem] overflow-hidden shadow-lg border border-white/50 transform transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src={professionalImage}
                  alt="Find Verified Professionals"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Stats Card (Bottom Right) */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
                <div className="bg-[#a852e5]/10 p-2.5 rounded-xl text-[#a852e5]">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Active Pros
                  </p>
                  <p className="text-gray-900 font-bold">2,500+</p>
                </div>
              </div>
            </div>

            {/* RIGHT — Content Section */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-[#a852e5]/10 text-[#a852e5] text-xs font-bold px-3 py-1 rounded-full mb-6 border border-[#a852e5]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a852e5] animate-pulse"></span>
                Now Available in Bengaluru
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Hire Verified <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a852e5] to-purple-600">
                  Construction Experts
                </span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stop searching blindly. Connect instantly with verified Contractors, 
                Architects, Builders and Engineers. Compare profiles
                and hire the best talent for your project directly.
              </p>

              <ul className="space-y-3 mb-10">
                  {[
                      "100% Verified Profiles & Background Checks",
                      "Direct Contact - No Middlemen",
                      "Compare Quotes & Save Money"
                  ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> {item}
                      </li>
                  ))}
              </ul>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleFindProsClick}
                  className="
                    inline-flex items-center gap-2 
                    bg-[#a852e5] hover:bg-[#903dd0] 
                    text-white px-8 py-4 rounded-xl 
                    font-bold shadow-lg shadow-[#a852e5]/30 
                    transition-all transform hover:-translate-y-1 active:translate-y-0
                  "
                >
                  Find Professionals <ArrowRight size={20} />
                </button>
                
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FindProf;