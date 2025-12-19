import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStartedClick = () => {
    setMobileMenuOpen(false); // Close mobile menu if open
    if (location.pathname === "/") {
      document
        .getElementById("ai-planner")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#ai-planner");
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/about#services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-gray-200 shadow-sm py-2"
            : "bg-white/50 backdrop-blur-sm border-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* --- LOGO AREA --- */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="bg-[#a852e5]/10 p-2 rounded-xl group-hover:bg-[#a852e5] transition-colors duration-300">
                <Logo className="h-8 w-8 text-[#a852e5] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-[#a852e5] transition-colors">
                  VCNITI
                </h1>
                {/* Tagline hidden on mobile/tablet to save space */}
                <p className="text-[10px] font-medium text-gray-500 hidden lg:block tracking-wide uppercase">
                  Powering the Future of Buying Construction Materials
                </p>
              </div>
            </a>

            {/* --- DESKTOP NAVIGATION --- */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-semibold text-gray-600 hover:text-[#a852e5] transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a852e5] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}

              <div className="pl-4 border-l border-gray-200">
                <Button
                  onClick={handleGetStartedClick}
                  className="bg-[#a852e5] hover:bg-[#903dd0] text-white rounded-full px-6 font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                >
                  Get Started
                </Button>
              </div>
            </nav>

            {/* --- MOBILE MENU TOGGLE --- */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-[#a852e5] hover:bg-purple-50"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* --- MOBILE NAVIGATION DRAWER --- */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <nav className="flex flex-col p-6 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-lg font-medium text-gray-700 hover:text-[#a852e5] p-2 rounded-lg hover:bg-purple-50 transition-all"
                  >
                    {item.name}
                    <ArrowRight className="h-4 w-4 opacity-50" />
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-gray-100">
                  <Button
                    onClick={handleGetStartedClick}
                    className="w-full bg-[#a852e5] hover:bg-[#903dd0] text-white rounded-xl py-6 text-lg font-bold shadow-md"
                  >
                    Get Started Now
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* 2. Invisible Spacer Div */}
      {/* This pushes the rest of the page down by the same height as the header */}
      <div className="h-20 md:h-24 w-full bg-transparent"></div>
    </>
  );
};

export default Header;