import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await register(name, email, password);
            if (success) {
                toast.success('Credentials Validated. Welcome to the Network.');
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration Failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-[#FF4B3A] rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-orange-500/20 mb-6"
                    >
                        <User className="text-white" size={32} />
                    </motion.div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Create Account</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Join the elite culinary network</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF4B3A] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="input-standard pl-14"
                            />
                        </div>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF4B3A] transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-standard pl-14"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF4B3A] transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="Create Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-standard pl-14"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <ShieldCheck className="text-[#FF4B3A] shrink-0" size={18} />
                        <p className="text-[10px] font-bold text-orange-800 uppercase leading-tight">
                            By joining, you agree to our <span className="underline cursor-pointer">Service Protocols</span>
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-5 group"
                    >
                        {loading ? 'Establishing Link...' : 'Register Now'}
                        {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
                    </button>
                </form>

                <p className="text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                    Already an operative? {' '}
                    <Link to="/login" className="text-[#FF4B3A] hover:underline">
                        Sign In
                    </Link>
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <Link to="/join/restaurant" className="flex flex-col items-center p-3 rounded-xl bg-slate-50 hover:bg-orange-50 transition-colors group">
                        <span className="text-[10px] font-black text-slate-400 group-hover:text-[#FF4B3A]">RESTAURANT</span>
                        <span className="text-[8px] font-bold text-slate-300">Join as Partner</span>
                    </Link>
                    <Link to="/join/delivery" className="flex flex-col items-center p-3 rounded-xl bg-slate-50 hover:bg-orange-50 transition-colors group">
                        <span className="text-[10px] font-black text-slate-400 group-hover:text-[#FF4B3A]">DELIVERY</span>
                        <span className="text-[8px] font-bold text-slate-300">Join as Rider</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
