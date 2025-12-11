import React from "react";
import { Users, Lock } from "lucide-react";
import professionalImage from "../assets/vcniti find profetional.png"; 

const FindProf: React.FC = () => {
  return (
    <section id="find-professional" className="py-24 bg-gray-50 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* LEFT — Image with "Coming Soon" Overlay */}
          <div className="lg:w-1/2 relative">
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                    src={professionalImage} 
                    alt="Find Professionals" 
                    className="w-full h-auto filter grayscale-[30%]"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-4 border border-white/30">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-2xl font-bold">Network Locked</h3>
                    <p className="text-white/80 text-sm mt-2">Launching Next Month</p>
                </div>
             </div>

             {/* Decorative Elements */}
             <div className="absolute -z-10 top-10 -left-10 w-full h-full border-2 border-[#a852e5]/20 rounded-3xl"></div>
             <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Database</p>
                    <p className="text-gray-900 font-bold">1000+ Experts</p>
                </div>
             </div>
          </div>

          {/* RIGHT — Info */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                Beta Access
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Hire Trusted <br/>
              <span className="text-gray-400">Construction Pros</span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed border-l-4 border-gray-200 pl-6">
              Connect instantly with verified contractors, masons, carpenters, electricians, plumbers, 
              and construction experts in your area. We are currently vetting the best professionals 
              to ensure quality service.
            </p>

            <div className="flex flex-wrap gap-4">
                <button
                    disabled
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold shadow-md cursor-not-allowed opacity-80"
                >
                    <Lock size={18} /> Coming Soon
                </button>
                <button className="px-8 py-4 rounded-xl font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">
                    Join Waitlist
                </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FindProf;