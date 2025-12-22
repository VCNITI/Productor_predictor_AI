import React, { useState, useEffect, useRef } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfirmationResult } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  
  // --- FIXED: Construct Full Return Path (Path + Search + Hash) ---
  const fromLocation = location.state?.from;
  const from = fromLocation 
    ? `${fromLocation.pathname}${fromLocation.search || ''}${fromLocation.hash || ''}`
    : "/";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // 1. Run only ONCE on mount to check existing session
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, []); 

  // 2. Initialize Recaptcha
  useEffect(() => {
    const initRecaptcha = async () => {
      if (recaptchaContainerRef.current && !window.recaptchaVerifier) {
        try {
          const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'invisible',
            'callback': () => {},
          });
          await verifier.render();
          window.recaptchaVerifier = verifier;
        } catch (error) {
          console.warn("Recaptcha Init suppressed:", error);
        }
      }
    };
    
    const timer = setTimeout(initRecaptcha, 500);
    return () => {
      clearTimeout(timer);
      if(window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch(e) {}
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let cleanInput = phoneNumber.trim().replace(/[\s-]/g, '');
    let formattedPhone = cleanInput;

    if (cleanInput.startsWith('+')) {
        formattedPhone = cleanInput;
    } else if (cleanInput.startsWith('91') && cleanInput.length === 12) {
        formattedPhone = `+${cleanInput}`;
    } else {
        formattedPhone = `+91${cleanInput}`;
    }

    try {
      if (!window.recaptchaVerifier) throw new Error("Recaptcha not ready. Please refresh.");
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
    } catch (error: any) {
      console.error(error);
      alert("Error sending OTP: " + error.message);
      setLoading(false); 
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!confirmationResult) return;

    try {
      const result = await confirmationResult.confirm(otp);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              uid: result.user.uid,
              phoneNumber: result.user.phoneNumber
          })
      });

      if(response.ok) {
          const data = await response.json();
          login(data.user); 
          
          if (!data.user.firstName) {
            navigate('/profile', { replace: true });
          } else {
            // Navigate back to the specific previous location
            navigate(from, { replace: true });
          }
      } else {
          const errData = await response.json();
          alert(`Login Error: ${errData.message || 'Server Sync Failed'}`);
      }
    } catch (error: any) {
      console.error("Verification Error:", error);
      alert("Invalid OTP code or Network Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-slate-900 opacity-90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 text-center px-12">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                <img src="/logo.avif" alt="VCNITI Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-5xl font-black text-white mb-6">VCNITI</h1>
            <p className="text-xl text-slate-300 font-light leading-relaxed">
                Powering the Future of Buying Construction Materials.               
            </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100"
        >
            <div ref={recaptchaContainerRef}></div>

            <div className="mb-8">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider">
                    {step === 1 ? 'Welcome Back' : 'Security Check'}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mt-4">
                    {step === 1 ? 'Sign in to account' : 'Verify it\'s you'}
                </h2>
                <p className="text-slate-500 mt-2">
                    {step === 1 ? 'Enter your mobile number to get started.' : 'We sent a 6-digit code to your number.'}
                </p>
            </div>

            <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-6">
                {step === 1 ? (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="tel" 
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                placeholder="98765 43210"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-500 rounded-xl font-bold outline-none transition-all"
                                required
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">OTP Code</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-500 rounded-xl font-bold tracking-widest outline-none transition-all"
                                required
                            />
                        </div>
                    </div>
                )}

                <button 
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-purple-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/10 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            {step === 1 ? 'Send Verification Code' : 'Verify & Login'} 
                            {!loading && <ArrowRight size={18} />}
                        </>
                    )}
                </button>
            </form>
            
            {step === 2 && (
                <button onClick={() => setStep(1)} className="w-full mt-6 text-sm text-slate-400 hover:text-slate-600 font-medium">
                    Entered wrong number? <span className="text-purple-600 underline">Go back</span>
                </button>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;