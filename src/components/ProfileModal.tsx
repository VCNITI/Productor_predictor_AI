import React from 'react';
import Modal from 'react-modal';
import { X, MapPin, Phone, Mail, Globe, Map, Building2, User } from 'lucide-react';

Modal.setAppElement('#root');

// Helper function to split and clean comma-separated strings
const parseContactString = (contactString) => {
    if (!contactString) return [];
    return contactString.split(',').map(item => item.trim()).filter(item => item.length > 0);
};

// Helper function to get all unique phone numbers
const getAllPhoneNumbers = (phone) => {
    if (!phone) return [];
    const mobileNumbers = parseContactString(phone.mobile || "");
    const officeNumbers = parseContactString(phone.office || "");
    return [...new Set([...mobileNumbers, ...officeNumbers])];
}

const ProfileModal = ({ isOpen, onRequestClose, professional }) => {
  if (!professional) return null;

  const phoneNumbers = getAllPhoneNumbers(professional.phone);
  const emails = parseContactString(professional.email);
  const websites = parseContactString(professional.website);

  // Your Company Color
  const BRAND_COLOR = '#a852e5'; 

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Professional Profile"
      overlayClassName="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl relative outline-none overflow-hidden max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100"
    >
      {/* --- HEADER: Gradient & Avatar --- */}
      <div className="relative h-32 shrink-0 overflow-hidden">
          {/* Brand Gradient Background */}
          <div 
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${BRAND_COLOR}, #7c3aed)` }} 
          >
             <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          </div>

          <button
            onClick={onRequestClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all backdrop-blur-md border border-white/10 shadow-lg z-20"
          >
            <X size={20} />
          </button>
      </div>

      {/* --- AVATAR (Floating) --- */}
      <div className="relative px-6 -mt-12 mb-4 z-10 flex justify-center">
          <div className="relative">
              <div className="w-24 h-24 rounded-[1.5rem] bg-white p-1.5 shadow-xl shadow-purple-900/10 hover:rotate-0 transition-transform duration-300">
                  <div 
                    className="w-full h-full bg-gradient-to-br from-purple-50 to-white rounded-2xl flex items-center justify-center text-4xl font-black text-transparent bg-clip-text border border-purple-100"
                    style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_COLOR}, #7c3aed)` }} 
                  >
                      {professional.company_name.charAt(0)}
                  </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-[3px] border-white"></div>
          </div>
      </div>

      {/* --- CONTENT SCROLLABLE AREA --- */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6 scrollbar-thin scrollbar-thumb-purple-100 scrollbar-track-transparent">
          
          {/* Title Section */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                {professional.company_name}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
               <span 
                 className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border"
                 style={{ backgroundColor: '#f3e8ff', color: BRAND_COLOR, borderColor: '#e9d5ff' }}
               >
                  <Building2 size={12} /> {professional.designation}
               </span>
            </div>
            {professional.contact_person && (
                <div className="inline-flex items-center gap-1.5 text-slate-500 text-sm font-medium bg-slate-50 px-3 py-1 rounded-lg">
                    <User size={14} /> {professional.contact_person}
                </div>
            )}
          </div>

          {/* Location Card */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 flex gap-3 items-start">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 shrink-0" style={{ color: BRAND_COLOR }}>
                  <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-1"> {/* Added min-w-0 for text wrapping safety */}
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed break-words">{professional.full_address}</p>
                  <div 
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md"
                    style={{ backgroundColor: '#f3e8ff', color: BRAND_COLOR }}
                  >
                      <Map size={12} /> {professional.pincode}
                  </div>
              </div>
          </div>

          {/* Contact Actions Grid */}
          <div className="grid gap-3">
              {/* Phone Numbers */}
              {phoneNumbers.map((number, index) => (
                  <a 
                    key={index}
                    href={`tel:${number}`}
                    className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-purple-200 hover:shadow-md hover:shadow-purple-500/5 transition-all group overflow-hidden"
                  >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                          <Phone size={18} />
                      </div>
                      <div className="flex-1 min-w-0"> {/* Vital for preventing overflow */}
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Call Now</p>
                          <p className="text-sm font-bold text-slate-700 truncate">{number}</p>
                      </div>
                      <div className="text-slate-300 group-hover:text-purple-500 transition-colors shrink-0">
                          <span className="text-xl">→</span>
                      </div>
                  </a>
              ))}

              {/* Emails - FIXED OVERFLOW HERE */}
              {emails.map((email, index) => (
                  <a 
                    key={index}
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all group overflow-hidden"
                  >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                          <Mail size={18} />
                      </div>
                      <div className="flex-1 min-w-0"> {/* Vital for preventing overflow */}
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                          {/* Use break-all to force wrapping on small screens, or truncate for ellipsis */}
                          <p className="text-sm font-bold text-slate-700 break-all leading-tight">{email}</p> 
                      </div>
                  </a>
              ))}

              {/* Website - FIXED OVERFLOW HERE */}
              {websites.length > 0 && (
                  <a 
                    href={`http://${websites[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-green-200 hover:shadow-md hover:shadow-green-500/5 transition-all group overflow-hidden"
                  >
                      <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors shrink-0">
                          <Globe size={18} />
                      </div>
                      <div className="flex-1 min-w-0"> {/* Vital for preventing overflow */}
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website</p>
                          <p className="text-sm font-bold text-slate-700 truncate">{websites[0]}</p>
                      </div>
                  </a>
              )}
          </div>
      </div>

      {/* --- FOOTER ACTION --- */}
      <div className="p-6 pt-2 bg-white/80 backdrop-blur-sm border-t border-slate-50 shrink-0">
          <a
            href={`tel:${phoneNumbers[0] || ''}`}
            className="flex items-center justify-center w-full py-4 text-white rounded-2xl font-bold text-base shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
                background: `linear-gradient(135deg, ${BRAND_COLOR}, #903dd0)`, 
                boxShadow: `0 10px 25px -5px ${BRAND_COLOR}40` 
            }}
          >
            <Phone size={18} className="mr-2" />
            Contact Professional
          </a>
      </div>

    </Modal>
  );
};

export default ProfileModal;
