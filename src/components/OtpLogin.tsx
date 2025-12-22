import React, { useState, useEffect, useRef } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebaseConfig';
import { Phone, Loader2, X, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfirmationResult, User as FirebaseUser } from 'firebase/auth';

interface CustomWindow extends Window {
    recaptchaVerifier?: RecaptchaVerifier;
}
declare const window: CustomWindow;

interface OtpLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: any) => void;
}

const OtpLogin: React.FC<OtpLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Names
    const [loading, setLoading] = useState(false);
    
    // Form Inputs
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const recaptchaContainerRef = useRef<HTMLDivElement>(null);

    // --- RECAPTCHA SETUP ---
    useEffect(() => {
        const initRecaptcha = async () => {
            if (isOpen && recaptchaContainerRef.current && !window.recaptchaVerifier) {
                try {
                    const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                        'size': 'invisible',
                        'callback': () => {}, // Handled automatically
                        'expired-callback': () => {
                            setLoading(false);
                            alert("Verification expired. Please try again.");
                        }
                    });
                    await verifier.render();
                    window.recaptchaVerifier = verifier;
                } catch (error) {
                    console.error("Recaptcha Init Error", error);
                }
            }
        };

        if (isOpen) setTimeout(initRecaptcha, 100);

        return () => {
            if (window.recaptchaVerifier) {
                try { window.recaptchaVerifier.clear(); } catch (e) {}
                window.recaptchaVerifier = undefined;
            }
        };
    }, [isOpen]);

    // --- STEP 1: SEND OTP ---
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Remove spaces and dashes first to check purely digits/symbols
        let cleanInput = phoneNumber.trim().replace(/[\s-]/g, '');
        let formattedPhone = cleanInput;

        // LOGIC:
        if (cleanInput.startsWith('+')) {
            // Case 1: Already has +, keep it (e.g., +919686231591)
            formattedPhone = cleanInput;
        } else if (cleanInput.startsWith('91') && cleanInput.length === 12) {
            // Case 2: Starts with 91 and is 12 digits (e.g., 919686231591)
            // Just add the plus
            formattedPhone = `+${cleanInput}`;
        } else {
            // Case 3: Standard 10 digit number (e.g., 9686231591)
            // Add +91
            formattedPhone = `+91${cleanInput}`;
        }

        try {
            if (!window.recaptchaVerifier) throw new Error("Recaptcha not ready");
            
            // Pass the formatted number to Firebase
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
            
            setConfirmationResult(confirmation);
            setStep(2);
        } catch (error: any) {
            console.error("SMS Error:", error);
            alert("Failed to send OTP: " + error.message);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = undefined;
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: VERIFY OTP & CHECK USER STATUS ---
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!confirmationResult) return;

        try {
            // 1. Verify OTP with Firebase
            const result = await confirmationResult.confirm(otp);
            const user = result.user;
            setFirebaseUser(user);

            // 2. Check if user exists in YOUR Backend
            const checkResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.uid}`);
            
            if (checkResponse.ok) {
                // CASE A: EXISTING USER -> Login immediately
                const existingUserData = await checkResponse.json();
                onLoginSuccess(existingUserData);
                onClose();
            } else {
                // CASE B: NEW USER -> Go to Name Form
                setStep(3);
            }

        } catch (error) {
            console.error("OTP Error:", error);
            alert("Invalid OTP or Network Error.");
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 3: CREATE PROFILE ---
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!firebaseUser) return;

        try {
            const payload = {
                uid: firebaseUser.uid,
                phoneNumber: firebaseUser.phoneNumber,
                firstName: firstName,
                lastName: lastName
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                onLoginSuccess(data.user);
                onClose();
            } else {
                alert("Failed to create profile.");
            }
        } catch (error) {
            console.error("Backend Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
                <div ref={recaptchaContainerRef}></div>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {step === 1 && <Phone size={32} />}
                        {step === 2 && <ShieldCheck size={32} />}
                        {step === 3 && <User size={32} />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {step === 1 ? "Login" : step === 2 ? "Verify OTP" : "Profile Details"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">
                        {step === 1 && "Enter phone number to continue"}
                        {step === 2 && "Enter the 6-digit code sent to you"}
                        {step === 3 && "Please enter your name to complete signup"}
                    </p>
                </div>

                <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleProfileSubmit} className="space-y-4">
                    {step === 1 && (
                        <input type="tel" placeholder="+91 98765 43210" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-purple-500 outline-none transition-all" required />
                    )}
                    {step === 2 && (
                        <input type="text" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl text-center font-bold text-xl tracking-widest border-2 border-transparent focus:border-purple-500 outline-none transition-all" required maxLength={6} />
                    )}
                    {step === 3 && (
                        <div className="space-y-3">
                            <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-medium border-2 border-transparent focus:border-purple-500 outline-none transition-all" required />
                            <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-medium border-2 border-transparent focus:border-purple-500 outline-none transition-all" required />
                        </div>
                    )}
                    
                    <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black transition-all disabled:opacity-70">
                        {loading ? <Loader2 className="animate-spin" /> : (step === 3 ? "Complete Signup" : step === 1 ? "Get OTP" : "Verify")}
                    </button>
                </form>

                {step === 2 && (
                    <button onClick={() => setStep(1)} className="w-full mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-purple-600">Change Number</button>
                )}
            </motion.div>
        </div>
    );
};

export default OtpLogin;