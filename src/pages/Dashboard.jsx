import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  PlusCircle,
  Utensils,
  Car,
  Receipt,
  ShoppingBag,
  Landmark,
  ArrowRight,
  TrendingUp as GainIcon,
  ChevronRight,
  Plus,
  Coins,
  X
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import confetti from 'canvas-confetti';

const categoryIcons = {
  Food: Utensils,
  Travel: Car,
  Bills: Receipt,
  Shopping: ShoppingBag,
  Salary: Landmark,
  Investments: GainIcon,
};

const categoryColors = {
  Food: '#c084fc',      // purple
  Travel: '#38bdf8',    // sky
  Bills: '#fb7185',     // rose
  Shopping: '#fbbf24',  // amber
  Salary: '#34d399',    // emerald
  Investments: '#818cf8' // indigo
};

const PIE_COLORS = ['#818cf8', '#34d399', '#fb7185', '#fbbf24', '#c084fc', '#38bdf8'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
};

export default function Dashboard() {
  const { 
    transactions, 
    wallets,
    theme,
    setActiveTab,
    addTransaction,
    savingsGoals,
    addFundsToGoal,
    addSavingsGoal
  } = useFinance();

  const [timeRange, setTimeRange] = useState('ALL'); // 7D, 30D, ALL
  const [selectedGoal, setSelectedGoal] = useState(null); // Goal object for Funding modal
  const [newGoalModal, setNewGoalModal] = useState(false); // add goal modal

  // 1. Dynamic Filtering by timeRange
  const getFilteredTransactions = () => {
    // Current simulated date anchor: 2026-05-23
    const anchorDate = new Date('2026-05-23');
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const diffTime = Math.abs(anchorDate - tDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (timeRange === '7D') return diffDays <= 7;
      if (timeRange === '30D') return diffDays <= 30;
      return true; // ALL
    });
  };

  const filteredTxList = getFilteredTransactions();

  // Dynamic Aggregations
  const dynamicIncome = filteredTxList
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const dynamicExpenses = filteredTxList
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);
  const dynamicSavings = dynamicIncome > dynamicExpenses ? dynamicIncome - dynamicExpenses : 0;

  // 2. Generate Dynamic Chart Data based on timeRange
  const getDynamicChartData = () => {
    if (timeRange === '7D') {
      // Group by date for last 7 days (May 17 to May 23)
      const days = ['2026-05-17', '2026-05-18', '2026-05-19', '2026-05-20', '2026-05-21', '2026-05-22', '2026-05-23'];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      return days.map((day, idx) => {
        const dayTxs = transactions.filter(t => t.date === day);
        const inc = dayTxs.filter(t => t.type === 'income').reduce((s, c) => s + c.amount, 0);
        const exp = dayTxs.filter(t => t.type === 'expense').reduce((s, c) => s + c.amount, 0);
        return { label: dayNames[idx], Income: inc, Expense: exp };
      });
    }

    if (timeRange === '30D') {
      // Group by 4 blocks of weeks
      const weeks = [
        { label: 'Week 1', start: '2026-04-24', end: '2026-04-30' },
        { label: 'Week 2', start: '2026-05-01', end: '2026-05-07' },
        { label: 'Week 3', start: '2026-05-08', end: '2026-05-14' },
        { label: 'Week 4', start: '2026-05-15', end: '2026-05-23' },
      ];

      return weeks.map(w => {
        const start = new Date(w.start);
        const end = new Date(w.end);
        const wTxs = transactions.filter(t => {
          const d = new Date(t.date);
          return d >= start && d <= end;
        });
        const inc = wTxs.filter(t => t.type === 'income').reduce((s, c) => s + c.amount, 0);
        const exp = wTxs.filter(t => t.type === 'expense').reduce((s, c) => s + c.amount, 0);
        return { label: w.label, Income: inc, Expense: exp };
      });
    }

    // Default: Group by Month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const monthMap = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05' };
    
    return months.map(m => {
      // For mock chart, combine existing transaction aggregate + dummy foundation
      const mCode = monthMap[m];
      const mTxs = transactions.filter(t => t.date.startsWith(`2026-${mCode}`));
      const inc = mTxs.filter(t => t.type === 'income').reduce((s, c) => s + c.amount, 0);
      const exp = mTxs.filter(t => t.type === 'expense').reduce((s, c) => s + c.amount, 0);

      // Base curves
      const baseMap = {
        Jan: { inc: 4000, exp: 2400 },
        Feb: { inc: 4500, exp: 2800 },
        Mar: { inc: 5000, exp: 3100 },
        Apr: { inc: 4800, exp: 2900 },
        May: { inc: 0, exp: 0 } // May handles dynamic
      };
      
      return { 
        label: m, 
        Income: baseMap[m].inc + inc, 
        Expense: baseMap[m].exp + exp 
      };
    });
  };

  const chartData = getDynamicChartData();

  // Category Breakdown for the donut plot
  const categorySummary = filteredTxList.reduce((acc, curr) => {
    if (curr.type === 'expense') {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    }
    return acc;
  }, {});

  const pieData = Object.keys(categorySummary).map((key, index) => ({
    name: key,
    value: parseFloat(categorySummary[key].toFixed(2)),
    color: PIE_COLORS[index % PIE_COLORS.length]
  }));

  const recentTransactions = transactions.slice(0, 5);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 
        text-xs shadow-xl bg-white/95 dark:bg-slate-950/95">
          <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
          {payload.map((pld, index) => (
            <p key={index} className="font-semibold" style={{ color: pld.stroke || pld.fill }}>
              {pld.name}: ${pld.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleQuickTxSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const title = data.get('title');
    const amount = parseFloat(data.get('amount'));
    const type = data.get('type');
    const category = data.get('category');
    const wallet = data.get('wallet');

    if (!title || !amount || isNaN(amount) || amount <= 0) return;

    addTransaction({
      title,
      amount,
      type,
      category,
      wallet,
      date: new Date().toISOString().split('T')[0]
    });

    e.target.reset();
  };

  const handleFundGoalSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const amount = parseFloat(data.get('amount'));
    const wallet = data.get('wallet');

    if (isNaN(amount) || amount <= 0 || !selectedGoal) return;

    const completed = addFundsToGoal(selectedGoal.id, amount, wallet);
    setSelectedGoal(null);

    if (completed) {
      // Fire confetti explosion for completing the target saving goal
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981']
      });
    }
  };

  const handleCreateGoalSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    const target = parseFloat(data.get('target'));
    const color = data.get('color');

    if (!name || isNaN(target) || target <= 0) return;

    addSavingsGoal({ name, target, color });
    setNewGoalModal(false);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Dynamic Filter Tab bar */}
      <div className="flex items-center justify-between bg-white/40 dark:bg-slate-950/20 
      p-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-md">
        <span className="text-xs font-semibold text-slate-500 pl-3">Timeline Filter</span>
        <div className="flex gap-1.5">
          {['7D', '30D', 'ALL'].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`text-[10px] px-3.5 py-1.5 font-bold uppercase tracking-wider rounded-xl cursor-pointer 
                transition-all ${
                timeRange === r 
                  ? 'bg-indigo-500 text-white shadow shadow-indigo-500/20' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/40 hover:text-slate-800'
              }`}
            >
              {r === 'ALL' ? 'All Time' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic overview cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Balance" 
          value={totalBalance} 
          icon={Wallet} 
          trend="+5.4%" 
          trendType="positive"
          color="indigo"
        />
        <Card 
          title={`Income (${timeRange})`} 
          value={dynamicIncome} 
          icon={TrendingUp} 
          trend={timeRange === 'ALL' ? '+12.3%' : null}
          trendType="positive"
          color="emerald"
        />
        <Card 
          title={`Expenses (${timeRange})`} 
          value={dynamicExpenses} 
          icon={TrendingDown} 
          trend={timeRange === 'ALL' ? '+8.2%' : null}
          trendType="negative"
          color="rose"
        />
        <Card 
          title={`Net Savings (${timeRange})`} 
          value={dynamicSavings} 
          icon={PiggyBank} 
          trend={timeRange === 'ALL' ? '+22.1%' : null}
          trendType="positive"
          color="blue"
        />
      </motion.div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cash Flow Line Chart */}
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl lg:col-span-2 flex flex-col 
        justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Cash Flow Trend</h3>
              <p className="text-xs text-slate-400">Aggregated inflow vs expense curves ({timeRange})</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-500">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Expense
              </span>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} vertical={false} />
                <XAxis 
                  dataKey="label" 
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
                <Area 
                  type="monotone" 
                  dataKey="Income" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Expense" 
                  stroke="#f43f5e" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expense Category Pie */}
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Expense Breakdown</h3>
            <p className="text-xs text-slate-400">Category split during period ({timeRange})</p>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            {pieData.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-10">No expense records found.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Spent']} />
                </PieChart>
              </ResponsiveContainer>
            )}
            {pieData.length > 0 && (
              <div className="absolute text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Total Spent</span>
                <span className="block text-xl font-extrabold text-slate-800 dark:text-white">
                  ${dynamicExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {pieData.slice(0, 4).map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate capitalize">{entry.name}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 ml-auto">${entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 3: Recent Activity & Savings Goals tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions List */}
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Recent Transactions</h3>
              <p className="text-xs text-slate-400">Your latest money activities</p>
            </div>
            <button 
              onClick={() => setActiveTab('transactions')}
              className="text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {recentTransactions.map((tx) => {
              const IconComponent = categoryIcons[tx.category] || Utensils;
              const isIncome = tx.type === 'income';
              const colorTheme = categoryColors[tx.category] || '#6366f1';

              return (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${colorTheme}12`, color: colorTheme }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[260px]">
                        {tx.title}
                      </h4>
                      <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="capitalize">{tx.wallet}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-bold block ${
                      isIncome ? 'text-emerald-500' : 'text-slate-800 dark:text-white'
                    }`}>
                      {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-1">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Dynamic Savings Goals Tracker widget */}
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Savings Goals</h3>
              <p className="text-xs text-slate-400">Fund your dream milestones</p>
            </div>
            <button 
              onClick={() => setNewGoalModal(true)}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Create new Savings Goal"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 py-3 flex-1 overflow-y-auto max-h-60 mt-2 pr-1">
            {savingsGoals.map(goal => {
              const pct = Math.min((goal.current / goal.target) * 100, 100).toFixed(0);
              const colorHex = categoryColors[goal.color === 'emerald' ? 'Salary' : goal.color === 'indigo' ? 'Investments' : 'Travel'] || '#6366f1';
              
              return (
                <div key={goal.id} className="space-y-1.5 p-2.5 rounded-2xl hover:bg-slate-100/40 dark:hover:bg-slate-900/20 transition-all border border-transparent">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{goal.name}</span>
                    <button
                      onClick={() => setSelectedGoal(goal)}
                      className="text-[9px] font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-wider flex items-center gap-0.5"
                    >
                      Fund <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {/* Goal Progress bar */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: colorHex }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold">
                    <span>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                    <span>{pct}% target</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button 
              onClick={() => setActiveTab('wallets')}
              className="w-full text-center text-xs text-indigo-500 hover:text-indigo-600 font-semibold flex items-center justify-center gap-1 transition-all"
            >
              Configure Banking Ledgers
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Add Transaction Form (Bottom Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quick Add Transaction Form */}
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Quick Transaction Record</h3>
            <p className="text-xs text-slate-400">Instantly register a payment details</p>
          </div>

          <form onSubmit={handleQuickTxSubmit} className="space-y-3.5 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="e.g. Starbucks, Gas" 
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="amount"
                  required
                  placeholder="0.00" 
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Type</label>
                <select 
                  name="type"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
                <select 
                  name="category"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                >
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Bills">Bills</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Salary">Salary</option>
                  <option value="Investments">Investments</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Wallet Source</label>
                <select 
                  name="wallet"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                >
                  {wallets.map(w => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all mt-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Register Record
            </button>
          </form>
        </motion.div>

        {/* AI Recommendations panel */}
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl flex flex-col justify-between bg-indigo-500/5 border border-indigo-500/10 dark:border-indigo-500/20">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-indigo-200 text-base">FinSaaS AI Engine</h3>
            <p className="text-xs text-slate-400">Automated ledger warnings & tips</p>
          </div>

          <div className="space-y-3.5 my-4">
            <div className="flex gap-2 text-xs">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 h-8 self-start">⚡</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Savings goal progress:</strong> Your Emergency Reserve goal is {((savingsGoals.find(g => g.id === 'goal-2')?.current || 0) / (savingsGoals.find(g => g.id === 'goal-2')?.target || 10000) * 100).toFixed(0)}% completed. Fund $150 more to secure safety reserves!
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 h-8 self-start">⚠️</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Budget limit caution:</strong> Food spent is reaching 84% of your configured monthly threshold. We suggest eating at home for the next 4 days.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center uppercase tracking-wider font-bold">
            Refreshed 2 minutes ago
          </div>
        </motion.div>
      </div>

      {/* QUICK FUND MODAL DRAWER */}
      <AnimatePresence>
        {selectedGoal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGoal(null)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[20%] max-w-sm mx-auto z-50 glass-card bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Fund "{selectedGoal.name}"</h3>
                  <p className="text-xs text-slate-400">Allocate checking balance to goal targets</p>
                </div>
                <button 
                  onClick={() => setSelectedGoal(null)}
                  className="p-1 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleFundGoalSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Fund Amount ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    placeholder="0.00"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Withdrawal Ledger</label>
                  <select 
                    name="wallet"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                  >
                    {wallets.filter(w => w.balance > 0).map(w => (
                      <option key={w.id} value={w.name}>{w.name} (${w.balance.toFixed(2)})</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all mt-4 cursor-pointer"
                >
                  <Coins className="w-4 h-4" />
                  Approve Allocation
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CREATE GOAL MODAL */}
      <AnimatePresence>
        {newGoalModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewGoalModal(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[20%] max-w-sm mx-auto z-50 glass-card bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Add Savings Goal</h3>
                  <p className="text-xs text-slate-400">Establish a new target reserve</p>
                </div>
                <button 
                  onClick={() => setNewGoalModal(false)}
                  className="p-1 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoalSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Goal Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="e.g. Dream House, Yacht"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Target Amount ($)</label>
                    <input 
                      type="number"
                      step="1"
                      name="target"
                      required
                      placeholder="0.00"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Color Style</label>
                    <select 
                      name="color"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-950 transition-all"
                    >
                      <option value="indigo">Indigo Purple</option>
                      <option value="emerald">Emerald Mint</option>
                      <option value="sky">Sky Blue</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all mt-4 cursor-pointer"
                >
                  Create Goal Target
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
