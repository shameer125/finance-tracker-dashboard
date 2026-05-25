import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ArrowUpDown, 
  BarChart3, 
  Wallet, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', name: 'Transactions', icon: ArrowUpDown },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'wallets', name: 'Wallets', icon: Wallet },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useFinance();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col h-screen sticky top-0 glass-panel border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 z-30 shrink-0"
    >
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <TrendingUp className="w-5 h-5 text-white animate-pulse" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-extrabold bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent tracking-tight shrink-0"
            >
              FinSaaS
            </motion.span>
          )}
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl relative transition-all group overflow-hidden ${
                isActive 
                  ? 'text-indigo-600 dark:text-white font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
              }`}
            >
              {/* Highlight Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-50/80 to-violet-50/40 dark:from-indigo-950/40 dark:to-violet-950/20 border-l-4 border-indigo-600 dark:border-indigo-400 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <Icon className={`w-5 h-5 transition-transform duration-300 shrink-0 ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'group-hover:scale-110 text-slate-400 dark:text-slate-500'
              }`} />

              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm shrink-0"
                >
                  {item.name}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Account Profile Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/10 rounded-b-3xl">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
              alt="Profile" 
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">Alex Mercer</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">alex.mercer@saas.com</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
