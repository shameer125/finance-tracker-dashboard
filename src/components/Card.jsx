import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AnimatedCounter = ({ value, duration = 800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = parseFloat(value);
    
    // Safety check if value is invalid or 0
    if (isNaN(endValue)) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * endValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(count)}
    </span>
  );
};

export default function Card({ title, value, icon: Icon, trend, trendType, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      glow: 'card-glow-indigo',
      iconBg: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20',
    },
    emerald: {
      glow: 'card-glow-emerald',
      iconBg: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20',
    },
    rose: {
      glow: 'card-glow-rose',
      iconBg: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20',
    },
    blue: {
      glow: 'card-glow-blue',
      iconBg: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
    }
  };

  const selectedColor = colorMap[color] || colorMap.indigo;

  return (
    <div className={`glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col 
    justify-between min-h-[140px]`}>
      {/* Light glow pattern inside cards */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 rounded-full 
      blur-xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}</span>
        <div className={`p-2.5 rounded-2xl ${selectedColor.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
          <AnimatedCounter value={value} />
        </h3>
        
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`inline-flex items-center p-0.5 rounded-md text-xs font-semibold ${
              trendType === 'positive' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
            }`}>
              {trendType === 'positive' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
