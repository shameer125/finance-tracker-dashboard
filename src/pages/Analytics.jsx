import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Percent, 
  Zap,
  Target,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const monthlySpendData = [
  { month: 'Dec', amount: 1850 },
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 2800 },
  { month: 'Mar', amount: 3100 },
  { month: 'Apr', amount: 2900 },
  { month: 'May', amount: 3672 },
];

const colors = ['#818cf8', '#34d399', '#fb7185', '#fbbf24'];

export default function Analytics() {
  const { transactions, totalExpenses, totalIncome, theme, categoryBudgets, updateBudget } = useFinance();
  const [editingCat, setEditingCat] = useState(null); // String: category name being edited
  const [editBudgetAmount, setEditBudgetAmount] = useState('');

  // Calculate actual category breakdown
  const categorySummary = transactions.reduce((acc, curr) => {
    if (curr.type === 'expense') {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    }
    return acc;
  }, {});

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const avgDailySpend = expenseTransactions.length > 0 
    ? (totalExpenses / 30).toFixed(2) 
    : '0.00';
  
  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) 
    : '0';

  // Find category with highest spend
  let highestCategoryName = 'None';
  let highestCategoryAmount = 0;
  Object.keys(categorySummary).forEach(cat => {
    if (categorySummary[cat] > highestCategoryAmount) {
      highestCategoryAmount = categorySummary[cat];
      highestCategoryName = cat;
    }
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs bg-white/95 dark:bg-slate-950/95 shadow-md">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Spent: <span className="font-bold text-indigo-500">${payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const handleEditBudgetClick = (cat, currentLimit) => {
    setEditingCat(cat);
    setEditBudgetAmount(currentLimit.toString());
  };

  const handleSaveBudget = (cat) => {
    const val = parseFloat(editBudgetAmount);
    if (!isNaN(val) && val > 0) {
      updateBudget(cat, val);
      setEditingCat(null);
    }
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
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Financial Analytics</h2>
        <p className="text-xs text-slate-400">Deep dive insights and category budget trackings</p>
      </div>

      {/* Row 1: Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Spend Velocity */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex items-start gap-4">
          <div className="p-3 bg-violet-500/10 text-violet-500 rounded-2xl">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Average Daily Spend</span>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white">${avgDailySpend}</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">Computed over the last 30 active billing cycles.</p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <Percent className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Current Savings Rate</span>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white">{savingsRate}%</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">Percent of total salary earnings saved this period.</p>
          </div>
        </div>

        {/* Highest Outflow */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex items-start gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
            <Target className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Top Expense Category</span>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white capitalize">{highestCategoryName}</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">Accumulated total: ${highestCategoryAmount.toFixed(2)}</p>
          </div>
        </div>

      </div>

      {/* Row 2: Charts and Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Expenses Column Chart */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Monthly Expense Outflows</h3>
            <p className="text-xs text-slate-400">Comparison of total monthly outflows</p>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke={theme === 'dark' ? '#475569' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#475569' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {monthlySpendData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === monthlySpendData.length - 1 ? '#6366f1' : '#cbd5e1'} 
                      fillOpacity={index === monthlySpendData.length - 1 ? 0.95 : 0.4}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budgets configurator Progress list */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Active Budgets</h3>
            <p className="text-xs text-slate-400">Configure monthly targets (click Edit icon)</p>
          </div>

          <div className="space-y-5 flex-1 mt-4">
            {['Food', 'Travel', 'Bills', 'Shopping'].map((category, index) => {
              const limit = categoryBudgets[category] || 1000;
              const spent = categorySummary[category] || 0;
              const percent = Math.min((spent / limit) * 100, 100).toFixed(0);
              const color = colors[index % colors.length];
              const isEditing = editingCat === category;

              return (
                <div key={category} className="space-y-1.5 p-2 rounded-2xl hover:bg-slate-100/40 dark:hover:bg-slate-900/10 transition-all">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-300 capitalize flex items-center gap-1.5">
                      {category}
                      <button 
                        onClick={() => handleEditBudgetClick(category, limit)}
                        className="p-0.5 rounded text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </span>
                    
                    {!isEditing ? (
                      <span className="text-slate-400">
                        <strong className="text-slate-800 dark:text-white">${spent.toFixed(0)}</strong> / ${limit}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input 
                          type="number"
                          value={editBudgetAmount}
                          onChange={(e) => setEditBudgetAmount(e.target.value)}
                          className="w-14 text-[10px] px-1 py-0.5 border border-indigo-500 rounded bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none"
                        />
                        <button 
                          onClick={() => handleSaveBudget(category)}
                          className="p-0.5 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          <Check className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          onClick={() => setEditingCat(null)}
                          className="p-0.5 rounded bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${percent}%`, 
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}50` 
                      }} 
                    />
                  </div>
                  
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                    <span>{percent}% used</span>
                    {parseFloat(percent) >= 100 ? (
                      <span className="text-rose-500">Over Budget!</span>
                    ) : (
                      <span>${(limit - spent).toFixed(0)} remaining</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Insight banner */}
      <div className="glass-card p-6 rounded-3xl flex items-center gap-4 border border-indigo-500/10 dark:border-indigo-500/20 bg-indigo-500/5">
        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl shrink-0">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-indigo-200">SaaS AI Recommendation</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Your bills & food spending are running 12% lower than last month, but shopping outflow has ticked up due to the Apple Store charge. Adjusting your budgets will trigger warning signals when categories exceed critical thresholds.
          </p>
        </div>
      </div>

    </motion.div>
  );
}
