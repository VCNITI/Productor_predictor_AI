import React from "react";
import { motion } from "framer-motion";
import { Calculator, Shield, FileText, CheckCircle2, BarChart3, Download } from "lucide-react";
import SamplePdf from "../assets/Sample-vcniti-construction-estimate.pdf";

const AboutAIPlanner = () => {
  const downloadSampleReport = () => {
    const link = document.createElement("a");
    link.href = SamplePdf;
    link.download = "Sample-vcniti-construction-estimate.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-10">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#a852e5]/5 rounded-full blur-3xl" />
         <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl" />
         <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid-pattern-2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-2)" />
         </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-blue-100">
              <Shield className="w-3 h-3" /> Trusted by 100+ Builders
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Material Estimation <br />
              <span className="text-[#a852e5]">Done in 60 Seconds</span>
            </h2>
            
            <p className="text-lg text-gray-600 mt-6 leading-relaxed">
              Stop guessing quantities. Our AI analyzes your project requirements to generate accurate BOQs, recommend brands, and provide real-time pricing from local suppliers.
            </p>

            {/* Stats Row */}
            <div className="flex gap-8 mt-8 py-6 border-y border-gray-100">
                <div>
                    <div className="text-2xl font-bold text-gray-900">95%</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Accuracy</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-gray-900">₹2.5L</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Avg Savings</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-gray-900">24h</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Price Updates</div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                onClick={() => document.getElementById("prediction-form")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-3.5 rounded-xl bg-[#a852e5] text-white font-semibold hover:bg-[#933bd0] transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" /> Start Free Estimate
              </button>

              <button 
                onClick={downloadSampleReport}
                className="px-8 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5 text-gray-500" />
                View Sample Report
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Visual Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
             {/* Abstract Layer */}
             <div className="absolute inset-0 bg-gradient-to-tr from-[#a852e5]/20 to-transparent rounded-3xl blur-2xl transform rotate-3 scale-95" />
             
             {/* The Card */}
             <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                {/* Mock Header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="text-xs font-semibold text-gray-400">AI ESTIMATE V1.0</div>
                </div>

                {/* Mock Body */}
                <div className="p-6 space-y-5">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-sm text-gray-500">Total Project Cost</div>
                            <div className="text-3xl font-bold text-gray-900">₹ 8,48,500</div>
                        </div>
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">+5% Accuracy</div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                                <span>Cement (UltraTech)</span>
                                <span>₹2.8L</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "45%" }}
                                    transition={{ duration: 1.5 }}
                                    className="bg-[#a852e5] h-2 rounded-full" 
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                                <span>Steel (Tata Tiscon)</span>
                                <span>₹1.1L</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "25%" }}
                                    transition={{ duration: 1.5, delay: 0.2 }}
                                    className="bg-blue-500 h-2 rounded-full" 
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                                <span>Bricks & Blocks</span>
                                <span>₹0.9L</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "15%" }}
                                    transition={{ duration: 1.5, delay: 0.4 }}
                                    className="bg-orange-400 h-2 rounded-full" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                         <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                            <BarChart3 className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <div className="text-[10px] text-gray-500 font-bold">ANALYTICS</div>
                         </div>
                         <div className="flex-1 bg-[#a852e5]/10 rounded-lg p-3 text-center border border-[#a852e5]/20">
                            <Download className="w-5 h-5 text-[#a852e5] mx-auto mb-1" />
                            <div className="text-[10px] text-[#a852e5] font-bold">EXPORT PDF</div>
                         </div>
                    </div>
                </div>
             </div>
          </motion.div>

        </div>

        {/* Bottom Section: How it Works (Horizontal) */}
        <div className="mt-24 pt-10 border-t border-gray-100">
            <h3 className="text-center text-2xl font-bold text-gray-900 mb-12">How VCNITI Planner Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Input Details", desc: "Enter project area, floors & quality.", icon: <FileText className="text-blue-600" /> },
                    { title: "AI Generation", desc: "Get BOQ & brand suggestions instantly.", icon: <Calculator className="text-[#a852e5]" /> },
                    { title: "Procure", desc: "Compare prices & order delivery.", icon: <CheckCircle2 className="text-green-600" /> },
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
                        <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                        <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default AboutAIPlanner;
