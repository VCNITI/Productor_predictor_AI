import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Save, Loader2, ArrowLeft, LogOut, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login'); // Redirect if not logged in
        } else {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
        }
    }, [user, navigate]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    phoneNumber: user.phoneNumber,
                    firstName: firstName,
                    lastName: lastName
                })
            });

            if (response.ok) {
                const data = await response.json();
                updateUser(data.user); // Update Context
                setSuccessMsg('Profile updated successfully!');
                
                // Hide success message after 3 seconds
                setTimeout(() => setSuccessMsg(''), 3000);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium">
                        <ArrowLeft size={20} /> Back to Home
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-all font-bold text-sm">
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden"
                >
                    {/* Cover / Header */}
                    <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg">
                                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                    <User size={40} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-black text-slate-900">Personal Settings</h1>
                            <p className="text-slate-500">Manage your profile details</p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
                                    <input 
                                        type="text" 
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:border-purple-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:border-purple-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 opacity-70">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number (Verified)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={user.phoneNumber}
                                        disabled
                                        className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-transparent rounded-xl font-bold text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                {successMsg ? (
                                    <span className="text-green-600 font-bold text-sm animate-pulse">{successMsg}</span>
                                ) : (
                                    <span></span>
                                )}
                                
                                <button 
                                    disabled={loading}
                                    className="px-8 py-3 bg-slate-900 hover:bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>

                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;