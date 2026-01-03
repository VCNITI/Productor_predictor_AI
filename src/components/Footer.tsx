import {
  Phone,
  Mail,
  MapPin,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import Logo from "./Logo";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";
import TermsOfServiceContent from "@/components/TermsOfServiceContent";

const Footer = () => {
  const platformLinks = [
    { text: "Home", to: "/" },
    { text: "Store", to: "https://www.vcniti.com" },
    { text: "AI Estimater", to: "/planner" },
    { text: "Find Pros", to: "/find-professionals" },
  ];

  const companyLinks = [
    { text: "About Us", to: "/about" },
    // {text: 'Careers', to: '/careers'},
    // {text: 'Blog', to: '/blog'},
    { text: "Contact", to: "/contact" },
  ];

  return (
    <>
      <footer className="relative bg-white text-gray-600 border-t border-gray-100 mt-auto overflow-hidden font-sans">
        {/* --- DESIGN ELEMENTS --- */}
        {/* 1. Subtle Architectural Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#a852e5 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        {/* 2. Top Gradient Border Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a852e5] to-transparent opacity-60"></div>

        {/* 3. Giant Subtle Watermark (FIXED) */}
        <div className="absolute -bottom-0 right-0 pointer-events-none select-none opacity-[0.03] overflow-hidden w-full flex justify-end translate-y-1/4 md:translate-y-[30%]">
          <h1 className="text-8xl md:text-[20rem] font-black leading-none tracking-tighter  text-gray-900  pr-4 md:pr-0">
            VCNITI
          </h1>
        </div>

        <div className="container mx-auto px-6 pt-20 pb-0 relative z-10">
          {/* Main Content Grid (FIXED MARGIN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-10">
            
            {/* Brand Column (Span 4) */}
            <div className="lg:col-span-4 space-y-6">
              <a
                href="https://www.vcniti.com/"
                className="flex items-center space-x-3 group"
              >
                <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100 group-hover:bg-[#a852e5] group-hover:text-white transition-all duration-300">
                  <Logo className="h-8 w-8 text-[#a852e5] group-hover:text-white transition-colors" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#a852e5] transition-colors">
                  VCNITI
                </span>
              </a>
              <p className="text-gray-500 leading-relaxed max-w-sm text-sm">
                VCNITI is a AI Powered Q-commerce platform that enables ultra-fast delivery of construction and interior materials directly to homes and sites. We simplify procurement through real-time tracking, verified manufacturers, transparent pricing, and instant order fulfilment.
              </p>

              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                {[
                  {
                    Icon: Facebook,
                    href: "https://www.facebook.com/p/Vcniti-61578177582003/",
                  },
                  { Icon: X, href: "https://x.com/VCNITI_India" },
                  {
                    Icon: Linkedin,
                    href: "https://www.linkedin.com/company/vcniti/",
                  },
                  {
                    Icon: Instagram,
                    href: "https://www.instagram.com/vcniti.india/",
                  },
                  {
                    Icon: Youtube,
                    href: "https://www.youtube.com/@VCNITITechnologies",
                  },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-[#a852e5] hover:border-[#a852e5] hover:text-white transition-all text-gray-400"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Column 1 (Span 2) */}
            <div className="lg:col-span-2 lg:col-start-6 space-y-6">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {platformLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      to={link.to}
                      className="cursor-pointer text-gray-500 hover:text-[#a852e5] hover:translate-x-1 transition-all text-sm font-medium flex items-center gap-2 group"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column 2 (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      to={link.to}
                      className="text-gray-500 hover:text-[#a852e5] hover:translate-x-1 transition-all text-sm font-medium flex items-center gap-2"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column (Span 4) */}
            <div className="lg:col-span-3 space-y-6">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Reach Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-0.5 bg-purple-50 p-1.5 rounded-md text-[#a852e5] shrink-0">
                    <MapPin size={16} />
                  </div>
                  <span className="text-gray-500 text-sm leading-relaxed">
                    VCNITI Technologies Private Limited,Bhive 48, Church St,
                    <br />
                    Haridevpur, Shanthala Nagar, Ashok Nagar,
                    <br />
                    Bengaluru, KA, 560001
                  </span>
                </li>
                <li className="w-full">
              <a 
                href="tel:+919740059699" 
                className="flex gap-4 items-center group cursor-pointer"
              >
                {/* Icon: Added hover effect */}
                <div className="bg-purple-50 p-1.5 rounded-md text-[#a852e5] group-hover:bg-purple-100 transition-colors">
                  <Phone size={16} />
                </div>

                {/* Text: Added hover color change */}
               <span className="text-gray-500 text-sm group-hover:text-purple-600 transition-colors font-medium">
                 +91 9740059699
               </span>
              </a>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="bg-purple-50 p-1.5 rounded-md text-[#a852e5]">
                    <Mail size={16} />
                  </div>
                  <span className="text-gray-500 text-sm">info@vcniti.com</span>
                </li>
              </ul>
            </div>
            
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-100 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
            <p>© 2026 VCNITI Technologies Pvt Ltd.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm md:text-base">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-[#a852e5] transition-colors">
                    Privacy Policy
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-4/5 overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                  </DialogHeader>
                  <PrivacyPolicyContent />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-[#a852e5] transition-colors">
                    Terms of Service
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-4/5 overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Terms of Service</DialogTitle>
                  </DialogHeader>
                  <TermsOfServiceContent />
                </DialogContent>
              </Dialog>
              <a
                href="#cookies"
                className="hover:text-[#a852e5] transition-colors"
              >
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
