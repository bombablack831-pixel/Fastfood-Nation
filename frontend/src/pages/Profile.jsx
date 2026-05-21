import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    MapPin,
    Package,
    Heart,
    Settings,
    LogOut,
    ChevronRight,
    Camera,
    Wallet as WalletIcon,
    Shield,
    Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'orders', label: 'My Orders', icon: <Package size={20} />, path: '/orders', color: 'bg-orange-50 text-[#FF4B3A]' },
        { id: 'wallet', label: 'Spice Wallet', icon: <WalletIcon size={20} />, path: '/wallet', color: 'bg-green-50 text-green-600' },
        { id: 'favorites', label: 'Favorites', icon: <Heart size={20} />, path: '/favorites', color: 'bg-red-50 text-red-500' },
        { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={20} />, path: '/address-manager', color: 'bg-blue-50 text-blue-600' },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, path: '/notifications', color: 'bg-purple-50 text-purple-600' },
        { id: 'security', label: 'Account Security', icon: <Shield size={20} />, path: '/security', color: 'bg-gray-100 text-gray-700' },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white pt-24 pb-32 px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Profile Header */}
                <div className="relative">
                    <div className="h-32 md:h-48 bg-gradient-to-r from-orange-400 to-[#FF4B3A] rounded-[2.5rem] md:rounded-[4rem]" />
                    <div className="absolute -bottom-10 left-8 md:left-12 flex items-end gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-1 shadow-xl overflow-hidden border border-gray-100">
                                <img
                                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=FF4B3A&color=fff&size=128`}
                                    alt={user.name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-400 hover:text-[#FF4B3A] transition-all border border-gray-100">
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="pb-4 space-y-1">
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">{user.name}</h1>
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mt-20">
                    {[
                        { label: 'Orders', value: '12', icon: <Package size={14} /> },
                        { label: 'Credits', value: '₹450', icon: <WalletIcon size={14} /> },
                        { label: 'Rank', value: 'Silver', icon: <Shield size={14} /> },
                    ].map((stat, i) => (
                        <div key={i} className="p-4 md:p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center space-y-1">
                            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
                                {stat.icon} {stat.label}
                            </p>
                            <p className="text-sm md:text-xl font-black text-gray-900 uppercase italic tracking-tight">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Menu Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => navigate(item.path)}
                            className="p-5 rounded-3xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all flex items-center gap-4 cursor-pointer group"
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.label}</h3>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#FF4B3A] transition-colors" />
                        </motion.div>
                    ))}
                </div>

                {/* Dangerous Zone */}
                <div className="pt-8 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="w-full p-5 rounded-3xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                        <LogOut size={20} />
                        Terminate Session
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Profile;
