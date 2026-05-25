import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Check, 
  Trash2,
  LayoutDashboard,
  ArrowUpDown,
  BarChart3,
  Wallet,
  Settings,
  TrendingUp
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

const mobileMenuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', name: 'Transactions', icon: ArrowUpDown },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'wallets', name: 'Wallets', icon: Wallet },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export default function Topbar() {
  const { 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    notifications, 
    markNotificationAsRead, 
    clearNotifications 
  } = useFinance();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 w-full glass-panel border-0 border-b 
    border-slate-200/40 dark:border-slate-850/30 z-40 px-6 py-4 flex items-center justify-between">
      
      {/* Page Title & Breadcrumbs (desktop) or Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-xl border border-slate-200 
          dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:block">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Portal</span>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize leading-tight">
            {activeTab}
          </h1>
        </div>
      </div>

      {/* Global Search Bar (UI only) */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 px-3.5 py-2 rounded-2xl w-80 group focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search transaction, wallet, help..." 
          className="bg-transparent text-xs w-full focus:outline-none focus:ring-0 focus:box-shadow-none border-0 text-slate-700 dark:text-slate-200 placeholder-slate-400"
        />
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-medium text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm">
          ⌘K
        </kbd>
      </div>

      {/* Action Widgets */}
      <div className="flex items-center gap-4">
        
        {/* Light/Dark Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative text-slate-600 dark:text-slate-300 active:scale-95"
          title="Toggle Theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'light' ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Moon className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Sun className="w-5 h-5 text-amber-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative text-slate-600 dark:text-slate-300 active:scale-95 ${
              showNotifications ? 'bg-slate-100 dark:bg-slate-800' : ''
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notifications Dropdown Content */}
          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Click outside backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute right-0 mt-3 w-80 glass-card rounded-3xl shadow-xl z-20 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">Notifications</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearNotifications}
                        className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-4 border-b border-slate-50 dark:border-slate-800/30 flex justify-between gap-2 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors ${
                            !n.read ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                          }`}
                        >
                          <div className="space-y-1">
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                              {n.text}
                            </p>
                            <span className="text-[10px] text-slate-400 block">{n.time}</span>
                          </div>
                          {!n.read && (
                            <button
                              onClick={() => markNotificationAsRead(n.id)}
                              className="p-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 h-6 shrink-0 self-center"
                              title="Mark as Read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
            alt="Profile Avatar" 
            className="w-9 h-9 rounded-2xl object-cover ring-2 ring-indigo-500/10 hover:ring-indigo-500/30 transition-all cursor-pointer"
          />
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            {/* Mobile Drawer Panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-slate-950 z-50 p-6 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 md:hidden"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-800 dark:text-white">FinSaaS</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Links */}
                <nav className="mt-8 space-y-2">
                  {mobileMenuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left relative transition-all ${
                          isActive 
                            ? 'bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm">{item.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Profile Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">Alex Mercer</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">alex.mercer@saas.com</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
