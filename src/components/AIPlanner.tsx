import React from 'react';
import { HardHat, ArrowRight, CheckCircle2 } from 'lucide-react';
import plannerImage from '../assets/vcniti product planner page.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AIPlanner: React.FC = () => {
  const navigate = useNavigate();

  const handleUsePlannerClick = () => {
    navigate('/planner');
  };

  return (
    <section id="ai-planner" className="py-24 relative overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gray-50/50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-3xl -ml-32 -mb-32"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-900/5 border border-gray-100 p-8 md:p-12 overflow-hidden">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                
                {/* Image Section */}
                <div className="lg:w-1/2 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#a852e5] to-purple-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <img 
                        src={plannerImage} 
                        alt="Building Planner" 
                        className="relative rounded-2xl shadow-lg border border-white/50 transform transition-transform duration-500 group-hover:scale-[1.02]" 
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
                        <div className="bg-purple-100 p-2.5 rounded-xl text-[#a852e5]">
                            <HardHat size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Accuracy</p>
                            <p className="text-gray-900 font-bold">95% Verified</p>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 bg-purple-50 text-[#a852e5] text-xs font-bold px-3 py-1 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a852e5] animate-pulse"></span>
                        AI Powered Tool
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        Smart Planning for <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a852e5] to-purple-600">Smarter Building</span>
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Stop guessing material quantities. Our AI Planner analyzes your project parameters to generate precise BOQs, cost estimates, and procurement schedules instantly.
                    </p>

                    <ul className="space-y-3 mb-10">
                        {['Instant Material Estimation', 'Real-time Cost Analysis', 'Project Timeline Optimization'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                            </li>
                        ))}
                    </ul>

                    <a
                        onClick={handleUsePlannerClick}
                        className="cursor-pointer inline-flex items-center gap-2 bg-[#a852e5] hover:bg-[#903dd0] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-1"
                    >
                        Start Planning Free <ArrowRight className="w-5 h-5" />
                    </a>
                </div>

            </div>
        </div>
      </div>
    </section>
  );
};

export default AIPlanner;