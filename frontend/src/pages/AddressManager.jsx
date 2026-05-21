import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Plus, Home, Briefcase, Navigation,
    Trash2, Edit3, CheckCircle2, X, Save,
    ArrowLeft, Map, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import CustomerLayout from '../layouts/CustomerLayout';
import LocationPicker from '../components/LocationPicker';

const AddressManager = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        label: 'Home',
        fullAddress: '',
        isDefault: false,
        location: { lat: 24.1030, lng: 72.3361 }
    });

    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo) { navigate('/login'); return; }
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get('/addresses');
            setAddresses(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();

        // Structure for backend (GeoJSON Point)
        const submissionData = {
            ...formData,
            location: {
                type: 'Point',
                coordinates: [formData.location.lng, formData.location.lat]
            }
        };

        try {
            if (editingAddress) {
                console.log('Updating Address ID:', editingAddress._id);
                const { data } = await api.put(`/addresses/${editingAddress._id}`, submissionData);
                setAddresses(data);
                toast.success('Address updated! 🏠');
            } else {
                const { data } = await api.post('/addresses', submissionData);
                setAddresses(data);
                toast.success('New address added! ✨');
            }
            resetForm();
        } catch (err) {
            console.error('Save Error:', err.response?.data || err.message);
            toast.error(err.response?.data?.message || 'Failed to save address');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this address?')) return;
        try {
            const { data } = await api.delete(`/addresses/${id}`);
            setAddresses(data);
            toast.info('Address removed');
        } catch (err) {
            toast.error('Failed to delete address');
        }
    };

    const resetForm = () => {
        setFormData({
            label: 'Home',
            fullAddress: '',
            isDefault: false,
            location: { lat: 24.1030, lng: 72.3361 }
        });
        setShowForm(false);
        setEditingAddress(null);
    };

    const startEditing = (addr) => {
        setEditingAddress(addr);
        setFormData({
            label: addr.label,
            fullAddress: addr.fullAddress,
            isDefault: addr.isDefault,
            location: {
                lat: addr.location?.coordinates?.[1] || 24.1030,
                lng: addr.location?.coordinates?.[0] || 72.3361
            }
        });
        setShowForm(true);
    };

    const handleLocationSelect = (coords) => {
        setFormData(prev => ({ ...prev, location: coords }));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <CustomerLayout>
            <header className="mb-16 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em]">Location Management</span>
                </div>
                <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Safe <br /> <span className="text-emerald-500 italic">Hubs</span></h1>
            </header>

            <div className="space-y-8">
                <AnimatePresence>
                    {!showForm && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setShowForm(true)}
                            className="w-full p-8 border-2 border-dashed border-emerald-200 dark:border-emerald-500/20 rounded-[2.5rem] bg-emerald-50/20 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-500 flex flex-col items-center gap-4 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all group"
                        >
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <Plus size={32} />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest">Add New Hub</span>
                        </motion.button>
                    )}

                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-700 space-y-10"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{editingAddress ? 'Update Protocol' : 'Deploy New Hub'}</h3>
                                <button onClick={resetForm} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSaveAddress} className="space-y-8">
                                {/* Location Picker Integration */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-2 flex items-center gap-2">
                                        <Target size={12} className="text-emerald-500" /> Precise Satellite Position
                                    </label>
                                    <LocationPicker
                                        initialLocation={formData.location}
                                        onLocationSelect={handleLocationSelect}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-2">Hub Identity</label>
                                    <div className="flex gap-4">
                                        {['Home', 'Work', 'Other'].map(l => (
                                            <button
                                                key={l}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, label: l })}
                                                className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.label === l ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-xl shadow-slate-900/10' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                            >
                                                {l === 'Home' ? <Home size={14} className="inline mr-2" /> : l === 'Work' ? <Briefcase size={14} className="inline mr-2" /> : <Navigation size={14} className="inline mr-2" />}
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-2">Full Delivery Address</label>
                                    <textarea
                                        required
                                        placeholder="STREET, BUILDING, LANDMARK..."
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 h-24 no-scrollbar placeholder:text-slate-300 dark:placeholder:text-gray-700"
                                        value={formData.fullAddress}
                                        onChange={e => setFormData({ ...formData, fullAddress: e.target.value })}
                                    />
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={formData.isDefault}
                                            onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-all ${formData.isDefault ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isDefault ? 'translate-x-6' : ''}`} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Set as primary hub</span>
                                </label>

                                <button type="submit" className="w-full bg-slate-900 dark:bg-emerald-500 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/10 active:scale-95 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3">
                                    <Save size={18} /> {editingAddress ? 'Update Hub Intelligence' : 'Confirm Destination Hub'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-6 pt-10">
                    <AnimatePresence>
                        {addresses.map((addr) => (
                            <motion.div
                                key={addr._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-8 rounded-[3rem] border-2 transition-all flex items-center gap-8 ${addr.isDefault ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-500/20' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 dark:shadow-none hover:border-slate-100 dark:hover:border-slate-600'}`}
                            >
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 ${addr.isDefault ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-gray-600'}`}>
                                    {addr.label === 'Home' ? <Home size={24} /> : addr.label === 'Work' ? <Briefcase size={24} /> : <Navigation size={24} />}
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{addr.label}</h4>
                                        {addr.isDefault && <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-widest">Primary</span>}
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase leading-relaxed truncate">{addr.fullAddress}</p>
                                    {addr.location?.coordinates && (
                                        <div className="flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                                            <Map size={10} /> Georeferenced Locked
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => startEditing(addr)}
                                        className="p-4 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-gray-500 rounded-2xl hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr._id)}
                                        className="p-4 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-gray-500 rounded-2xl hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default AddressManager;
