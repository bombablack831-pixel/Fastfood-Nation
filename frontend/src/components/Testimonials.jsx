import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ArrowRight, ArrowLeft } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Aryan Sharma",
      role: "Professional Foodie",
      text: "The delivery is incredibly fast. I've never had to wait more than 20 minutes. The packaging is always premium and spill-proof. Highly recommended!",
      rating: 5,
      image: "https://i.pravatar.cc/150?u=1"
    },
    {
      name: "Priya Patel",
      role: "Busy Professional",
      text: "Love the real-time tracking feature. I can see exactly where my rider is. The quality of restaurants on this platform is way better than others.",
      rating: 5,
      image: "https://i.pravatar.cc/150?u=2"
    },
    {
      name: "Rohan Mehta",
      role: "Gourmet Critic",
      text: "The interface is so clean and easy to use. I especially love the personalized recommendations. It feels like the app knows my taste perfectly.",
      rating: 4.8,
      image: "https://i.pravatar.cc/150?u=3"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
          <div className="space-y-4 text-center md:text-left">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-primary"
            >
              Customer Stories
            </motion.p>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
              Hear From Our <br />
              <span className="text-slate-300 dark:text-slate-700">Happy</span> Foodies.
            </h2>
          </div>
          
          <div className="flex gap-4">
             <button className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-400 active:scale-90">
                <ArrowLeft size={24} />
             </button>
             <button className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-400 active:scale-90 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <ArrowRight size={24} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/30 dark:shadow-none border border-slate-100 dark:border-white/5 space-y-8 relative group"
            >
              <div className="absolute top-10 right-10 text-slate-50 dark:text-white/5 group-hover:text-primary/10 transition-colors">
                <Quote size={80} fill="currentColor" />
              </div>

              <div className="flex items-center gap-1">
                 {[1,2,3,4,5].map(star => (
                   <Star key={star} size={14} fill={star <= review.rating ? "#FFD700" : "none"} color="#FFD700" />
                 ))}
                 <span className="text-xs font-black text-slate-900 dark:text-white ml-2">{review.rating}</span>
              </div>

              <p className="text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic relative z-10">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50 dark:border-white/5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg">
                  <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{review.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
