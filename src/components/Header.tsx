import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, User, LogOut, Pencil } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- DISPLAY NAME LOGIC ---
  const getDisplayName = () => {
    if (!user) return "";
    if (user.firstName && user.firstName.trim() !== "") {
        return `${user.firstName} ${user.lastName || ''}`;
    }
    if (user.phoneNumber) {
        return user.phoneNumber;
    }
    return "Welcome";
  };

  // --- SCROLL EFFECT ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- NAVIGATION LINKS ---
  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/about#services" },
    { name: "Contact", href: "/contact" },
  ];

  const handleGetStartedClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      document.getElementById("ai-planner")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#ai-planner");
    }
  };

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
            
            {/* --- 1. LOGO AREA --- */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="bg-[#a852e5]/10 p-2 rounded-xl group-hover:bg-[#a852e5] transition-colors duration-300">
                <Logo className="h-8 w-8 text-[#a852e5] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-[#a852e5] transition-colors">
                  VCNITI
                </h1>
                <p className="text-[10px] font-medium text-gray-500 hidden lg:block tracking-wide uppercase">
                  Powering the Future of Buying Construction Materials
                </p>
              </div>
            </a>

            {/* --- 2. DESKTOP NAVIGATION --- */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Links */}
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

              <div className="pl-4 border-l border-gray-200 flex items-center gap-4">
                {/* User Section */}
                {user ? (
                  <div className="flex items-center gap-3 bg-slate-50 rounded-full pl-2 pr-1 py-1 border border-slate-100">
                    <div className="w-8 h-8 bg-[#a852e5]/10 rounded-full flex items-center justify-center text-[#a852e5]">
                         <User size={16} />
                    </div>
                    
                    <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">
                        {getDisplayName()}
                    </span>

                    <div className="flex items-center gap-1 border-l border-slate-200 pl-1">
                        <Button onClick={() => navigate('/profile')} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#a852e5] hover:bg-white rounded-full">
                            <Pencil size={14} />
                        </Button>
                        <Button onClick={logout} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-white rounded-full">
                            <LogOut size={14} />
                        </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => navigate('/login')}
                    variant="ghost"
                    className="text-sm font-semibold text-gray-600 hover:text-[#a852e5] transition-colors"
                  >
                    Login
                  </Button>
                )}

                {/* Get Started Button */}
                <Button
                  onClick={handleGetStartedClick}
                  className="bg-[#a852e5] hover:bg-[#903dd0] text-white rounded-full px-6 font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                >
                  Get Started
                </Button>
              </div>
            </nav>

            {/* --- 3. MOBILE MENU TOGGLE --- */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-[#a852e5] hover:bg-purple-50"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* --- 4. MOBILE DRAWER --- */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <nav className="flex flex-col p-6 space-y-4">
                {/* Mobile Links */}
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
                
                {/* Mobile User Section */}
                <div className="pt-4 mt-2 border-t border-gray-100">
                  {user ? (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#a852e5] shadow-sm">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{getDisplayName()}</p>
                            <p className="text-xs text-gray-500">{user.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }} variant="outline" className="w-full text-sm">
                                <Pencil size={14} className="mr-2"/> Edit
                            </Button>
                        <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" className="w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                            <LogOut size={14} className="mr-2"/> Logout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl py-6 text-lg font-bold shadow-sm mb-4"
                    >
                      Login
                    </Button>
                  )}
                </div>

                {/* Mobile Get Started */}
                <div className="pt-2">
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
      
      {/* Spacer to prevent content overlap */}
      <div className="h-20 md:h-24 w-full bg-transparent"></div>
    </>
  );
};

export default Header;