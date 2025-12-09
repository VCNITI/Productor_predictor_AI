import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from './ui/button';
import { Badge } from "./ui/badge";
import { Calculator, Clock, Shield } from "lucide-react";
import { AnimatedCard } from "./ui/AnimatedCard";
import { Card } from "./ui/card";

const Hero = () => {
  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* Soft Purple Background Shapes */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#a852e5]/25 rounded-full blur-[140px] opacity-60" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#a852e5]/20 rounded-full blur-[160px] opacity-50" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-[#a852e5]/15 rounded-full blur-[120px] opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/60 backdrop-blur-xl border border-[#a852e5]/10 rounded-2xl p-10 shadow-xl">
              {/* Badge */}
              <motion.div
                className="inline-block bg-[#a852e5]/15 text-[#a852e5] text-xs font-semibold px-3 py-1 rounded-full mb-4"
                whileHover={{ scale: 1.1 }}
              >
                AI-Powered Tools
              </motion.div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                VCNITI Building Material Planner
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 mt-3">
                Estimate materials & cost in 60 seconds
              </p>

              {/* Description */}
              <p className="text-gray-500 mt-6 leading-relaxed">
                AI-powered Q-commerce platform transforming construction material
                sourcing. Get accurate BOQ and pricing with brand recommendations,
                eco-friendly alternatives, and instant supplier connections.
              </p>

              {/* Find a Professional Box */}
              <div className="mt-8">
                <div className="bg-[#f8f5fb] border border-[#a852e5]/20 rounded-lg p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800">
                    Find a Professional
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Coming soon! Quickly connect with verified professionals in your area.
                    Choose State, City, and Pincode to access contractors, masons, carpenters, electricians,
                    plumbers, and construction experts.
                    This feature is launching soon.
                  </p>
                </div>

                {/* CTA */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="default"
                    className="mt-6 w-full md:w-auto bg-[#a852e5] hover:bg-[#9340d3] text-white font-bold py-3 px-6 rounded-lg shadow-md"
                  >
                    Find a Professional – Coming Soon
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex justify-center items-center"
          >
            <div className="w-full h-96 bg-white/40 backdrop-blur-xl border border-[#a852e5]/10 rounded-2xl shadow-md flex items-center justify-center">
              <p className="text-gray-500">Modern 3D-style construction + AI graphic</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
 );
};

export default Hero;
