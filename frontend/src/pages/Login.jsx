import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome as Google } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login attempt with:', email);
        setLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                toast.success('Access Granted. Welcome back!');

                // Role-based redirection
                const role = success.role;
                if (role === 'owner' || role === 'restaurantOwner') {
                    navigate('/dashboard');
                } else if (role === 'delivery' || role === 'deliveryBoy') {
                    navigate('/delivery');
                } else if (role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication Failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative z-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 relative z-10"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-[#FF4B3A] rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-orange-500/20 mb-6"
                    >
                        <Lock className="text-white" size={32} />
                    </motion.div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Welcome Back!</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Sign in to continue your mission</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
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
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-standard pl-14"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-[#FF4B3A] uppercase tracking-widest hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-5 group cursor-pointer relative z-20"
                    >
                        {loading ? 'Initializing...' : 'Sign In'}
                        {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                        <span className="px-4 bg-white text-gray-300">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="btn-secondary py-4 flex items-center justify-center gap-3 cursor-pointer">
                        <Google size={18} className="text-[#DB4437]" />
                        <span className="text-[10px] uppercase tracking-widest font-black">Google</span>
                    </button>
                    <button className="btn-secondary py-4 flex items-center justify-center gap-3 cursor-pointer">
                        <Github size={18} />
                        <span className="text-[10px] uppercase tracking-widest font-black">Github</span>
                    </button>
                </div>

                <p className="text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                    Don't have an account? {' '}
                    <Link to="/register" className="text-[#FF4B3A] hover:underline">
                        Create Account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
