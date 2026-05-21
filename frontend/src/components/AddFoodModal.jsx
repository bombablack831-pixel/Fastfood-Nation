import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, Upload, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const AddFoodModal = ({ isOpen, onClose, restaurantId, food, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true
  });
  const [uploading, setUploading] = useState(false);

  const categories = ['Pizza', 'Burger', 'Sushi', 'Italian', 'Chinese', 'Indian', 'Dessert', 'Beverages'];
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (food) {
      setFormData(food);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        isAvailable: true
      });
    }
  }, [food, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      
      if (food) {
        response = await api.put(`/restaurants/food/${food._id}`, formData);
        toast.success('Dish updated successfully!');
      } else {
        response = await api.post(`/restaurants/${restaurantId}/food`, formData);
        toast.success('New dish added to menu!');
      }
      
      onUpdate(response.data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);

    try {
      const { data } = await api.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, image: data.url });
      setUploading(false);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload Error:', error);
      setUploading(false);
      toast.error('Image upload failed. Ensure Cloudinary keys exist.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
          >
            <div className="flex justify-between items-center px-6 py-5 sm:px-10 sm:py-8 border-b border-slate-50">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                  {food ? 'Edit Masterpiece' : 'Add New Creation'}
                </h2>
                <p className="text-[10px] font-black text-emerald-500 tracking-widest uppercase mt-2">Culinary Management</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 sm:p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-500 transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dish Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Truffle Mushroom Pizza"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-slate-900 text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-slate-900 text-sm appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-slate-900 text-sm"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image Upload (Direct)</label>
                  <div className="relative">
                     <input 
                       type="file"
                       accept="image/*"
                       onChange={uploadFileHandler}
                       className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-slate-900 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-emerald-50 file:text-emerald-500 hover:file:bg-emerald-100"
                     />
                     {uploading && <div className="absolute right-4 top-4 w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
                     {!uploading && formData.image && <div className="absolute right-4 top-3 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">Uploaded</div>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  rows="3"
                  required
                  placeholder="Tell the story of this dish..."
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-slate-900 text-sm resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-500 text-white py-5 rounded-[2rem] font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Save size={18} strokeWidth={3} /> {food ? 'Update Item' : 'Add to Menu'}
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-10 py-5 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddFoodModal;
