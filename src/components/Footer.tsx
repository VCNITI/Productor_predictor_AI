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
import { useState } from "react";
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const platformLinks = [
    { text: "Home", to: "#home" },
    { text: "Products", to: "https://www.vcniti.com/collections/all" },
    { text: "AI Estimater", to: "/planner" },
    { text: "Find Pros", to: "/find-professionals" },
  ];

  const companyLinks = [
    { text: "About Us", to: "/about" },
    // {text: 'Careers', to: '/careers'},
    // {text: 'Blog', to: '/blog'},
    { text: "Contact", to: "/contact" },
  ];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    if (targetId.startsWith("http")) {
      return;
    }
    e.preventDefault();

    if (targetId.startsWith("/")) {
      navigate(targetId);
      return;
    }

    const id = targetId.substring(1); // remove #

    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/" + targetId);
    }
  };

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
          <h1 className="text-8xl md:text-[20rem] font-black leading-none tracking-tighter text-gray-900 pr-4 md:pr-0">
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
                <span className="text-2xl font-extrabold tracking-tight text-gray-900">
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
                    <a
                      onClick={(e) => handleLinkClick(e, link.to)}
                      href={link.to}
                      className="cursor-pointer text-gray-500 hover:text-[#a852e5] hover:translate-x-1 transition-all text-sm font-medium flex items-center gap-2 group"
                    >
                      {link.text}
                    </a>
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
            <p>© 2025 VCNITI Technologies Pvt Ltd.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm md:text-base">
              <button
                onClick={() => setShowPrivacy(true)}
                className="hover:text-[#a852e5] transition-colors"
              >
                Privacy Policy
              </button>
              <a
                href="#terms"
                className="hover:text-[#a852e5] transition-colors"
              >
                Terms of Service
              </a>
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

      {/* --- PRIVACY MODAL --- */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="bg-white p-6 flex justify-between items-center shrink-0 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Privacy Policy
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: September 17, 2025
                  </p>
                </div>
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-500 p-2 rounded-full transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-8 space-y-8">
                <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
                  <p>
                    VCNITI operates this store and website, including all
                    related information, content, features, tools, products and
                    services, in order to provide you, the customer, with a
                    curated shopping experience (the "Services"). VCNITI is
                    powered by Shopify, which enables us to provide the Services
                    to you. This Privacy Policy describes how we collect, use,
                    and disclose your personal information when you visit, use,
                    or make a purchase or other transaction using the Services
                    or otherwise communicate with us. If there is a conflict
                    between our Terms of Service and this Privacy Policy, this
                    Privacy Policy controls with respect to the collection,
                    processing, and disclosure of your personal information.
                  </p>

                  <p>
                    Please read this Privacy Policy carefully. By using and
                    accessing any of the Services, you acknowledge that you have
                    read this Privacy Policy and understand the collection, use,
                    and disclosure of your information as described in this
                    Privacy Policy.
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 mt-6">
                    Personal Information We Collect or Process
                  </h3>
                  <p>
                    When we use the term "personal information," we are
                    referring to information that identifies or can reasonably
                    be linked to you or another person. Personal information
                    does not include information that is collected anonymously
                    or that has been de-identified, so that it cannot identify
                    or be reasonably linked to you. We may collect or process
                    the following categories of personal information:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>
                      <strong>Contact details:</strong> including your name,
                      address, billing address, shipping address, phone number,
                      and email address.
                    </li>
                    <li>
                      <strong>Financial information:</strong> including credit
                      card, debit card, and financial account numbers, payment
                      card information, financial account information,
                      transaction details.
                    </li>
                    <li>
                      <strong>Account information:</strong> including your
                      username, password, security questions, preferences and
                      settings.
                    </li>
                    <li>
                      <strong>Transaction information:</strong> including the
                      items you view, put in your cart, add to your wishlist, or
                      purchase, return, exchange or cancel.
                    </li>
                    <li>
                      <strong>Communications with us:</strong> including the
                      information you include in communications with us, for
                      example, when sending a customer support inquiry.
                    </li>
                    <li>
                      <strong>Device information:</strong> including information
                      about your device, browser, or network connection, your IP
                      address, and other unique identifiers.
                    </li>
                    <li>
                      <strong>Usage information:</strong> including information
                      regarding your interaction with the Services, including
                      how and when you interact with or navigate the Services.
                    </li>
                  </ul>

                  <h3 className="text-lg font-bold text-gray-900 mt-6">
                    Personal Information Sources
                  </h3>
                  <p>
                    We may collect personal information from the following
                    sources:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>
                      Directly from you when you create an account, use the
                      Services, or purchase products.
                    </li>
                    <li>
                      Automatically through the Services from your device (via
                      cookies and similar technologies).
                    </li>
                    <li>
                      From our service providers who perform services on our
                      behalf (IT management, payment processing, shipping).
                    </li>
                    <li>From our partners or other third parties.</li>
                  </ul>

                  <h3 className="text-lg font-bold text-gray-900 mt-6">
                    How We Use Your Personal Information
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>
                      <strong>
                        Provide, Tailor, and Improve the Services:
                      </strong>{" "}
                      To process payments, fulfill orders, manage your account,
                      and arrange for shipping.
                    </li>
                    <li>
                      <strong>Marketing and Advertising:</strong> To send
                      marketing communications and show online advertisements
                      based on your activity.
                    </li>
                    <li>
                      <strong>Security and Fraud Prevention:</strong> To
                      authenticate your account, provide secure payments, and
                      detect fraudulent activity.
                    </li>
                    <li>
                      <strong>Communicating with You:</strong> To provide
                      customer support and maintain our business relationship.
                    </li>
                    <li>
                      <strong>Legal Reasons:</strong> To comply with applicable
                      law, respond to valid legal process, and enforce our
                      terms.
                    </li>
                  </ul>

                  <h3 className="text-lg font-bold text-gray-900 mt-6">
                    How We Disclose Personal Information
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>
                      With Shopify, vendors, and service providers (IT, payment
                      processing, shipping).
                    </li>
                    <li>
                      With business and marketing partners to provide marketing
                      services and personalized advertising.
                    </li>
                    <li>With our affiliates or within our corporate group.</li>
                    <li>
                      In connection with a business transaction (merger,
                      bankruptcy) or to comply with legal obligations.
                    </li>
                  </ul>

                  <h3 className="text-lg font-bold text-gray-900 mt-6">
                    Your Rights and Choices
                  </h3>
                  <p>Depending on where you live, you may have the right to:</p>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>
                      Request access to personal information we hold about you.
                    </li>
                    <li>Request deletion of personal information.</li>
                    <li>
                      Request correction of inaccurate personal information.
                    </li>
                    <li>
                      Manage communication preferences (opt-out of promotional
                      emails).
                    </li>
                  </ul>

                  <h3 className="text-lg font-bold text-gray-900 mt-6">
                    Contact
                  </h3>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mt-2">
                    <p>
                      Should you have any questions about our privacy practices
                      or this Privacy Policy, please call or email us at:
                    </p>
                    <p className="mt-2 font-bold text-[#a852e5]">
                      info@vcniti.com
                    </p>
                    <p className="mt-1 text-sm">
                      Bhive, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar,
                      Bengaluru, KA, 560001, IN
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-black transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
