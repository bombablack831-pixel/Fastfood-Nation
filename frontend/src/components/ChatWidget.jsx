import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Headset } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import api from '../utils/api';

const socket = io('http://localhost:5000');

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const roomId = userInfo ? `support_${userInfo._id}` : null;

    useEffect(() => {
        if (!roomId) return;

        socket.emit('join_room', roomId);

        // Fetch old messages
        api.get(`/chat/${roomId}`).then(res => setMessages(res.data)).catch(() => {});

        socket.on('receive_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [roomId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !userInfo) return;

        const msgData = {
            room: roomId,
            sender: userInfo._id,
            text: input
        };

        socket.emit('send_message', msgData);
        
        // Simulating Auto-Reply
        setTimeout(() => {
            const replies = [
                "Transmitting support signals... 🛰️ How can Spice Hub help you today?",
                "Received your message! Our kitchen crew is working hard. Is this about a specific order?",
                "Hey there! 🌶️ One of our support pilots will be with you shortly. In the meantime, let us know your query!",
                "Order status? Logistics? We've got you covered. Please share your details. 🕵️‍♂️"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const autoMsg = {
                room: roomId,
                sender: 'support_ai',
                text: randomReply,
                createdAt: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, autoMsg]);
        }, 1500);

        setInput('');
    };

    if (!userInfo) return null;

    return (
        <div className="fixed bottom-28 lg:bottom-6 right-6 z-[1000] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white dark:bg-slate-800 w-80 md:w-96 h-[450px] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Headset size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-tighter">Fastfood Support</h4>
                                    <p className="text-[10px] opacity-80 font-bold">Typically replies in minutes</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            <div className="text-center py-2">
                                <span className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Today</span>
                            </div>
                            
                            {messages.map((msg, i) => {
                                const isMe = msg.sender === userInfo._id;
                                const isAI = msg.sender === 'support_ai';
                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${
                                            isMe ? 'bg-primary text-white rounded-br-sm shadow-lg shadow-primary/20' : 
                                            isAI ? 'bg-orange-500 text-white rounded-bl-sm shadow-lg shadow-orange-500/20' :
                                            'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-600">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium px-2 dark:text-white"
                                />
                                <button 
                                    onClick={handleSend}
                                    className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-slate-900 dark:bg-slate-800 text-white rotate-90' : 'bg-primary text-white shadow-primary/40'}`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
