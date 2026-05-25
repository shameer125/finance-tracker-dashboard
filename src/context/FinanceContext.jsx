import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

const initialTransactions = [
  { id: 1, title: 'Salary Credit', amount: 5400.00, type: 'income', category: 'Salary', date: '2026-05-22', wallet: 'Chase Checking', status: 'Completed' },
  { id: 2, title: 'Whole Foods Groceries', amount: 184.50, type: 'expense', category: 'Food', date: '2026-05-21', wallet: 'Amex Gold', status: 'Completed' },
  { id: 3, title: 'Netflix Subscription', amount: 15.49, type: 'expense', category: 'Bills', date: '2026-05-20', wallet: 'Chase Checking', status: 'Completed' },
  { id: 4, title: 'Apple Store Purchase', amount: 1299.00, type: 'expense', category: 'Shopping', date: '2026-05-18', wallet: 'Amex Gold', status: 'Completed' },
  { id: 5, title: 'Chevron Gas Station', amount: 45.00, type: 'expense', category: 'Travel', date: '2026-05-17', wallet: 'Chase Checking', status: 'Completed' },
  { id: 6, title: 'Freelance Design Project', amount: 1250.00, type: 'income', category: 'Investments', date: '2026-05-15', wallet: 'Paypal Balance', status: 'Completed' },
  { id: 7, title: 'Starbucks Coffee', amount: 6.75, type: 'expense', category: 'Food', date: '2026-05-14', wallet: 'Amex Gold', status: 'Completed' },
  { id: 8, title: 'Electricity Bill', amount: 112.30, type: 'expense', category: 'Bills', date: '2026-05-12', wallet: 'Chase Checking', status: 'Completed' },
  { id: 9, title: 'Uber Rides', amount: 24.50, type: 'expense', category: 'Travel', date: '2026-05-10', wallet: 'Chase Checking', status: 'Completed' },
  { id: 10, title: 'Amazon Shopping', amount: 89.99, type: 'expense', category: 'Shopping', date: '2026-05-08', wallet: 'Amex Gold', status: 'Completed' },
  { id: 11, title: 'Gym Membership', amount: 60.00, type: 'expense', category: 'Bills', date: '2026-05-05', wallet: 'Chase Checking', status: 'Completed' },
  { id: 12, title: 'Dividends Pay', amount: 145.00, type: 'income', category: 'Investments', date: '2026-05-01', wallet: 'Fidelity Brokerage', status: 'Completed' },
];

const initialWallets = [
  { id: 'wallet-1', name: 'Chase Checking', type: 'Bank Account', balance: 8420.50, number: '•••• 4829', color: 'indigo', cardHolder: 'Alex Mercer' },
  { id: 'wallet-2', name: 'Amex Gold', type: 'Credit Card', balance: -1575.24, limit: 15000, number: '•••• 1004', color: 'amber', cardHolder: 'Alex Mercer' },
  { id: 'wallet-3', name: 'Paypal Balance', type: 'E-Wallet', balance: 1450.00, number: 'alex.m@saas.com', color: 'sky', cardHolder: 'Alex Mercer' },
  { id: 'wallet-4', name: 'Fidelity Brokerage', type: 'Investment', balance: 24900.00, number: '•••• 9982', color: 'emerald', cardHolder: 'Alex Mercer' },
];

const initialNotifications = [
  { id: 1, text: 'Your monthly spending analysis for April is ready.', time: '2 hours ago', read: false },
  { id: 2, text: 'Low balance alert on your Chase Checking account.', time: '1 day ago', read: true },
  { id: 3, text: 'Salary credit of $5,400.00 posted successfully.', time: '2 days ago', read: true },
];

const initialSavingsGoals = [
  { id: 'goal-1', name: 'Tesla Model Y', target: 55000, current: 15400, color: 'indigo' },
  { id: 'goal-2', name: 'Emergency Reserve', target: 10000, current: 6500, color: 'emerald' },
  { id: 'goal-3', name: 'Hawaii Holiday', target: 5000, current: 1200, color: 'sky' }
];

const initialBudgets = {
  Food: 600,
  Travel: 400,
  Bills: 500,
  Shopping: 1500,
  Investments: 2000,
  Salary: 10000,
};

