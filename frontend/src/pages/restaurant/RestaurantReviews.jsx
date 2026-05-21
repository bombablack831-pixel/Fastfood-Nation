import React from 'react';
import RestaurantLayout from '../../layouts/RestaurantLayout';
import { 
    Star, 
    MessageSquare, 
    ChevronRight, 
    ThumbsUp, 
    Flag,
    MoreHorizontal,
    Search,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RestaurantReviews = () => {
    const reviews = [
        { id: 1, user: 'Arjun K.', rating: 5, comment: 'Exceptional delivery speed! The Spicy Ramen was perfectly cooked and arrived hot.', date: '2 hours ago', avatar: 'AK' },
        { id: 2, user: 'Sanya M.', rating: 4, comment: 'The Truffle Burger was a culinary masterpiece, but could use slightly more sauce.', date: 'Yesterday', avatar: 'SM' },
        { id: 3, user: 'Rahul V.', rating: 5, comment: 'Consistently high quality and great taste. Highly recommended for authentic dining.', date: '2 days ago', avatar: 'RV' },
        { id: 4, user: 'Ishita P.', rating: 3, comment: 'Flavor profile was decent, but the food arrived a bit later than expected.', date: '3 days ago', avatar: 'IP' },
    ];

    return (
        <RestaurantLayout>
            <div className="space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Customer Feedback</h1>
                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Listen to your patrons and improve quality</p>
                    </div>
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                            placeholder="SEARCH REVIEWS..." 
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-16 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                     {/* Stats Sidebar */}
                     <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[3.5rem] p-12 text-center border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -mx-8 -my-8" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 relative z-10">Overall Rating</p>
                            <h2 className="text-8xl font-black italic tracking-tighter text-slate-900 leading-none relative z-10">4.8</h2>
                            <div className="flex justify-center gap-1.5 my-8 text-yellow-400 relative z-10">
                                {[1,2,3,4,5].map(s => <Star key={s} size={28} fill="currentColor" stroke="none" />)}
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">Based on 2,450 Reviews</p>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Rating Distribution</h4>
                            {[5, 4, 3, 2, 1].map((n) => (
                                <div key={n} className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-400 w-4">{n}★</span>
                                    <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${n === 5 ? 80 : n === 4 ? 60 : n === 3 ? 30 : 5}%` }}
                                            className="h-full bg-primary rounded-full"
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900 w-10 text-right">{n === 5 ? '80%' : n === 4 ? '15%' : '5%'}</span>
                                </div>
                            ))}
                        </div>
                     </div>

                     {/* Reviews Feed */}
                     <div className="lg:col-span-8 space-y-8">
                        <AnimatePresence>
                            {reviews.map((review, i) => (
                                <motion.div 
                                    key={review.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] -mr-4 -mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center font-black uppercase text-sm text-primary group-hover:scale-110 transition-transform shadow-inner">
                                                {review.avatar}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 tracking-tight leading-none mb-1.5">{review.user}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{review.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 text-yellow-400 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" stroke="none" />)}
                                        </div>
                                    </div>
                                    
                                    <p className="text-slate-600 font-medium italic mb-10 text-lg leading-relaxed relative z-10 px-2 border-l-4 border-slate-100">
                                        "{review.comment}"
                                    </p>
                                    
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex gap-6">
                                             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                                                <ThumbsUp size={16} /> Helpful
                                             </button>
                                             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                                                <MessageSquare size={16} /> Reply to patron
                                             </button>
                                        </div>
                                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <button className="w-full py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-white transition-all transform hover:-translate-y-1">
                            Load historical feedback
                        </button>
                     </div>
                </div>
            </div>
        </RestaurantLayout>
    );
};

export default RestaurantReviews;

