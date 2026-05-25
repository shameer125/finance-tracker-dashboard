import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Utensils, 
  Car, 
  Receipt, 
  ShoppingBag, 
  Landmark, 
  TrendingUp as GainIcon,
  HelpCircle,
  Download,
  Filter,
  Trash2
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const categoryIcons = {
  Food: Utensils,
  Travel: Car,
  Bills: Receipt,
  Shopping: ShoppingBag,
  Salary: Landmark,
  Investments: GainIcon,
};

const categoryColors = {
  Food: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  Travel: 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
  Bills: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
  Shopping: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  Salary: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  Investments: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
};

const filterTabs = ['All', 'Food', 'Travel', 'Bills', 'Shopping', 'Income'];

export default function Transactions() {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeFilter === 'Income') {
      matchesTab = tx.type === 'income';
    } else if (activeFilter !== 'All') {
      matchesTab = tx.category === activeFilter;
    }

    return matchesSearch && matchesTab;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Category', 'Wallet', 'Amount', 'Type', 'Status'];
    const csvRows = [headers.join(',')];

    transactions.forEach(t => {
      csvRows.push([t.id, t.date, `"${t.title.replace(/"/g, '""')}"`, t.category, t.wallet, t.amount, t.type, t.status].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Transaction History</h2>
          <p className="text-xs text-slate-400">Detailed list of all records and money moves</p>
        </div>
        
        <button 
          onClick={handleDownloadCSV}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/40 dark:bg-slate-950/20 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 backdrop-blur-md">
        
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 px-3 py-2 rounded-2xl w-full md:w-72 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search details, merchant..." 
            className="bg-transparent text-xs w-full focus:outline-none border-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block mr-1" />
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveFilter(tab);
                setCurrentPage(1);
              }}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium whitespace-nowrap cursor-pointer transition-all ${
                activeFilter === tab 
                  ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <th className="py-4.5 px-6">Description</th>
                <th className="py-4.5 px-6">Category</th>
                <th className="py-4.5 px-6">Date</th>
                <th className="py-4.5 px-6">Wallet</th>
                <th className="py-4.5 px-6 text-right">Amount</th>
                <th className="py-4.5 px-6 text-center">Status</th>
                <th className="py-4.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
              <AnimatePresence mode="popLayout">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-slate-400 font-medium">
                      No transactions match your filters.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((tx) => {
                    const IconComponent = categoryIcons[tx.category] || HelpCircle;
                    const styleClass = categoryColors[tx.category] || 'bg-slate-100 text-slate-600';
                    const isIncome = tx.type === 'income';

                    return (
                      <motion.tr 
                        key={tx.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors group"
                      >
                        {/* Title and Icon */}
                        <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl shrink-0 ${styleClass}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className="truncate max-w-[140px] sm:max-w-[200px]">{tx.title}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-medium">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${styleClass}`}>
                            {tx.category}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6 text-slate-400 font-medium">{tx.date}</td>

                        {/* Wallet */}
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-medium capitalize">
                          {tx.wallet}
                        </td>

                        {/* Amount */}
                        <td className={`py-4 px-6 text-right font-bold text-sm ${
                          isIncome ? 'text-emerald-500' : 'text-slate-800 dark:text-white'
                        }`}>
                          {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                            {tx.status}
                          </span>
                        </td>

                        {/* Delete Action button */}
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 cursor-pointer opacity-40 group-hover:opacity-100 transition-all"
                            title="Delete Transaction & Reverse Balance"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50/30 dark:bg-slate-950/10 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Page {currentPage} of {totalPages} ({filteredTransactions.length} results)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-500 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-500 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
