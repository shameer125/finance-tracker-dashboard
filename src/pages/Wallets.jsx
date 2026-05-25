import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Landmark, TrendingUp, CreditCard, ArrowRightLeft } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import WalletCard from '../components/WalletCard';
import confetti from 'canvas-confetti';

const colors = [
  { id: 'indigo', name: 'Indigo Purple' },
  { id: 'amber', name: 'Amber Gold' },
  { id: 'sky', name: 'Sky Blue' },
  { id: 'emerald', name: 'Emerald Mint' }
];

export default function Wallets() {
  const { wallets, addWallet, deleteWallet, transferFunds } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  // Derive wallet stats
  const totalAssets = wallets
    .filter(w => w.balance > 0)
    .reduce((acc, curr) => acc + curr.balance, 0);

  const totalDebts = Math.abs(
    wallets
      .filter(w => w.balance < 0)
      .reduce((acc, curr) => acc + curr.balance, 0)
  );

  const netWealth = totalAssets - totalDebts;

  const handleCreateWallet = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    const type = data.get('type');
    const balance = data.get('balance');
    const number = data.get('number');
    const color = data.get('color');

    if (!name || !balance || !number) return;

    addWallet({
      name,
      type,
      balance,
      number,
      color,
    });

    setModalOpen(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6']
    });
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const fromWallet = data.get('fromWallet');
    const toWallet = data.get('toWallet');
    const amount = data.get('amount');

    if (!fromWallet || !toWallet || !amount || fromWallet === toWallet) return;

    transferFunds(fromWallet, toWallet, amount);
    setTransferModalOpen(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6"
    >
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Linked Wallets</h2>
          <p className="text-xs text-slate-400">Manage your cards, brokerages, and savings accounts</p>
        </div>
        
        <div className="flex gap-2">
          {wallets.length >= 2 && (
            <button 
              onClick={() => setTransferModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Transfer Funds
            </button>
          )}

          <button 
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs rounded-xl active:scale-95 transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Wallet
          </button>
        </div>
      </div>

      {/* Asset and Debt Balance Headers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Net Wealth */}
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between border-l-4 border-indigo-500">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Net Financial Worth</span>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(netWealth)}
            </h3>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Assets */}
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between border-l-4 border-emerald-500">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Asset Reserves</span>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAssets)}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <Landmark className="w-5 h-5" />
          </div>
        </div>

        {/* Total Debts */}
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between border-l-4 border-rose-500">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Credit Liabilities</span>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDebts)}
            </h3>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Wallets Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <WalletCard 
            key={wallet.id}
            id={wallet.id}
            name={wallet.name}
            type={wallet.type}
            balance={wallet.balance}
            number={wallet.number}
            color={wallet.color}
            cardHolder={wallet.cardHolder}
            onDelete={() => deleteWallet(wallet.id)}
          />
        ))}

        {/* Link Wallet Card Button */}
        <div 
          onClick={() => setModalOpen(true)}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 rounded-[28px] aspect-[1.58/1] flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer bg-slate-50/50 dark:bg-slate-900/10 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/5 transition-all group"
        >
          <div className="p-4 rounded-full border border-dashed border-slate-200 dark:border-slate-800 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all">
            <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-sm font-bold tracking-tight mt-3">Link New Account</span>
          <span className="text-[10px] text-slate-400 mt-1">Supports bank connections, credit lines</span>
        </div>
      </div>

      {/* ADD WALLET MODAL DIALOG */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] max-w-md mx-auto z-50 glass-card bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">Link Financial Wallet</h3>
                  <p className="text-xs text-slate-400">Configure connection details for mock sync</p>
                </div>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWallet} className="space-y-4 mt-5">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Account/Card Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="e.g. Chase Freedom, Fidelity Active"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Wallet Type</label>
                    <select 
                      name="type"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                    >
                      <option value="Bank Account">Bank Account</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="E-Wallet">E-Wallet</option>
                      <option value="Investment">Investment</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Starting Balance ($)</label>
                    <input 
                      type="number"
                      step="0.01"
                      name="balance"
                      required
                      placeholder="e.g. 5000.00"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Number/Identifier</label>
                    <input 
                      type="text" 
                      name="number"
                      required
                      placeholder="e.g. •••• 1234 or email"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                  />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Color Theme</label>
                    <select 
                      name="color"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                    >
                      {colors.map(col => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all mt-4 cursor-pointer"
                >
                  Link Account
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* TRANSFER FUNDS MODAL DIALOG */}
      <AnimatePresence>
        {transferModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setTransferModalOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[15%] max-w-sm mx-auto z-50 glass-card bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Transfer Balances</h3>
                  <p className="text-xs text-slate-400">Inter-wallet transfer logging</p>
                </div>
                <button 
                  onClick={() => setTransferModalOpen(false)}
                  className="p-1 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">From Wallet</label>
                  <select 
                    name="fromWallet"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                  >
                    {wallets.map(w => (
                      <option key={w.id} value={w.name}>{w.name} (${w.balance.toFixed(2)})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">To Wallet</label>
                  <select 
                    name="toWallet"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                  >
                    {wallets.map(w => (
                      <option key={w.id} value={w.name}>{w.name} (${w.balance.toFixed(2)})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Transfer Amount ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    placeholder="0.00"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all mt-4 cursor-pointer"
                >
                  Approve Transfer
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
