import React, { useState, useEffect } from 'react';
import Transactions from './components/Transactions';
import Statistics from './components/Statistics';
import Export from './components/Export';
import Preloader from './components/Preloader';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [isLoading, setIsLoading] = useState(true);

  const mainVariants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onLoadingComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="main"
            variants={mainVariants}
            initial="initial"
            animate="animate"
            className="min-h-screen bg-gray-50"
          >
            {/* Main Content */}
            <main className="pb-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'transactions' && (
                    <motion.div
                      key="transactions"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Transactions />
                    </motion.div>
                  )}
                  {activeTab === 'statistics' && (
                    <motion.div
                      key="statistics"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Statistics />
                    </motion.div>
                  )}
                  {activeTab === 'export' && (
                    <motion.div
                      key="export"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Export />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>

            {/* Bottom Navigation */}
            <motion.nav
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg"
            >
              <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex justify-around">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('transactions')}
                    className={`flex flex-col items-center p-4 transition-colors duration-200 ${
                      activeTab === 'transactions' ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${activeTab === 'transactions' ? 'bg-blue-50' : ''}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        />
                        <path 
                          d="M8 9H16M8 12H16M8 15H13" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-xs mt-1 font-medium">Transaksi</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('statistics')}
                    className={`flex flex-col items-center p-4 transition-colors duration-200 ${
                      activeTab === 'statistics' ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${activeTab === 'statistics' ? 'bg-blue-50' : ''}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M8 13V17M12 9V17M16 5V17" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <span className="text-xs mt-1 font-medium">Statistik</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('export')}
                    className={`flex flex-col items-center p-4 transition-colors duration-200 ${
                      activeTab === 'export' ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${activeTab === 'export' ? 'bg-blue-50' : ''}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path 
                          d="M8 12L12 16M12 16L16 12M12 16V8" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-xs mt-1 font-medium">Export</span>
                  </motion.button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App; 