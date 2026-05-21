import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Store, MapPin, Navigation, Save, Loader2, 
    Info, Utensils, Globe, Camera, Trash2
} from 'lucide-react';
import api from '../../utils/api';
import RestaurantLayout from '../../layouts/RestaurantLayout';
import { toast } from 'react-toastify';

const RestaurantSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [restaurant, setRestaurant] = useState({
        name: '',
        description: '',
        address: '',
        cuisine: [],
        location: {
            coordinates: [0, 0]
        },
        image: ''
    });

    const [cuisineInput, setCuisineInput] = useState('');

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const { data } = await api.get('/restaurants/owner/me');
                setRestaurant({
                    name: data.name || '',
                    description: data.description || '',
                    address: data.address || '',
                    cuisine: data.cuisine || [],
                    location: (data.location && data.location.coordinates) ? data.location : { coordinates: [73.7125, 24.5854] },
                    image: data.image || ''
                });
            } catch (err) {
                toast.error('Failed to load restaurant data');
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestaurant(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (index, value) => {
        const newCoords = [...(restaurant?.location?.coordinates || [0, 0])];
        newCoords[index] = parseFloat(value) || 0;
        setRestaurant(prev => ({
            ...prev,
            location: { ...prev.location, coordinates: newCoords }
        }));
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            toast.info('Requesting GPS coordinates...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setRestaurant(prev => ({
                        ...prev,
                        location: {
                            ...prev.location,
                            coordinates: [position.coords.longitude, position.coords.latitude]
                        }
                    }));
                    toast.success('Location updated from GPS');
                },
                (error) => {
                    toast.error('Could not get current location. Please enter manually.');
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser');
        }
    };

    const addCuisine = () => {
        if (cuisineInput.trim() && !restaurant.cuisine.includes(cuisineInput.trim())) {
            setRestaurant(prev => ({
                ...prev,
                cuisine: [...prev.cuisine, cuisineInput.trim()]
            }));
            setCuisineInput('');
        }
    };

    const removeCuisine = (tag) => {
        setRestaurant(prev => ({
            ...prev,
            cuisine: prev.cuisine.filter(c => c !== tag)
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setSaving(true);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setRestaurant(prev => ({ ...prev, image: data.url }));
            toast.success('Image uploaded successfully!');
        } catch (err) {
            toast.error('Image upload failed');
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Auto-add pending cuisine if any
        let finalCuisine = [...restaurant.cuisine];
        if (cuisineInput.trim() && !finalCuisine.includes(cuisineInput.trim())) {
            finalCuisine.push(cuisineInput.trim());
            setCuisineInput('');
        }

        const dataToSave = { ...restaurant, cuisine: finalCuisine };

        setSaving(true);
        try {
            const { data } = await api.patch('/restaurants/owner/update', dataToSave);
            
            // Update state with server data to ensure sync
            setRestaurant({
                name: data.name || '',
                description: data.description || '',
                address: data.address || '',
                cuisine: data.cuisine || [],
                location: (data.location && data.location.coordinates) ? data.location : { coordinates: [73.7125, 24.5854] },
                image: data.image || ''
            });
            
            toast.success('Restaurant profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <RestaurantLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Loading profile...</p>
            </div>
        </RestaurantLayout>
    );

    return (
        <RestaurantLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">Management</p>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Restaurant Settings</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                                <Store size={18} className="text-primary" /> General Information
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Restaurant Name</label>
                                    <input 
                                        type="text"
                                        name="name"
                                        value={restaurant.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold placeholder:text-slate-300 focus:border-primary/20 outline-none transition-all dark:text-white"
                                        placeholder="Enter restaurant name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Description</label>
                                    <textarea 
                                        name="description"
                                        rows="4"
                                        value={restaurant.description}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold placeholder:text-slate-300 focus:border-primary/20 outline-none transition-all dark:text-white resize-none"
                                        placeholder="Tell customers about your kitchen..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Cuisine / Categories</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            value={cuisineInput}
                                            onChange={(e) => setCuisineInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCuisine())}
                                            className="flex-1 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold placeholder:text-slate-300 focus:border-primary/20 outline-none transition-all dark:text-white"
                                            placeholder="Add cuisine (e.g. Italian, Fast Food)"
                                        />
                                        <button 
                                            type="button"
                                            onClick={addCuisine}
                                            className="px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {restaurant.cuisine.map(tag => (
                                            <span key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {tag}
                                                <button type="button" onClick={() => removeCuisine(tag)}><Trash2 size={10} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                                <MapPin size={18} className="text-emerald-500" /> Physical Location
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Street Address</label>
                                    <textarea 
                                        name="address"
                                        rows="2"
                                        value={restaurant.address}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold placeholder:text-slate-300 focus:border-primary/20 outline-none transition-all dark:text-white resize-none"
                                        placeholder="Full address for delivery boys"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Longitude (X)</label>
                                        <input 
                                            type="number"
                                            step="any"
                                            value={restaurant?.location?.coordinates?.[0] || 0}
                                            onChange={(e) => handleLocationChange(0, e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold focus:border-primary/20 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Latitude (Y)</label>
                                        <input 
                                            type="number"
                                            step="any"
                                            value={restaurant?.location?.coordinates?.[1] || 0}
                                            onChange={(e) => handleLocationChange(1, e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold focus:border-primary/20 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="button"
                                    onClick={getCurrentLocation}
                                    className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-emerald-500/20"
                                >
                                    <Navigation size={14} /> Get GPS Coordinates
                                </button>

                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start gap-4">
                                    <Info className="text-slate-400 shrink-0" size={16} />
                                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                                        Setting accurate coordinates helps customers find your restaurant and ensures delivery boys get precise directions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image & Save */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                                <Camera size={18} className="text-violet-500" /> Banner Image
                            </h3>

                            <div className="space-y-4">
                                <div className="aspect-video rounded-3xl bg-slate-100 dark:bg-slate-900 overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center relative group">
                                    {restaurant.image ? (
                                        <img src={restaurant.image} className="w-full h-full object-cover" alt="Banner" />
                                    ) : (
                                        <Utensils size={40} className="text-slate-200 dark:text-slate-800" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Change Image</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Banner Image</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="banner-upload"
                                        />
                                        <label 
                                            htmlFor="banner-upload"
                                            className="flex-1 bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold text-slate-400 cursor-pointer hover:border-primary/20 transition-all flex items-center justify-between"
                                        >
                                            {saving ? 'Uploading...' : 'Choose File...'}
                                            <Camera size={16} />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Or Image URL</label>
                                    <input 
                                        type="text"
                                        name="image"
                                        value={restaurant.image}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-bold placeholder:text-slate-300 focus:border-primary/20 outline-none transition-all dark:text-white"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={saving}
                            className="w-full py-6 bg-slate-900 hover:bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/10 hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
                        >
                            {saving ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save Profile</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </RestaurantLayout>
    );
};

export default RestaurantSettings;
