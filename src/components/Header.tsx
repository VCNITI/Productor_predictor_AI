import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGetStartedClick = () => {
    setMobileMenuOpen(false); // Close mobile menu if open
    if (location.pathname === "/") {
      document.getElementById("prediction-form")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#prediction-form");
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/about#services' },
    { name: 'Contact', href: '/contact' },
  ];

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, staggerChildren: 0.05 } },
  };

  const navItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          <motion.a href="/" className="flex items-center space-x-4" variants={navItemVariants}>
            <img 
              src="https://www.vcniti.in/cdn/shop/files/VCNITI_2_53328262-9352-4b08-89a8-5a8bf0b584d4.png?v=1751636432&width=70" 
              alt="Vcniti Logo" 
              className="h-10 w-10"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">VCNITI </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Powering the Future of Buying Construction Materials</p>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <motion.nav className="hidden md:flex items-center space-x-6" variants={headerVariants}>
            {navigation.map((item) => (
              <motion.div key={item.name} variants={navItemVariants}>
                <Link
                  to={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div variants={navItemVariants}>
              <Button variant="hero" size="sm" onClick={handleGetStartedClick}>
                Get Started
              </Button>
            </motion.div>
          </motion.nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? "open" : "closed"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden py-4 border-t"
            >
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <motion.div key={item.name} variants={navItemVariants}>
                    <Link
                      to={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={navItemVariants}>
                  <Button variant="hero" size="sm" className="w-fit" onClick={handleGetStartedClick}>
                    Get Started
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
