import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Landmark, Trash2 } from 'lucide-react';

const colorThemes = {
  indigo: 'from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-indigo-500/10',
  amber: 'from-amber-500 via-amber-600 to-orange-700 text-white shadow-amber-500/10',
  sky: 'from-sky-500 via-blue-600 to-indigo-700 text-white shadow-sky-500/10',
  emerald: 'from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-emerald-500/10'
};

const textThemes = {
  indigo: 'text-indigo-200',
  amber: 'text-amber-200',
  sky: 'text-sky-200',
  emerald: 'text-emerald-200'
};

export default function WalletCard({ id, name, type, balance, number, color = 'indigo', cardHolder, onDelete }) {
  const selectedTheme = colorThemes[color] || colorThemes.indigo;
  const secondaryText = textThemes[color] || textThemes.indigo;

  const formatBalance = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // prevent card click
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative w-full aspect-[1.58/1] rounded-[28px] bg-gradient-to-br ${selectedTheme} p-6 flex flex-col
      justify-between overflow-hidden shadow-2xl group cursor-pointer`}
    >
      {/* Visual background details */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_60%)]
      pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-125 
      transition-transform duration-700" />
      
      {/* Background Icon */}
      <div className="absolute right-6 top-6 opacity-10 group-hover:opacity-20 transition-opacity 
      duration-300 pointer-events-none">
        {type === 'Credit Card' ? (
          <CreditCard className="w-24 h-24 stroke-[1]" />
        ) : (
          <Landmark className="w-24 h-24 stroke-[1]" />
        )}
      </div>

      {/* Top Details */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className={`text-[10px] uppercase font-bold tracking-widest ${secondaryText}`}>
            {type}
          </span>
          <h4 className="text-lg font-bold tracking-tight mt-0.5">{name}</h4>
        </div>
        
        {/* Chip & Optional Delete button */}
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg bg-black/10 hover:bg-rose-600/30 border 
              border-white/10 hover:border-rose-500/20 text-white opacity-0 group-hover:opacity-100 transition-all active:scale-90"
              title="Delete Wallet"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="w-10 h-7 rounded-lg bg-amber-400/20 border border-amber-300/30 flex items-center justify-center overflow-hidden shrink-0 pointer-events-none">
            <div className="w-6 h-4 bg-amber-400/30 rounded border border-amber-300/40 relative">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-400/50" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-amber-400/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Balance */}
      <div className="my-auto py-2 relative z-10">
        <span className={`text-xs ${secondaryText} block font-medium`}>Available Balance</span>
        <span className="text-2xl font-bold tracking-tight block sm:text-3xl mt-0.5">
          {formatBalance(balance)}
        </span>
      </div>

      {/* Bottom details */}
      <div className="flex items-end justify-between relative z-10 border-t 
      border-white/10 pt-3">
        <div>
          <span className={`text-[8px] uppercase tracking-wider block ${secondaryText}`}>
            Card Holder
          </span>
          <span className="text-xs font-bold block mt-0.5">{cardHolder}</span>
        </div>
        <div>
          <span className={`text-[8px] uppercase tracking-wider block text-right ${secondaryText}`}>
            Account/Card Number
          </span>
          <span className="text-xs font-mono font-medium block mt-0.5 tracking-wider">{number}</span>
        </div>
      </div>
    </motion.div>
  );
}
