import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calculator,
  Users,
  Award,
  ArrowUpRight,
  Search,
  Leaf,
  Layers,
  Zap,
  ShoppingCart,
  Store,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Replaced import with a constant string to avoid missing asset error
const constructionHero = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2089&auto=format&fit=crop";

const About = () => {
  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-purple-100">

      <main className="flex-1">
        {/* --- 1. HERO SECTION: Split Layout with Rounded Image --- */}
        <section className="relative pt-10 pb-20 lg:pt-10 px-6 overflow-hidden">
          {/* Background Blob for atmosphere */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* LEFT: Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div
                variants={fadeIn}
                className="flex items-center gap-2 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-[#a852e5] animate-pulse" />
                <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                  Our Mission
                </span>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tighter leading-[1.1] mb-6"
              >
                Building the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a852e5] to-purple-600">
                  Future
                </span>{" "}
                of <br />
                Procurement.
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-gray-600 leading-relaxed mb-8"
              >
                VCNITI is Bengaluru's fastest construction material platform and India's first AI-powered Q-commerce ecosystem. We
                don't just sell building materials; we engineer the construction procurement platform for
                speed, accuracy, and trust.
              </motion.p>

              <motion.div variants={fadeIn}>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full h-14 px-8 bg-gray-900 hover:bg-black text-white text-lg shadow-xl shadow-gray-900/10 transition-transform hover:-translate-y-1"
                >
                  <a href="https://www.vcniti.com/" className="inline-flex items-center gap-2">
                    Explore Platform <ArrowUpRight className="w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* RIGHT: Rounded Image Container */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Glowing Back Layer */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#a852e5] to-purple-400 rounded-[3rem] blur-2xl opacity-30 animate-pulse" />

              {/* The Image Card */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white ">
                {/* Overlay Gradient for text readability if needed, or just style */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 " />

                <img
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                  alt="Modern Construction"
                  className="w-full h-[400px] object-cover"
                  loading="lazy"
                />

                {/* Floating Badge inside Image */}
                <div className="absolute bottom-8 left-8 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-white">
                  <p className="font-bold text-lg">
                    Infrastructure for Tomorrow
                  </p>
                  <p className="text-xs text-white/80">Powered by VCNITI AI</p>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center z-30 animate-bounce delay-700">
                <Building2 className="w-10 h-10 text-[#a852e5]" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- RECOGNIZED BY / TRUST BADGES --- */}
        <section className="py-10 sm:py-14 px-6 border-y border-gray-100 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-8"
            >
              <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                Recognized By
              </p>
              <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-8 w-full sm:w-auto">
                {/* Startup India / DPIIT Badge */}
                <div className="flex items-center gap-5 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                    <img
                      src="/DPIIT-header.png"
                      alt="Startup India - DPIIT Recognized"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="border-l border-gray-200 pl-4">
                    <p className="text-sm font-bold text-gray-900 leading-tight">DPIIT Recognized</p>
                    <p className="text-[11px] text-gray-400">Startup India</p>
                  </div>
                </div>

                {/* MSME Badge */}
                <div className="flex items-center gap-5 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                    <img
                      src="/msme-logo-500x500.webp"
                      alt="MSME Registered"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="border-l border-gray-200 pl-4">
                    <p className="text-sm font-bold text-gray-900 leading-tight">MSME Registered</p>
                    <p className="text-[11px] text-gray-400">Govt. of India</p>
                  </div>
                </div>

                {/* Karnataka Startup Badge */}
                <div className="flex items-center gap-5 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                    <img
                      src="/site-logo-sticky.png"
                      alt="Karnataka Startup"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="border-l border-gray-200 pl-4">
                    <p className="text-sm font-bold text-gray-900 leading-tight">Startup Karnataka</p>
                    <p className="text-[11px] text-gray-400">Govt. of Karnataka</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- 2. STATS & VISION --- */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            {/* Visual Block (Left) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-6 relative h-[400px] rounded-3xl overflow-hidden bg-gray-100 group"
            >
              <img
                src={constructionHero}
                alt="Engineering"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/0 transition-colors" />

              {/* Glass Stats Bar */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-lg">
                <div className="flex justify-between divide-x divide-gray-200">
                  <div className="px-4 text-center w-full">
                    <div className="text-2xl font-bold text-[#a852e5]">
                      100+
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                      Projects
                    </div>
                  </div>
                  <div className="px-4 text-center w-full">
                    <div className="text-2xl font-bold text-[#a852e5]">1k+</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                      Suppliers
                    </div>
                  </div>
                  <div className="px-4 text-center w-full">
                    <div className="text-2xl font-bold text-[#a852e5]">4hr</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                      Delivery
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Content (Right) */}
            <div className="lg:col-span-6 space-y-6 lg:pl-10">
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                Bridging the gap between{" "}
                <span className="underline decoration-[#a852e5] decoration-4 underline-offset-4">
                  tech
                </span>{" "}
                and{" "}
                <span className="underline decoration-[#a852e5] decoration-4 underline-offset-4">
                  cement
                </span>
                .
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                VCNITI Technologies Private Limited was founded as a building materials startup in Bengaluru to solve a
                chaotic problem: construction procurement is slow, opaque, and
                unpredictable. We started in Bengaluru and are proudly serving contractors across the city, from Whitefield to HSR Layout, JP Nagar, and beyond.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We combine advanced algorithms with real-time market data to
                provide accurate cost estimates, connect buyers with trusted
                suppliers, and enable seamless project execution with quick commerce construction delivery in India.
              </p>

              <div className="flex gap-4 pt-4 items-center">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-sm"
                    >
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  Trusted by top builders in India
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. SERVICES: BENTO GRID --- */}
        <section id="services" className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                Our Ecosystem
              </h2>
              <p className="text-gray-500 mt-2 text-lg">
                Everything you need to build better.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
              {/* Card 1: Large (Span 2 cols) */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#a852e5]">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Material Marketplace
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Connect directly with verified manufacturers and
                      distributors. Get the best market rates delivered to your
                      site.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Dark Theme */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-900 rounded-3xl p-8 shadow-sm relative overflow-hidden text-white group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-14 h-14 bg-gray-700/50 rounded-2xl flex items-center justify-center text-white">
                    <Calculator size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">AI Estimator</h3>
                    <p className="text-gray-400 text-sm">
                      95% accurate cost prediction engines generated in seconds.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Standard */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group"
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Users size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Pro Network
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Access 1000+ architects, contractors & structural
                      engineers.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Large Gradient (Span 2 cols) */}
              <motion.div
                whileHover={{ y: -5 }}
                className="md:col-span-2 bg-gradient-to-r from-[#a852e5] to-purple-600 rounded-3xl p-8 shadow-lg relative overflow-hidden text-white group"
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                    <Award size={28} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">
                          Project Management
                        </h3>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-100 hover:bg-purple-500/30 border border-purple-400/30 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 pointer-events-none">
                          Coming Soon
                        </Badge>
                      </div>
                      <p className="text-purple-100 max-w-md">
                        End-to-end tracking from foundation to finish. Monitor
                        progress remotely.
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- 4. FEATURES: DARK MODE CONTRAST --- */}
        <section className="py-24 px-6 bg-gray-950 text-white relative overflow-hidden">
          {/* Grid Line Decor */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <Badge
                  variant="outline"
                  className="text-[#a852e5] border-[#a852e5] mb-4 px-4 py-1"
                >
                  Core Technology
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Platform Intelligence
                </h2>
              </div>
              <p className="text-gray-400 max-w-xs text-right hidden md:block">
                Powered by proprietary algorithms and local market datasets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Layers,
                  title: "Smart BOQ",
                  desc: "Automated Bill of Quantities generation with granular material breakdown.",
                },
                {
                  icon: Zap,
                  title: "Real-time Pricing",
                  desc: "Live feed from local markets ensuring you never overpay for supplies.",
                },
                {
                  icon: Search,
                  title: "Brand Match",
                  desc: "Algorithmic recommendation of brands based on your quality vs budget needs.",
                },
                {
                  icon: Leaf,
                  title: "Green Index",
                  desc: "Sustainability scoring to help you choose eco-friendly material alternatives.",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-3xl hover:bg-gray-800 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#a852e5] transition-colors">
                    <feature.icon className="w-6 h-6 text-[#a852e5] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default About;
