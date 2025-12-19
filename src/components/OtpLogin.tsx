import React, { useState, useEffect, useRef } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebaseConfig'; // Assuming firebaseConfig is correctly set up
import { Phone, Loader2, X, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfirmationResult } from 'firebase/auth';

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
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    const setupRecaptcha = () => {
        // Prevent duplicate reCAPTCHA instances
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', { // Use button ID
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved.
                    // This callback is triggered when the user successfully completes the reCAPTCHA challenge.
                    // The actual OTP sending is handled by handleSendOtp after this.
                },
                'expired-callback': () => {
                    alert("Verification expired. Please try again.");
                    setLoading(false);
                }
            });
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Ensure +91 format
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber.replace(/\D/g, '')}`;

        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier!;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            setStep(2);
        } catch (error: any) {
            console.error("SMS Error:", error);
            
            // Handle specific error codes for better feedback
            if (error.code === 'auth/billing-not-enabled') {
                alert("System Error: SMS services are currently disabled. Please contact support.");
            } else if (error.code === 'auth/invalid-phone-number') {
                alert("Invalid phone number format.");
            } else if (error.code === 'auth/too-many-requests') {
                alert("Too many requests. Please try again later or use a different number. If you are testing, consider using a fictional phone number from Firebase console.");
            }
            
            // Reset reCAPTCHA so user can try again immediately
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = undefined;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        if (!confirmationResult) {
            setLoading(false);
            return;
        }

        try {
            const result = await confirmationResult.confirm(otp);
            
            // Sync with Backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: result.user.uid,
                    phoneNumber: result.user.phoneNumber
                })
            });

            if(response.ok) {
                const userData = await response.json();
                onLoginSuccess(userData.user);
                onClose();
            } else {
                alert("Login synced failed. Please try again.");
            }
        } catch (error) {
            console.error("OTP Error:", error);
            alert("Invalid OTP code. Please check and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"> 

            
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {step === 1 ? <Phone size={32} /> : <ShieldCheck size={32} />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{step === 1 ? "Login" : "Verify OTP"}</h2>
                    <p className="text-slate-500 text-sm mt-2">{step === 1 ? "Enter phone number to continue" : "Enter the 6-digit code sent to you"}</p>
                </div>

                <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-4">
                    {step === 1 ? (
                        <input 
                            type="tel" 
                            placeholder="+91 98765 43210" 
                            value={phoneNumber} 
                            onChange={e => setPhoneNumber(e.target.value)} 
                            className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-purple-500 outline-none transition-all" 
                            required 
                        />
                    ) : (
                        <input 
                            type="text" 
                            placeholder="123456" 
                            value={otp} 
                            onChange={e => setOtp(e.target.value)} 
                            className="w-full p-4 bg-slate-50 rounded-xl text-center font-bold text-xl tracking-widest border-2 border-transparent focus:border-purple-500 outline-none transition-all" 
                            required 
                            maxLength={6} 
                        />
                    )}
                    
                    <button disabled={loading} id="sign-in-button" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black transition-all disabled:opacity-70">
                        {loading ? <Loader2 className="animate-spin" /> : (step === 1 ? "Get OTP" : "Verify & Login")}
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
