import React, { useState, useEffect, useRef } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  
  const fromLocation = location.state?.from;
  const from = fromLocation 
    ? `${fromLocation.pathname}${fromLocation.search || ''}${fromLocation.hash || ''}`
    : "/";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaContainerRef = useRef(null);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

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
    return () => clearTimeout(timer);
  }, []);

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const gUser = result.user;

        // Split display name into first/last
        const names = gUser.displayName ? gUser.displayName.split(' ') : [''];
        const firstName = names[0];
        const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

        // Sync Google User to Backend
        await syncUserWithBackend({
            uid: gUser.uid,
            email: gUser.email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: "" // Google users usually don't have phone initially
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        alert("Google Login Failed. Please try again.");
        setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    let cleanInput = phoneNumber.trim().replace(/[\s-]/g, '');
    let formattedPhone = cleanInput.startsWith('+') ? cleanInput : `+91${cleanInput.replace(/^91/, '')}`;

    try {
      if (!window.recaptchaVerifier) throw new Error("Recaptcha not ready.");
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
    } catch (error) {
      alert("Error sending OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      await syncUserWithBackend({
          uid: result.user.uid,
          phoneNumber: result.user.phoneNumber
      });
    } catch (error) {
      alert("Invalid OTP code.");
      setLoading(false);
    }
  };

  // Shared Backend Sync Function
  const syncUserWithBackend = async (payload) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if(response.ok) {
            const data = await response.json();
            login(data.user);
            // If name is missing (new phone user), go to profile. Else go home.
            if (!data.user.firstName) {
                navigate('/profile', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            throw new Error("Backend Sync Failed");
        }
      } catch (error) {
          console.error(error);
          alert("Login successful but server sync failed.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SIDE - BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-slate-900 opacity-90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 text-center px-12">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                <img src="/logo.avif" alt="VCNITI Logo" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-5xl font-black text-white mb-6">VCNITI</h1>
            <p className="text-xl text-slate-300 font-light leading-relaxed">
                Powering the Future of Buying Construction Materials.               
            </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-slate-50">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100"
        >
            <div ref={recaptchaContainerRef}></div>

            <div className="mb-8 text-center sm:text-left">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider">
                    {step === 1 ? 'Welcome' : 'Verify'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4">
                    {step === 1 ? 'Sign in to VCNITI' : 'Verify OTP'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm sm:text-base">
                    {step === 1 ? 'Choose a method to continue.' : `Code sent to ${phoneNumber}`}
                </p>
            </div>

            {/* GOOGLE LOGIN BUTTON (Only step 1) */}
            {step === 1 && (
                <>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all mb-6 group"
                    >
                        <img 
                            src="https://www.svgrepo.com/show/475656/google-color.svg" 
                            alt="Google" 
                            className="w-6 h-6"
                        />
                        <span className="group-hover:text-slate-900">Sign in with Google</span>
                    </button>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Or with Phone</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>
                </>
            )}

            {/* PHONE FORM */}
            <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-5">
                {step === 1 ? (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="tel" 
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                placeholder="98765 43210"
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-500 rounded-xl font-bold outline-none transition-all text-slate-900 placeholder:text-slate-300"
                                required
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Enter 6-Digit Code</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-500 rounded-xl font-bold tracking-[0.5em] outline-none transition-all text-center text-xl"
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
                            {step === 1 ? 'Send OTP' : 'Verify & Login'} 
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