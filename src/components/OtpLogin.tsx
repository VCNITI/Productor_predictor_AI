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
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState(''); // New state for formatted phone number

    // Clean up reCAPTCHA when modal closes to prevent "element removed" errors
    useEffect(() => {
        if (!isOpen && window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = undefined;
        }
    }, [isOpen]);

    // Function to actually send the OTP via Firebase
    const sendOtpToFirebase = async (phone: string, appVerifier: RecaptchaVerifier) => {
        try {
            const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
            setConfirmationResult(confirmation);
            setStep(2);
        } catch (error: any) {
            console.error("SMS Error:", error);
            if (error.code === 'auth/billing-not-enabled') {
                alert("System Error: SMS services are currently disabled. Please contact support.");
            } else if (error.code === 'auth/invalid-phone-number') {
                alert("Invalid phone number format.");
            } else if (error.code === 'auth/too-many-requests') {
                alert("Too many requests. Please try again later or use a different number. If you are testing, consider using a fictional phone number from Firebase console.");
            } else {
                alert("Failed to send OTP. Please try again later.");
            }
        } finally {
            setLoading(false);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = undefined;
            }
        }
    };

    const setupRecaptcha = () => {
        // Prevent duplicate reCAPTCHA instances
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', { // Use button ID
                'size': 'invisible',
                'callback': (response) => {
                    console.log('reCAPTCHA solved, proceeding with OTP sending.');
                    // reCAPTCHA solved, now send the OTP
                    if (formattedPhoneNumber) { // Use the stored formatted phone number
                        sendOtpToFirebase(formattedPhoneNumber, window.recaptchaVerifier!);
                    } else {
                        console.error("Formatted phone number not available after reCAPTCHA.");
                        setLoading(false);
                    }
                },
                'expired-callback': () => {
                    console.log('reCAPTCHA expired');
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
        const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber.replace(/\D/g, '')}`;
        setFormattedPhoneNumber(formatted); // Store formatted number

        try {
            setupRecaptcha();
            // The reCAPTCHA is now set up. Clicking the button will trigger it.
            // The actual sending of OTP happens in the reCAPTCHA callback.
            // We just need to ensure the reCAPTCHA is rendered/verified.
            // For invisible reCAPTCHA bound to a button, the click on the button itself triggers the verification.
            // There's no explicit call to `recaptchaVerifier.verify()` or `recaptchaVerifier.render()` here,
            // as the button click mechanism implicitly handles it when using the 'sign-in-button' ID.

        } catch (error: any) {
            console.error("General error during reCAPTCHA setup or initial phase:", error);
            alert("An error occurred during verification setup. Please try again.");
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
