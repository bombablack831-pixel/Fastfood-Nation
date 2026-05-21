import React from 'react';
import { motion } from 'framer-motion';

const Shimmer = () => (
  <motion.div
    initial={{ x: '-150%' }}
    animate={{ x: '150%' }}
    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -skew-x-12"
  />
);

export const RestaurantSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-xl flex flex-col h-full relative">
      <div className="h-64 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="p-8 space-y-4">
        <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-xl w-3/4 relative overflow-hidden"><Shimmer /></div>
        <div className="space-y-2">
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-lg w-full relative overflow-hidden"><Shimmer /></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-lg w-5/6 relative overflow-hidden"><Shimmer /></div>
        </div>
        <div className="pt-4 flex gap-4">
            <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded-lg w-20 relative overflow-hidden"><Shimmer /></div>
            <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded-lg w-20 relative overflow-hidden"><Shimmer /></div>
        </div>
      </div>
    </div>
);

export const FoodSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col h-full relative">
      <div className="h-56 bg-slate-100 dark:bg-slate-700 rounded-[2rem] mb-6 relative overflow-hidden">
        <Shimmer />
      </div>
      <div className="space-y-4 flex-grow">
        <div className="h-7 bg-slate-100 dark:bg-slate-700 rounded-xl w-2/3 relative overflow-hidden"><Shimmer /></div>
        <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-lg w-full relative overflow-hidden"><Shimmer /></div>
        <div className="pt-6 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
            <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-xl w-20 relative overflow-hidden"><Shimmer /></div>
            <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded-[2rem] w-32 relative overflow-hidden"><Shimmer /></div>
        </div>
      </div>
    </div>
);

export const OrderSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1 flex gap-5">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl relative overflow-hidden"><Shimmer /></div>
            <div className="space-y-2 flex-grow">
                <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded-lg w-1/2 relative overflow-hidden"><Shimmer /></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-md w-1/3 relative overflow-hidden"><Shimmer /></div>
            </div>
        </div>
        <div className="w-full md:w-auto flex flex-col items-end gap-4">
            <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-xl w-24 relative overflow-hidden"><Shimmer /></div>
            <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded-xl w-32 relative overflow-hidden"><Shimmer /></div>
        </div>
      </div>
    </div>
);
