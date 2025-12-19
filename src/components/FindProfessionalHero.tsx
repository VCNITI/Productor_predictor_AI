import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  UserCheck,
  Phone,
  Star,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const FindProfessionalHero = () => {
  const scrollToSearch = () => {
    // Scrolls to the search section (assuming your FindProfessional component has id="find-professional-search" or similar)
    const searchSection = document.getElementById("find-professional-search") || document.getElementById("find-professional");
    searchSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 lg:py-10">
      
      {/* --- BACKGROUND DECOR (Matching Reference) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#a852e5]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid-pattern-pros"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 40L40 0H20L0 20M40 40V20L20 40"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern-pros)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- LEFT: CONTENT --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-[#f3e8ff] text-[#a852e5] text-xs font-bold px-3 py-1 rounded-full mb-6 border border-[#a852e5]/20">
              <Shield className="w-3 h-3" /> 100% Verified Network
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Find the Right <br />
              <span className="text-[#a852e5]">Professionals</span>
              <span className="text-[#000000]">, Effortlessly</span>
            </h2>

            <p className="text-lg text-gray-600 mt-6 leading-relaxed">
              Connect instantly with top rated Contractors, Architects, Builders and 
              Engineers in your vicinity. We vet every professional so you can 
              build with confidence.
            </p>

            {/* Stats Row */}
            <div className="flex gap-8 mt-8 py-6 border-y border-gray-100">
              <div>
                <div className="text-2xl font-bold text-gray-900">2,500+</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Active Pros
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Avg Rating
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0%</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Commission
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={scrollToSearch}
                className="px-8 py-3.5 rounded-xl bg-[#a852e5] text-white font-semibold hover:bg-[#933bd0] transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" /> Find Professionals
              </button>

              {/* <button
                className="px-8 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-5 h-5 text-gray-500" />
                Join as a Pro
              </button> */}
            </div>
          </motion.div>

          {/* --- RIGHT: VISUAL MOCKUP --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Abstract Glow Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#a852e5]/20 to-blue-200/20 rounded-[2rem] blur-3xl transform rotate-3 scale-95" />

            {/* The Mockup Card */}
            <div className="relative bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden p-6 max-w-md mx-auto lg:ml-auto">
              
              {/* Fake Search Bar floating at top */}
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-6 border border-gray-100">
                 <div className="p-2 bg-white rounded-lg shadow-sm text-[#a852e5]">
                    <MapPin size={18} />
                 </div>
                 <div className="h-2 w-24 bg-gray-200 rounded-full"></div>
                 <div className="ml-auto h-2 w-8 bg-gray-200 rounded-full"></div>
              </div>

              {/* Profile Card Mockup */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 relative overflow-hidden group">
                 {/* Top Accent */}
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#a852e5] to-blue-500"></div>
                 
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 flex items-center justify-center textxl font-bold text-[#a852e5] shadow-sm">
                            A
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">Aashritha Const.</h4>
                            <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-bold text-gray-700">4.9</span>
                                <span className="text-xs text-gray-400">(120 Reviews)</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-green-100">
                        Verified
                    </div>
                 </div>

                 {/* Tags */}
                 <div className="flex gap-2 mb-6">
                    <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs font-medium">Contractor</span>
                    <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs font-medium">Civil</span>
                 </div>

                 {/* Fake Action Buttons */}
                 <div className="flex gap-3">
                    <div className="flex-1 bg-[#a852e5] h-10 rounded-xl flex items-center justify-center gap-2 text-white text-sm font-bold shadow-md shadow-purple-200">
                        <Phone size={14} /> Call Now
                    </div>
                    <div className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400">
                        <UserCheck size={16} />
                    </div>
                 </div>
              </div>

              {/* Decorative "Match Found" Toast */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 whitespace-nowrap animate-bounce-slow">
                  <CheckCircle2 size={14} className="text-green-400" /> 15 Pros found in 560001
              </div>

            </div>
          </motion.div>
        </div>

        {/* --- BOTTOM: HOW IT WORKS --- */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <h3 className="text-center text-2xl font-bold text-gray-900 mb-12">
            How to Find Pros on 
            <span className="text-[#a852e5]"> VCNITI</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Select Location",
                desc: "Enter your pincode or area to find local experts.",
                icon: <MapPin className="text-blue-600" />,
              },
              {
                title: "Compare Profiles",
                desc: "View verified profiles, ratings, and specialties.",
                icon: <UserCheck className="text-[#a852e5]" />,
              },
              {
                title: "Connect Directly",
                desc: "Get phone numbers & emails. No middleman.",
                icon: <Phone className="text-green-600" />,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 border border-gray-100">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 text-lg">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindProfessionalHero;