import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import {
  Search,
  Phone,
  MapPin,
  Briefcase,
  ChevronRight,
  User,
  Map,
  Hash,
  Sparkles,
} from "lucide-react";
import ProfileModal from "./ProfileModal";
import { Input } from "./ui/input";
import FindProfessionalbg from "../assets/Background image for find profetion session.png";
import { motion } from "framer-motion";
const FindProfessional = () => {
  // --- STATE & LOGIC ---
  const [searchResults, setSearchResults] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedPincode, setSelectedPincode] = useState(null);
  const [area, setArea] = useState("");
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const resultsRef = useRef(null);
  const [searchMode, setSearchMode] = useState("pincode");
  // --- OPTIONS ---
  const cityOptions = [{ value: "Bengaluru", label: "Bengaluru" }];
  const designationOptions = [
    { value: "Builders", label: "Builders" },
    { value: "Civil Contractors", label: "Civil Contractors" },
    { value: "Architects", label: "Architects" },
    { value: "Consulting Engineers", label: "Consulting Engineers" },
    { value: "Electrical Consultants", label: "Electrical Consultants" },
    {
      value: "Electrical contractors and engineers",
      label: "Electrical contractors and engineers",
    },
    { value: "Engineers Structural", label: "Engineers Structural" },
    {
      value: "Interior decorators and designers",
      label: "Interior decorators and designers",
    },
    { value: "Landscape Consultants", label: "Landscape Consultants" },
    {
      value: "Plumbing & Sanitation Consultants",
      label: "Plumbing & Sanitation Consultants",
    },
    {
      value: "Surveyors Soil Investigation",
      label: "Surveyors Soil Investigation",
    },
    { value: "Valuers Approved", label: "Valuers Approved" },
  ];

  // --- LOAD PINCODES WHEN BENGALURU IS SELECTED ---
  useEffect(() => {
    if (selectedCity && selectedCity.value === "Bengaluru") {
      const bangalorePincodes = [
        560001, 560002, 560003, 560004, 560005, 560006, 560007, 560008, 560009,
        560010, 560011, 560012, 560013, 560014, 560015, 560016, 560017, 560018,
        560019, 560020, 560021, 560022, 560023, 560024, 560025, 560026, 560027,
        560028, 560029, 560030, 560031, 560032, 560033, 560034, 560035, 560036,
        560037, 560038, 560039, 560040, 560041, 560042, 560043, 560044, 560045,
        560046, 560047, 560048, 560049, 560050, 560051, 560052, 560053, 560054,
        560055, 560056, 560057, 560058, 560059, 560060, 560061, 560062, 560063,
        560064, 560065, 560066, 560067, 560068, 560069, 560070, 560071, 560072,
        560073, 560074, 560075, 560076, 560077, 560078, 560079, 560080, 560081,
        560082, 560083, 560084, 560085, 560086, 560087, 560088, 560089, 560090,
        560091, 560092, 560093, 560094, 560095, 560096, 560097, 560098, 560099,
        560100, 560102, 560103, 560104, 560105, 560108, 560113, 560115, 560300,
        562106, 562107, 562108, 562109, 562110, 562114, 562120, 562123, 562125,
        562129, 562130, 562149, 562157, 562162,
      ];
      setPincodes(
        bangalorePincodes.map((pin) => ({ value: pin, label: pin.toString() })),
      );
    } else {
      setPincodes([]);
      setSelectedPincode(null);
    }
  }, [selectedCity]);
  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
    if (mode === "pincode") {
      setArea("");
    } else {
      setSelectedPincode(null);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    if (!selectedCity) {
      alert("Please select a City.");
      return;
    }
    const isPincodeSelected = selectedPincode && searchMode === "pincode"; // Check if pincode is selected AND searchMode is pincode
    const isAreaEntered = area.trim().length > 0 && searchMode === "area"; // Check if area is entered AND searchMode is area
    const isDesignationSelected = selectedDesignations.length > 0;

    if (!isPincodeSelected && !isAreaEntered) {
      setSearchResults([]);
      alert(`Please select a Pincode or enter an Area.`);
      return;
    }
    if (!isDesignationSelected) {
      // Check if at least one designation is selected
      setSearchResults([]);
      alert(
        `Please select at least one Professional Designation (e.g., Builders, Architects) to search.`,
      );
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (isPincodeSelected) params.append("pincode", selectedPincode.value);
      else if (isAreaEntered) {
        params.append("area", area.trim()); // Only append area if it's the selected search mode
      }
      params.append(
        "designation",
        selectedDesignations.map((d) => d.value).join(","),
      );

      const searchURL = `${import.meta.env.VITE_BACKEND_URL}/api/professionals/search?${params.toString()}`;

      const response = await fetch(searchURL);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) setSearchResults(data);
      else setSearchResults([]);
    } catch (error) {
      console.error("Error fetching professionals:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  };

  const openModal = (professional) => {
    setSelectedProfessional(professional);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfessional(null);
  };

  // --- STYLES ---
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderColor: state.isFocused ? "#a852e5" : "#e2e8f0",
      borderRadius: "0.75rem", // 12px
      padding: "0.2rem",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(168, 82, 229, 0.1)" : "none",
      backdropFilter: "blur(8px)",
      "&:hover": { borderColor: "#a852e5" },
      transition: "all 0.2s ease",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "1rem", // 16px
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      padding: "0.5rem", // 8px
      marginTop: "0.5rem",
      zIndex: 9999,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(12px)",
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      borderRadius: "0.5rem", // 8px
      margin: "0.1rem 0",
      padding: "0.75rem 1rem",
      transition: "all 0.15s ease",
      fontWeight: state.isSelected ? "600" : "500",
      color: state.isSelected ? "white" : "#1e293b",
      backgroundColor: state.isSelected
        ? "#a852e5"
        : state.isFocused
          ? "#f3e8ff"
          : "transparent",
      "&:active": {
        backgroundColor: state.isSelected ? "#a852e5" : "#e9d5ff",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1e293b",
      fontWeight: "600",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
      fontSize: "0.95rem",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#f3e8ff", // purple-50
      borderRadius: "0.5rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#a852e5",
      fontWeight: "600",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#a852e5", // purple-600
      ":hover": {
        backgroundColor: "#e9d5ff",
        color: "#6b21a8",
      },
    }),
  };

  return (
    <section
      id="find-professional"
      className="relative w-full bg-slate-50 pt-16 pb-24 overflow-visible"
    >
      {/* Background Polish */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${FindProfessionalbg})`,
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
      </div>
      <div className="container relative z-10 mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles size={14} /> Discovery Engine
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
            Find Expert Professionals
          </h2>
          <p className="text-slate-500 font-medium">
            Connect with top tier talent in your vicinity
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-purple-200/50 border border-white p-2">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 lg:grid-cols-12 gap-2"
            >
              {/* Step 1: City & Professionals */}
              <div className="lg:col-span-8 p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                      <MapPin size={14} className="text-purple-500" /> 1. Select
                      City
                    </label>
                    <Select
                      options={cityOptions}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      placeholder="Where are you looking?"
                      styles={customStyles}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                      <Briefcase size={14} className="text-purple-500" /> 2.
                      Professional Type
                    </label>
                    <Select
                      isMulti
                      options={designationOptions}
                      value={selectedDesignations}
                      onChange={setSelectedDesignations}
                      placeholder="Architects, Builders..."
                      styles={customStyles}
                    />
                  </div>
                </div>
                {/* Step 2: Precise Search Session */}
                <div
                  className={`transition-all duration-500 ${!selectedCity ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}`}
                >
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    {/* FIXED: Added items-center and text-center for mobile alignment */}
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider text-center sm:text-left">
                            3. Refine Search Area
                        </label>
                        
                        {/* Toggle Switch Container */}
                        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm w-fit mx-auto sm:mx-0">
                            <button 
                                type="button" 
                                onClick={() => handleSearchModeChange('pincode')} 
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${searchMode === 'pincode' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Pincode
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleSearchModeChange('area')} 
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${searchMode === 'area' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Locality
                            </button>
                        </div>
                    </div>

                    {/* Input/Select Field */}
                    <div className="w-full">
                        {searchMode === 'pincode' ? (
                            <Select 
                                options={pincodes} 
                                value={selectedPincode} 
                                onChange={setSelectedPincode} 
                                placeholder="Type to select Pincode..." 
                                styles={customStyles} 
                            />
                        ) : (
                            <Input 
                                placeholder="Enter Area Name (e.g. Indiranagar)" 
                                value={area} 
                                onChange={(e) => setArea(e.target.value)} 
                                className="h-11 rounded-xl border-slate-200 bg-white w-full" 
                            />
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Search Trigger Column */}
              <div className="lg:col-span-4 bg-slate-900 rounded-[1.7rem] m-2 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                    <Search className="text-white" size={32} />
                  </div>
                  <h4 className="text-white font-bold mb-2">
                    Ready to Search?
                  </h4>
                  <p className="text-slate-400 text-xs mb-8">
                    We'll find the best matches based on your filters.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl shadow-xl shadow-purple-900/20 transform active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? "ANALYZING..." : "START DISCOVERY"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
        {/* --- RESULTS GRID (mt-20 adds the gap you requested) --- */}
        <div
          ref={resultsRef}
          className="w-full relative z-10 mt-20 scroll-mt-32"
        >
          {searched && !loading && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <User size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                No Matches Found
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We couldn't find any professionals matching your criteria in
                this area yet. Try expanding your search or selecting a
                different location.
              </p>
            </motion.div>
          )}
          {!loading && searchResults.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {searchResults.map((prof, index) => (
                <motion.div
                  key={prof._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { type: "spring", stiffness: 100 },
                    },
                  }}
                  onClick={() => openModal(prof)}
                  className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(168,82,229,0.15)] hover:border-[#a852e5]/30 transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden"
                >
                  {/* Top colored accent line - Fixed to stay hidden until hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a852e5] to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 font-bold text-lg group-hover:bg-[#a852e5]/10 group-hover:text-[#a852e5] flex items-center justify-center transition-colors duration-300"
                    >
                      {index + 1}
                    </div>
                    <span
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider group-hover:bg-[#a852e5]/10 group-hover:text-[#a852e5] transition-colors duration-300"
                    >
                      View Profile
                    </span>
                  </div>
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#a852e5] transition-colors line-clamp-1">
                      {prof.company_name}
                    </h3>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#a852e5]/10 text-[#a852e5] text-xs font-semibold">
                        <Briefcase size={12} /> {prof.designation}
                      </span>
                    </div>
                    <div className="space-y-3 pt-5 border-t border-slate-50">
                      <div className="flex items-start gap-3 text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                        <MapPin
                          size={16}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <span className="line-clamp-2 leading-relaxed">
                          {prof.full_address}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                        <Phone size={16} className="text-slate-400 shrink-0" />
                        <span className="font-medium tracking-wide">
                          {prof.phone?.mobile ||
                            prof.phone?.office?.split(",")[0] ||
                            "Contact on request"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Footer Action */}
                  <div className="mt-6 pt-4 flex items-center justify-end text-sm font-bold text-[#a852e5] opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <span>Details</span>
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <ProfileModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        professional={selectedProfessional}
      />
    </section>
  );
};

export default FindProfessional;
