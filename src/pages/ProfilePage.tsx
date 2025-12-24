import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Save, Loader2, ArrowLeft, LogOut, Phone, Mail, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebaseConfig';

const ProfilePage = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    
    // --- Form State ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    // --- UI State ---
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [isVerifying, setIsVerifying] = useState(false); // Controls Inline OTP display
    const [otp, setOtp] = useState('');
    const [confirmObj, setConfirmObj] = useState(null);

    // --- Refs for Recaptcha ---
    const recaptchaRef = useRef(null);
    const verifierRef = useRef(null);

    // 1. Initialize User Data
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setPhoneNumber(user.phoneNumber || '');
        }
    }, [user, navigate]);

    // 2. Cleanup Recaptcha on Unmount (Prevents "element removed" error)
    useEffect(() => {
        return () => {
            if (verifierRef.current) {
                try { verifierRef.current.clear(); } catch(e) {}
                verifierRef.current = null;
            }
            if (window.recaptchaVerifier) window.recaptchaVerifier = undefined;
        };
    }, []);

    // Helper: Initialize Recaptcha Instance
    const setupRecaptcha = () => {
        if (verifierRef.current) return verifierRef.current;
        if (recaptchaRef.current) {
            const verifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
                'size': 'invisible',
                'callback': () => console.log("Recaptcha resolved")
            });
            verifierRef.current = verifier;
            return verifier;
        }
    };

    // 3. Handle Main Button Click (Save OR Verify)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mode A: Verify OTP
        if (isVerifying) {
            await verifyAndSave();
            return;
        }

        // Mode B: Initial Save Click
        setLoading(true);
        setSuccessMsg('');

        const cleanNewPhone = phoneNumber.replace(/\s+/g, '');
        const cleanOldPhone = (user.phoneNumber || '').replace(/\s+/g, '');

        // CHECK: If Phone changed -> Send OTP
        if (cleanNewPhone !== cleanOldPhone && cleanNewPhone.length > 9) {
            await sendOtp(cleanNewPhone);
            return;
        }

        // CHECK: If Phone same/empty -> Just Save
        await saveToBackend(phoneNumber);
    };

    // 4. Send OTP Logic
    const sendOtp = async (phoneInput) => {
        try {
            let formatted = phoneInput.startsWith('+') ? phoneInput : `+91${phoneInput}`;
            
            const appVerifier = setupRecaptcha();
            if (!appVerifier) throw new Error("Recaptcha setup failed");

            const confirmation = await signInWithPhoneNumber(auth, formatted, appVerifier);
            setConfirmObj(confirmation);
            setIsVerifying(true); // SHOW INLINE OTP INPUT
            setLoading(false);
        } catch (error) {
            console.error("OTP Error:", error);
            alert("Error sending OTP: " + error.message);
            setLoading(false);
            // Reset verifier on error
            if (verifierRef.current) {
                verifierRef.current.clear();
                verifierRef.current = null;
            }
        }
    };

    // 5. Verify & Final Save Logic
    const verifyAndSave = async () => {
        setLoading(true);
        try {
            if (!confirmObj) return;
            await confirmObj.confirm(otp); // Firebase Verify
            await saveToBackend(phoneNumber); // Backend Save
            
            setIsVerifying(false); // Hide OTP Input
            setOtp('');
        } catch (error) {
            console.error("Verification Error:", error);
            alert("Invalid OTP code");
            setLoading(false);
        }
    };

    // 6. Backend Sync Function
    const saveToBackend = async (finalPhone) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    firstName,
                    lastName,
                    email,
                    phoneNumber: finalPhone
                })
            });

            if (response.ok) {
                const data = await response.json();
                updateUser(data.user);
                setSuccessMsg('Saved successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                throw new Error("Backend save failed");
            }
        } catch (error) {
            alert("Failed to save profile.");
        } finally {
            setLoading(false);
        }
    };

    // Cancel OTP Mode (e.g., typed wrong number)
    const handleCancelOtp = () => {
        setIsVerifying(false);
        setOtp('');
        setLoading(false);
    };

    if (!user) return null;

    // Logic: Lock phone ONLY if they logged in via Phone (no email) AND have a number
    const isPhoneLocked = !!user.phoneNumber && user.phoneNumber.length > 5 && !user.email;

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-10 px-4 sm:px-6">
            <div className="max-w-xl mx-auto">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm sm:text-base">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-all font-bold text-xs sm:text-sm">
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden relative"
                >
                    {/* Header Image */}
                    <div className="h-28 sm:h-32 bg-gradient-to-r from-purple-600 to-blue-600 relative">
                        <div className="absolute -bottom-10 left-6 sm:left-8">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-1 shadow-lg">
                                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="User" className="w-full h-full rounded-xl object-cover" />
                                    ) : (
                                        <User size={32} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-14 px-6 pb-8 sm:px-8 sm:pb-8">
                        <div className="mb-6">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Your Profile</h1>
                            <p className="text-sm text-slate-500">Manage your personal details</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* Names Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">First Name</label>
                                    <input 
                                        type="text" 
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        disabled={isVerifying} // Lock while verifying
                                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-purple-500 focus:bg-white outline-none transition-all text-sm sm:text-base disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        disabled={isVerifying}
                                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-purple-500 focus:bg-white outline-none transition-all text-sm sm:text-base disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Email - Always Locked */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="email" 
                                        value={email}
                                        disabled={true}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-100 border-transparent text-slate-500 cursor-not-allowed rounded-xl font-bold outline-none transition-all text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            {/* Phone - Editable if Google Login */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                                    {isVerifying && (
                                        <button 
                                            type="button" 
                                            onClick={handleCancelOtp}
                                            className="text-xs text-red-500 font-bold hover:underline"
                                        >
                                            Change Number
                                        </button>
                                    )}
                                </div>
                                
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                        placeholder="Add your phone number"
                                        // Lock if: Phone Login OR Currently Verifying
                                        disabled={isPhoneLocked || isVerifying}
                                        className={`w-full pl-11 pr-4 py-3.5 border rounded-xl font-bold outline-none transition-all text-sm sm:text-base ${
                                            (isPhoneLocked || isVerifying)
                                            ? "bg-slate-100 border-transparent text-slate-500 cursor-not-allowed" 
                                            : "bg-slate-50 border-slate-200 focus:border-purple-500 focus:bg-white"
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* --- INLINE OTP FIELD (Slides Down) --- */}
                            <AnimatePresence>
                                {isVerifying && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mt-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-xs font-bold text-purple-700 uppercase">Verification Code</label>
                                                <ShieldCheck size={16} className="text-purple-600" />
                                            </div>
                                            <p className="text-xs text-slate-500 mb-3">
                                                We sent a code to <b>{phoneNumber}</b>
                                            </p>
                                            <input 
                                                type="text" 
                                                value={otp}
                                                onChange={e => setOtp(e.target.value)}
                                                maxLength={6}
                                                placeholder="123456"
                                                className="w-full p-3 text-center text-lg tracking-[0.5em] font-bold bg-white border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none transition-all"
                                                autoFocus
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Button */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                {successMsg ? (
                                    <span className="text-green-600 font-bold text-xs sm:text-sm animate-pulse">{successMsg}</span>
                                ) : <span></span>}
                                
                                <button 
                                    disabled={loading}
                                    className="px-6 py-3 bg-slate-900 hover:bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50 text-sm sm:text-base"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                        isVerifying ? <ShieldCheck size={18} /> : <Save size={18} />
                                    )}
                                    {isVerifying ? "Verify & Save" : "Save Changes"}
                                </button>
                            </div>

                        </form>

                        {/* RECAPTCHA CONTAINER (Must remain rendered) */}
                        <div ref={recaptchaRef} className="mt-4"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;