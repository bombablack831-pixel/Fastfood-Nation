import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Hero from '../components/Hero';
import TopRestaurants from '../components/TopRestaurants';
import QuickCategories from '../components/QuickCategories';
import PopularDishes from '../components/PopularDishes';
import AppDownload from '../components/AppDownload';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import api from '../utils/api';
import {
   Zap, Star, ShieldCheck, Headphones, ArrowRight,
   MapPin, Clock, Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [restaurants, setRestaurants] = useState([]);
   const [dishes, setDishes] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');

   const { scrollYProgress } = useScroll();
   const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

   useEffect(() => {
      // Role-based redirection
      if (user) {
         if (['delivery', 'deliveryBoy'].includes(user.role)) {
            navigate('/delivery', { replace: true });
            return;
         }
         if (['owner', 'restaurantOwner'].includes(user.role)) {
            navigate('/dashboard', { replace: true });
            return;
         }
         if (user.role === 'admin') {
            navigate('/admin', { replace: true });
            return;
         }
      }

      const fetchData = async () => {
         try {
            const [resRest, resFood] = await Promise.all([
               api.get('/restaurants'),
               api.get('/restaurants/trending')
            ]);
            setRestaurants(resRest.data);
            setDishes(resFood.data);
         } catch (err) {
            console.error('Failed to fetch data:', err);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [user, navigate]);

   return (
      <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-x-hidden">
         {/* Scroll Progress Bar */}
         <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[110]" style={{ scaleX }} />

         {/* Hero Section */}
         <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

         <main>
            {/* Categories Section */}
            <QuickCategories />

            {/* Popular Restaurants Section */}
            <div id="restaurants-section">
               <TopRestaurants restaurants={restaurants} loading={loading} />
            </div>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-white dark:bg-slate-950">
               <div className="max-w-7xl mx-auto px-4 md:px-6">
                  <div className="text-center space-y-4 mb-20">
                     <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-primary"
                     >
                        Our Core Values
                     </motion.p>
                     <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                        Why Choose <span className="text-slate-300 dark:text-slate-700">FoodHub?</span>
                     </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                     {[
                        {
                           title: 'Super Fast Delivery',
                           desc: 'Lightning fast delivery protocols with real-time GPS synchronization.',
                           icon: <Zap className="w-8 h-8" />,
                           color: 'bg-orange-100 text-orange-600'
                        },
                        {
                           title: 'Certified Restaurants',
                           desc: 'Only the top-rated, hygiene-certified restaurants make it to our platform.',
                           icon: <Star className="w-8 h-8" />,
                           color: 'bg-amber-100 text-amber-600'
                        },
                        {
                           title: 'Secure Payments',
                           desc: '100% encrypted payment gateways with multiple wallet & card support.',
                           icon: <ShieldCheck className="w-8 h-8" />,
                           color: 'bg-emerald-100 text-emerald-600'
                        },
                        {
                           title: '24/7 Live Support',
                           desc: 'Always active mission support to help you with every bite you take.',
                           icon: <Headphones className="w-8 h-8" />,
                           color: 'bg-blue-100 text-blue-600'
                        },
                     ].map((feature, i) => (
                        <motion.div
                           key={i}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.1 }}
                           className="space-y-6 group cursor-default"
                        >
                           <div className={`w-16 h-16 rounded-[2rem] ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                              {feature.icon}
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{feature.title}</h3>
                              <p className="text-sm font-medium text-slate-500 leading-relaxed">{feature.desc}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Live Tracking Preview Section */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />

               <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                     <div className="space-y-10">
                        <div className="space-y-4">
                           <motion.p
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              className="text-[10px] font-black uppercase tracking-[0.3em] text-primary"
                           >
                              Real-time Protocols
                           </motion.p>
                           <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                              Track Every <br />
                              <span className="text-primary not-italic">Move</span> In Real-Time.
                           </h2>
                        </div>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                           Our state-of-the-art GPS tracking system allows you to monitor your rider from the restaurant to your doorstep with meter-perfect precision.
                        </p>
                        <div className="space-y-6">
                           {[
                              { icon: <MapPin size={20} />, label: 'Precise GPS Location' },
                              { icon: <Clock size={20} />, label: 'Accurate ETA Prediction' },
                              { icon: <Zap size={20} />, label: 'Live Status Notifications' },
                           ].map((item, i) => (
                              <div key={i} className="flex items-center gap-4 group">
                                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    {item.icon}
                                 </div>
                                 <span className="text-sm font-black text-white uppercase tracking-widest">{item.label}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Tracking Mockup */}
                     <div className="relative p-8 bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-xl">
                        <div className="bg-slate-900 rounded-[3rem] p-6 space-y-8 shadow-2xl overflow-hidden border border-white/5">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Est. Delivery Time</p>
                                 <p className="text-2xl font-black text-white uppercase italic">12:45 PM</p>
                              </div>
                              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                                 <Clock size={24} />
                              </div>
                           </div>

                           {/* Animated Timeline */}
                           <div className="space-y-6 relative pl-8 border-l-2 border-white/5">
                              {[
                                 { status: 'Order Picked Up', time: '12:20 PM', active: true },
                                 { status: 'On the way', time: '12:35 PM', active: true, current: true },
                                 { status: 'Arriving soon', time: '12:45 PM', active: false },
                              ].map((step, i) => (
                                 <div key={i} className="relative">
                                    <div className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full border-4 border-slate-900 ${step.active ? 'bg-primary' : 'bg-slate-700'} ${step.current ? 'animate-pulse scale-125' : ''}`} />
                                    <div className="space-y-1">
                                       <p className={`text-xs font-black uppercase italic tracking-tight ${step.active ? 'text-white' : 'text-slate-600'}`}>{step.status}</p>
                                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{step.time}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>

                           {/* Rider Info Card */}
                           <div className="p-4 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-800 overflow-hidden">
                                 <img src="https://i.pravatar.cc/100?u=rider" alt="rider" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Rider</p>
                                 <p className="text-sm font-black text-white uppercase italic">Rahul K.</p>
                              </div>
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                 <Headphones size={20} />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Popular Dishes Section */}
            <PopularDishes dishes={dishes} loading={loading} />

            {/* App Download Section */}
            <AppDownload />

            {/* Testimonials Section */}
            <Testimonials />
         </main>

         {/* Footer */}
         <Footer />
      </div>
   );
};

export default Home;
