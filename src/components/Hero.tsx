import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Brain, HardHat, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative w-full overflow-hidden bg-white">
      {/* Background Decor: Architectural Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-40">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 40L40 0H20L0 20M40 40V20L20 40"
                stroke="#a852e5"
                strokeWidth="0.5"
                fill="none"
                opacity="0.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Background Blurs for Depth */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#c58bff]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#a852e5]/10 rounded-full blur-3xl" />

      {/* --- UPDATED PADDING HERE: Changed pt-20 to pt-10 for mobile --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-8 md:pt-20 md:pb-26 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT COLUMN: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-[#a852e5] text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
            </span>
            VCNITI Ecosystem
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
            Smart Construction <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a852e5] to-[#7c3aed]">
              Simplified by AI
            </span>
          </h1>

          <p className="text-lg text-gray-600 mt-6 leading-relaxed max-w-lg">
            From estimate to execution: materials, AI tools, and pros on VCNITI,{" "}
            <strong>4-hour ultra fast delivery.</strong>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#a852e5] text-white font-semibold hover:bg-[#903dd0] transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 group"
              onClick={() =>
                (window.location.href = "https://www.vcniti.com")
              }
            >
              Order Materials
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#ai-planner"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-transparent border-2 border-[#a852e5] text-[#a852e5] font-bold hover:bg-[#a852e5] hover:text-white transition-colors duration-300 shadow-sm flex items-center justify-center"
            >
              AI Estimator
            </a>

            <a
              href="#find-professional"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-transparent border-2 border-[#a852e5] text-[#a852e5] font-bold hover:bg-[#a852e5] hover:text-white transition-colors duration-300 shadow-sm flex items-center justify-center"
            >
              Find Pros
            </a>
          </div>

          {/* Trust Footnote */}
          <div className="mt-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Genuine Brands
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 95% Accurate Estimates
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Verified Pros
            </div>

          </div>
        </motion.div>

        {/* RIGHT COLUMN: Visual Representation (Floating Cards) */}
        <div className="relative h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center lg:justify-end">
          {/* Abstract Background blob behind cards */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-white rounded-full opacity-50 blur-2xl transform scale-90" />

          {/* Floating Card Container */}
          <div className="relative w-full max-w-md">
            {/* Card 1: Main Feature (Delivery) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-20 bg-white/80 backdrop-blur-md border border-white/40 p-6 rounded-2xl shadow-xl shadow-purple-900/5 mb-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Express Delivery
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Cement, Paints & Electricals
                  </p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                  <Truck size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-[#a852e5]"
                  />
                </div>
                <span className="text-xs font-bold text-[#a852e5] whitespace-nowrap">
                  4 Hours
                </span>
              </div>
            </motion.div>

            {/* Grid of 2 smaller cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Card 2: AI Tools */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/90 backdrop-blur-md border border-white/40 p-5 rounded-2xl shadow-lg shadow-purple-900/5"
              >
                <div className="bg-blue-50 w-10 h-10 flex items-center justify-center rounded-lg text-blue-600 mb-3">
                  <Brain size={20} />
                </div>
                <h4 className="font-bold text-gray-900">AI Estimator</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Instant material estimates
                </p>
              </motion.div>

              {/* Card 3: Professionals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/90 backdrop-blur-md border border-white/40 p-5 rounded-2xl shadow-lg shadow-purple-900/5"
              >
                <div className="bg-orange-50 w-10 h-10 flex items-center justify-center rounded-lg text-orange-600 mb-3">
                  <HardHat size={20} />
                </div>
                <h4 className="font-bold text-gray-900">Find Pros</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Contractors, Architects & more
                </p>

              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;