export const FinanceProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('finance-dashboard-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [transactions, setTransactions] = useState(initialTransactions);
  const [wallets, setWallets] = useState(initialWallets);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [savingsGoals, setSavingsGoals] = useState(initialSavingsGoals);
  const [categoryBudgets, setCategoryBudgets] = useState(initialBudgets);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('finance-dashboard-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addTransaction = (t) => {
    const newTx = {
      id: Date.now(),
      ...t,
      status: 'Completed',
    };
    setTransactions(prev => [newTx, ...prev]);

    // Update wallet balance
    setWallets(prev => prev.map(w => {
      if (w.name === t.wallet) {
        const delta = t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount);
        return { ...w, balance: w.balance + delta };
      }
      return w;
    }));

    showToast(`Transaction "${t.title}" added successfully!`, 'success');
  };

  const deleteTransaction = (id) => {
    const targetTx = transactions.find(t => t.id === id);
    if (!targetTx) return;

    // Rollback wallet balance
    setWallets(prev => prev.map(w => {
      if (w.name === targetTx.wallet) {
        // If we delete an income, subtract balance. If we delete expense, add balance.
        const delta = targetTx.type === 'income' ? -parseFloat(targetTx.amount) : parseFloat(targetTx.amount);
        return { ...w, balance: w.balance + delta };
      }
      return w;
    }));

    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast(`Transaction "${targetTx.title}" deleted & balance reversed!`, 'error');
  };

  const addWallet = (w) => {
    const newWallet = {
      id: `wallet-${Date.now()}`,
      cardHolder: 'Alex Mercer',
      ...w,
      balance: parseFloat(w.balance),
    };
    setWallets(prev => [...prev, newWallet]);
    showToast(`Wallet "${w.name}" linked successfully!`, 'success');
  };

  const deleteWallet = (id) => {
    const targetW = wallets.find(w => w.id === id);
    if (!targetW) return;
    setWallets(prev => prev.filter(w => w.id !== id));
    // Orphan transactions remain but their wallet reference is kept
    showToast(`Wallet "${targetW.name}" removed`, 'info');
  };

  const transferFunds = (fromWalletName, toWalletName, amountVal) => {
    const amount = parseFloat(amountVal);
    if (isNaN(amount) || amount <= 0) return;

    let success = false;
    setWallets(prev => {
      const fromWallet = prev.find(w => w.name === fromWalletName);
      const toWallet = prev.find(w => w.name === toWalletName);

      if (!fromWallet || !toWallet) {
        showToast('Invalid wallets selected for transfer', 'error');
        return prev;
      }

      success = true;
      return prev.map(w => {
        if (w.name === fromWalletName) {
          return { ...w, balance: w.balance - amount };
        }
        if (w.name === toWalletName) {
          return { ...w, balance: w.balance + amount };
        }
        return w;
      });
    });

    if (success) {
      // Add two visual ledger transactions (one outgoing, one incoming)
      const date = new Date().toISOString().split('T')[0];
      const txId = Date.now();
      
      const outgoingTx = {
        id: txId,
        title: `Transfer to ${toWalletName}`,
        amount: amount,
        type: 'expense',
        category: 'Bills',
        date: date,
        wallet: fromWalletName,
        status: 'Completed'
      };

      const incomingTx = {
        id: txId + 1,
        title: `Transfer from ${fromWalletName}`,
        amount: amount,
        type: 'income',
        category: 'Salary',
        date: date,
        wallet: toWalletName,
        status: 'Completed'
      };

      setTransactions(prev => [outgoingTx, incomingTx, ...prev]);
      showToast(`Transferred $${amount} from ${fromWalletName} to ${toWalletName}`, 'success');
    }
  };

  const addSavingsGoal = (g) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      current: 0,
      ...g,
      target: parseFloat(g.target)
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    showToast(`Savings target "${g.name}" created!`, 'success');
  };

  const deleteSavingsGoal = (id) => {
    const targetG = savingsGoals.find(g => g.id === id);
    if (!targetG) return;
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
    showToast(`Savings goal "${targetG.name}" deleted`, 'info');
  };

  const addFundsToGoal = (id, amountVal, walletName) => {
    const amount = parseFloat(amountVal);
    if (isNaN(amount) || amount <= 0) return false;

    let goalName = '';
    let goalCompleted = false;

    setSavingsGoals(prev => prev.map(g => {
      if (g.id === id) {
        goalName = g.name;
        const nextBal = g.current + amount;
        if (nextBal >= g.target) {
          goalCompleted = true;
        }
        return { ...g, current: nextBal };
      }
      return g;
    }));

    // Deduct from wallet balance
    setWallets(prev => prev.map(w => {
      if (w.name === walletName) {
        return { ...w, balance: w.balance - amount };
      }
      return w;
    }));

    // Log as a transaction
    addTransaction({
      title: `Saved for ${goalName}`,
      amount: amount,
      type: 'expense',
      category: 'Shopping', // count it under shopping/transfer for simplicity
      wallet: walletName,
      date: new Date().toISOString().split('T')[0]
    });

    showToast(`Allocated $${amount} to "${goalName}"!`, 'success');
    return goalCompleted; // lets visual components know to fire special effects
  };

  const updateBudget = (category, amount) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [category]: parseFloat(amount)
    }));
    showToast(`Budget for ${category} updated to $${amount}`, 'success');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared', 'info');
  };

  // Derive stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);

  const savings = totalIncome > totalExpenses ? totalIncome - totalExpenses : 0;

  return (
    <FinanceContext.Provider value={{
      activeTab,
      setActiveTab,
      theme,
      toggleTheme,
      transactions,
      wallets,
      notifications,
      savingsGoals,
      categoryBudgets,
      toasts,
      showToast,
      removeToast,
      addTransaction,
      deleteTransaction,
      addWallet,
      deleteWallet,
      transferFunds,
      addSavingsGoal,
      deleteSavingsGoal,
      addFundsToGoal,
      updateBudget,
      markNotificationAsRead,
      clearNotifications,
      totalIncome,
      totalExpenses,
      totalBalance,
      savings,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
