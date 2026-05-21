import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, Twitter, Facebook, Youtube, 
  Mail, Phone, MapPin, ArrowRight, Package,
  ShieldCheck, Heart, Globe
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Section */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Package size={22} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                FOOD<span className="text-primary not-italic">HUB</span>
              </span>
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-xs">
              Experience the best food delivery service in the city. 
              Fresh ingredients, fast delivery, and premium taste delivered to your doorstep.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Instagram size={18} />, link: '#' },
                { icon: <Twitter size={18} />, link: '#' },
                { icon: <Facebook size={18} />, link: '#' },
                { icon: <Youtube size={18} />, link: '#' },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.link}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-all active:scale-90 border border-white/5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Restaurants', 'Offers', 'Contact Us'].map(link => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Policy */}
          <div className="space-y-8">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Legal Info</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy', 'Security'].map(link => (
                <li key={link}>
                  <Link to="#" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-8">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Stay Updated</h4>
            <div className="space-y-4">
              <p className="text-xs font-medium max-w-xs">Subscribe to get the latest offers and restaurant updates.</p>
              <div className="relative group">
                 <input 
                   type="email" 
                   placeholder="Your Email" 
                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-12 text-xs font-black uppercase tracking-widest focus:ring-1 focus:ring-primary outline-none text-white transition-all"
                 />
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                    <ArrowRight size={20} />
                 </button>
              </div>
            </div>
            <div className="space-y-3 pt-4">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Phone size={14} className="text-primary" />
                  +91 98765 43210
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Mail size={14} className="text-primary" />
                  support@foodhub.com
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
             <span>© 2026 FOODHUB TECHNOLOGIES</span>
             <span className="w-1 h-1 bg-slate-700 rounded-full" />
             <span>MADE WITH</span>
             <Heart size={10} className="text-primary" fill="currentColor" />
             <span>IN GUJARAT</span>
          </div>

          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                <Globe size={14} />
                English (US)
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                <ShieldCheck size={14} />
                Secure Checkout
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
