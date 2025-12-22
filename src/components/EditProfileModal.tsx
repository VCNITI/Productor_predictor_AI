import React, { useState, useEffect } from 'react';
import { Loader2, X, User, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUpdateSuccess: (updatedUser: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onUpdateSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);

    // Pre-fill existing data when modal opens
    useEffect(() => {
        if (user && isOpen) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // --- SAFETY CHECK ---
        // Ensure we strictly have the identifiers needed for the backend
        if (!user?.uid || !user?.phoneNumber) {
            console.error("Missing Critical User Data:", user);
            alert("System Error: Your profile is missing a User ID or Phone Number. Please logout and login again.");
            setLoading(false);
            return;
        }

        const payload = {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            firstName: firstName,
            lastName: lastName
        };

        // Debugging: Check the browser console to see exactly what is being sent
        console.log("Sending Profile Update:", payload);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                onUpdateSuccess(data.user);
                onClose();
            } else {
                // Show the specific error message from the backend
                alert(`Update Failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("Network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full">
                    <X size={20}/>
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
                    <p className="text-slate-500 text-sm mt-2">Update your personal details</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">First Name</label>
                            <input 
                                type="text" 
                                value={firstName} 
                                onChange={e => setFirstName(e.target.value)} 
                                className="w-full p-4 bg-slate-50 rounded-xl font-medium border-2 border-transparent focus:border-purple-500 outline-none transition-all" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Last Name</label>
                            <input 
                                type="text" 
                                value={lastName} 
                                onChange={e => setLastName(e.target.value)} 
                                className="w-full p-4 bg-slate-50 rounded-xl font-medium border-2 border-transparent focus:border-purple-500 outline-none transition-all" 
                                required 
                            />
                        </div>
                    </div>
                    
                    <button 
                        disabled={loading} 
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black transition-all disabled:opacity-70 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditProfileModal;