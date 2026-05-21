import React, { useState, useEffect } from 'react';
import RestaurantLayout from '../../layouts/RestaurantLayout';
import { Plus, Search, Edit3, Trash2, Leaf, Star, Image as ImageIcon, CheckCircle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const RestaurantMenu = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '', price: '', description: '', image: '', category: '', isVeg: true, isAvailable: true
    });

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data: resData } = await api.get('/restaurants/owner/me');
                setRestaurant(resData);
                const { data: menuData } = await api.get(`/restaurants/${resData._id}/menu`);
                setMenu(menuData);
            } catch (err) {
                toast.error('Failed to load menu');
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                const { data } = await api.put(`/restaurants/food/${editingItem._id}`, formData);
                setMenu(menu.map(item => item._id === editingItem._id ? data : item));
                toast.success('Item updated');
            } else {
                const { data } = await api.post(`/restaurants/${restaurant._id}/food`, formData);
                setMenu([...menu, data]);
                toast.success('Item added to menu');
            }
            setIsModalOpen(false);
            setFormData({ name: '', price: '', description: '', image: '', category: '', isVeg: true, isAvailable: true });
            setEditingItem(null);
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await api.delete(`/restaurants/food/${id}`);
            setMenu(menu.filter(item => item._id !== id));
            toast.success('Item removed');
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const filteredMenu = menu.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <RestaurantLayout>
            <div className="space-y-8 pb-20">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Menu Manager</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Customize your restaurant offerings</p>
                    </div>
                    <button 
                        onClick={() => { setEditingItem(null); setFormData({ name: '', price: '', description: '', image: '', category: '', isVeg: true, isAvailable: true }); setIsModalOpen(true); }}
                        className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                    >
                        <Plus size={20} /> Add New Item
                    </button>
                </header>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search menu items or categories..." 
                        className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-5 pl-16 pr-6 text-sm font-black shadow-sm focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Menu List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Catalog...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredMenu.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden relative group"
                                >
                                    <div className="flex gap-5">
                                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                    <Star size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-3.5 h-3.5 border ${item.isVeg ? 'border-emerald-500' : 'border-rose-500'} flex items-center justify-center rounded-sm p-0.5`}>
                                                    <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest truncate">{item.category}</span>
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{item.name}</h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xl font-black text-primary tracking-tighter italic leading-none">₹{item.price}</p>
                                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {item.isAvailable ? 'Active' : 'Draft'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Overlay */}
                                    <div className="mt-6 flex gap-3">
                                        <button 
                                            onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }}
                                            className="flex-1 py-3 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-500"
                                        >
                                            Edit Item
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Modern Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                            onClick={() => setIsModalOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[3rem] p-10 w-full max-w-xl relative shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                                        {editingItem ? 'Update Item' : 'New Menu Item'}
                                    </h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Inventory Configuration</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Dish Name</p>
                                        <input className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-2xl p-4 text-sm font-black outline-none transition-all" placeholder="e.g. Butter Chicken Bliss" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Price (₹)</p>
                                            <input className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-2xl p-4 text-sm font-black outline-none transition-all" placeholder="599" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                                        </div>
                                        <div className="relative">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category</p>
                                            <input className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-2xl p-4 text-sm font-black outline-none transition-all" placeholder="Main Course" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Image URL</p>
                                        <input className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-2xl p-4 text-sm font-black outline-none transition-all" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                                    </div>

                                    <div className="relative">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Description</p>
                                        <textarea className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-2xl p-4 text-sm font-black outline-none transition-all resize-none" placeholder="What makes this dish special?" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={() => setFormData({...formData, isVeg: !formData.isVeg})} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${formData.isVeg ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                <div className={`w-2 h-2 rounded-full bg-white ${formData.isVeg ? '' : 'rotate-45'}`} />
                                                {formData.isVeg ? 'Vegetarian' : 'Non-Veg'}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Market Status</span>
                                            <button type="button" onClick={() => setFormData({...formData, isAvailable: !formData.isAvailable})} className={`w-14 h-8 rounded-full p-1 transition-colors relative ${formData.isAvailable ? 'bg-primary' : 'bg-slate-300'}`}>
                                                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${formData.isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-primary py-6 rounded-2xl text-white font-black uppercase tracking-[0.2em] mt-4 shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all">
                                    {editingItem ? 'Save Changes' : 'Confirm & Deploy'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </RestaurantLayout>
    );
};

export default RestaurantMenu;
