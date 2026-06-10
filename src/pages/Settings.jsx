import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Wallet, Save, Moon, Sun, Laptop } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function Settings() {
  const { theme, toggleTheme, showToast } = useFinance();
  const [profile, setProfile] = useState({
    name: 'Alex Mercer',
    email: 'alex.mercer@saas.com',
    phone: '+1 (555) 019-2834',
    currency: 'USD',
  });

  const [notifications, setNotifications] = useState({
    pushAlerts: true,
    weeklyReport: true,
    lowBalance: false,
    securityAlerts: true,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showToast('Profile configuration updated successfully!', 'success');
  };

  const toggleNotification = (key) => {
    setNotifications(prev => {
      const nextVal = !prev[key];
      showToast(`${key.replace(/([A-Z])/g, ' $1')} ${nextVal ? 'enabled' : 'disabled'}`, 'info');
      return { ...prev, [key]: nextVal };
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Account Settings</h2>
        <p className="text-xs text-slate-400">Configure your profile details and
          notifications settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Profile Card Form */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 
          dark:border-slate-800/80 pb-4">
            <User className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Profile Customization</h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Avatar Display */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                  alt="Avatar Upload" 
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/10 group-hover:ring-indigo-500/30 transition-all"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider text-center">Change</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Alex Mercer</h4>
                <p className="text-xs text-slate-400">Allowed formats: PNG, JPG. Max size 2MB</p>
              </div>
            </div>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Primary Currency</label>
                <select 
                  name="currency"
                  value={profile.currency}
                  onChange={handleProfileChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs rounded-xl active:scale-95 transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </form>
        </div>

        {/* Right Side: Preference cards & Switches */}
        <div className="space-y-6">
          
          {/* Theme Preferences */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Portal Theme</h3>
            </div>

            <p className="text-xs text-slate-400 mb-4">Choose your preferred display layout</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { if (theme === 'dark') toggleTheme(); }}
                className={`py-3 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  theme === 'light' 
                    ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500' 
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-500'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Light Theme</span>
              </button>

              <button
                onClick={() => { if (theme === 'light') toggleTheme(); }}
                className={`py-3 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' 
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-500'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Dark Theme</span>
              </button>
            </div>
          </div>

          {/* Toggle Switches Form */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <Bell className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Alert Preferences</h3>
            </div>

            <div className="space-y-4">
              
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Transaction Push Notifications</h4>
                  <p className="text-[9px] text-slate-400">Receive instant alerts for purchases</p>
                </div>
                
                <button
                  onClick={() => toggleNotification('pushAlerts')}
                  className={`w-10 h-5.5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                    notifications.pushAlerts ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <motion.div 
                    layout
                    className="w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                    animate={{ x: notifications.pushAlerts ? 18 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Weekly Spend Summary</h4>
                  <p className="text-[9px] text-slate-400">Email updates of weekly activities</p>
                </div>
                
                <button
                  onClick={() => toggleNotification('weeklyReport')}
                  className={`w-10 h-5.5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                    notifications.weeklyReport ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <motion.div 
                    layout
                    className="w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                    animate={{ x: notifications.weeklyReport ? 18 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Low Balance Warnings</h4>
                  <p className="text-[9px] text-slate-400">Alert me when checking falls below $200</p>
                </div>
                
                <button
                  onClick={() => toggleNotification('lowBalance')}
                  className={`w-10 h-5.5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                    notifications.lowBalance ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <motion.div 
                    layout
                    className="w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                    animate={{ x: notifications.lowBalance ? 18 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
