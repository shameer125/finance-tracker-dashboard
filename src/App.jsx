import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ToastContainer from './components/Toast';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Wallets from './pages/Wallets';
import Settings from './pages/Settings';

function AppContent() {
  const { activeTab } = useFinance();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key="dashboard" />;
      case 'transactions':
        return <Transactions key="transactions" />;
      case 'analytics':
        return <Analytics key="analytics" />;
      case 'wallets':
        return <Wallets key="wallets" />;
      case 'settings':
        return <Settings key="settings" />;
      default:
        return <Dashboard key="dashboard" />;
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Ambient Glow Elements */}
      <div className="bg-ambient-glow -top-40 -left-40 bg-indigo-500" />
      <div className="bg-ambient-glow bottom-20 -right-20 bg-purple-500" />

      {/* Left Collapsible Panel */}
      <Sidebar />
      
      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 z-10 h-screen overflow-hidden">
        <Topbar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto pb-10">
            <AnimatePresence mode="wait">
              {renderActivePage()}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Floating Active Alerts Overlay */}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
