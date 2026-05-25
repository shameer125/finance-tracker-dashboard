import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } }
};

export default function ToastContainer() {
  const { toasts, removeToast } = useFinance();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          let Icon = Info;
          let colorClass = 'border-blue-500/30 bg-blue-50/90 text-blue-900 dark:bg-blue-950/90 dark:text-blue-200';
          let iconColor = 'text-blue-500';

          if (toast.type === 'success') {
            Icon = CheckCircle;
            colorClass = 'border-emerald-500/30 bg-emerald-50/90 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-200';
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            colorClass = 'border-rose-500/30 bg-rose-50/90 text-rose-900 dark:bg-rose-950/90 dark:text-rose-200';
            iconColor = 'text-rose-500';
          }

          return (
            <motion.div
              key={toast.id}
              layout
              variants={toastVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border backdrop-blur-xl shadow-lg ${colorClass}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 opacity-70" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
