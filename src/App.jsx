import React, { useState, useEffect } from 'react';
import Transactions from './components/Transactions';
import Statistics from './components/Statistics';
import Export from './components/Export';
import Settings from './components/Settings';
import Goals from './components/Goals';
import Preloader from './components/Preloader';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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

  // Animation variants for the FAB
  const fabVariants = {
    initial: { scale: 0, y: 20 },
    animate: { 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.3
      }
    },
    tap: { scale: 0.95 }
  };

  // Animation variants for nav items
  const navItemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  // Content transition variants
  const contentVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Handle add button click from any page
  const handleAddClick = () => {
    setActiveTab('transactions'); // First switch to transactions tab
    setShowAddModal(true); // Then open the add modal
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
            <main className="pb-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'transactions' && (
                    <motion.div
                      key="transactions"
                      variants={contentVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Transactions showAddModal={showAddModal} setShowAddModal={setShowAddModal} />
                    </motion.div>
                  )}
                  {activeTab === 'statistics' && (
                    <motion.div
                      key="statistics"
                      variants={contentVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Statistics />
                    </motion.div>
                  )}
                  {activeTab === 'export' && (
                    <motion.div
                      key="export"
                      variants={contentVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Export />
                    </motion.div>
                  )}
                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      variants={contentVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Settings />
                    </motion.div>
                  )}
                  {activeTab === 'goals' && (
                    <motion.div
                      key="goals"
                      variants={contentVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Goals />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>

            {/* Desktop Navigation */}
            <motion.nav
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-lg hidden sm:block"
            >
              <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex justify-around items-center h-16">
                  {[
                    {
                      id: 'transactions',
                      label: 'Transaksi',
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 9H16M8 12H16M8 15H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      )
                    },
                    {
                      id: 'statistics',
                      label: 'Statistik',
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 13V17M12 9V17M16 5V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      )
                    },
                    {
                      id: 'goals',
                      label: 'Goals',
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M12 4V2M12 22V20M4 12H2M22 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      )
                    },
                    {
                      id: 'export',
                      label: 'Export',
                      icon: (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 12L12 16M12 16L16 12M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )
                    }
                  ].map((item, i) => (
                    <motion.button
                      key={item.id}
                      custom={i}
                      variants={navItemVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex flex-col items-center justify-center relative ${
                        activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      <motion.div
                        animate={{
                          scale: activeTab === item.id ? 1.1 : 1,
                          y: activeTab === item.id ? -2 : 0
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative"
                      >
                        {item.icon}
                        {activeTab === item.id && (
                          <motion.div
                            layoutId="activeTabDesktop"
                            className="absolute -inset-2 bg-blue-100 rounded-lg -z-10"
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          />
                        )}
                      </motion.div>
                      <motion.span
                        animate={{
                          scale: activeTab === item.id ? 1.05 : 1,
                          color: activeTab === item.id ? "#2563EB" : "#6B7280"
                        }}
                        transition={{ duration: 0.2 }}
                        className="text-xs mt-1 font-medium"
                      >
                        {item.label}
                      </motion.span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.nav>

            {/* Mobile Navigation */}
            <motion.nav
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-lg sm:hidden"
            >
              <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex justify-between items-center py-2">
                  {/* Transaksi */}
                  <motion.button
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    custom={0}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('transactions')}
                    className="flex flex-col items-center justify-center w-16 py-1"
                  >
                    <div className={`w-6 h-6 mb-1 ${activeTab === 'transactions' ? 'text-blue-500' : 'text-gray-400'}`}>
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M7 9H17M7 13H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className={`text-[10px] font-medium ${activeTab === 'transactions' ? 'text-blue-500' : 'text-gray-500'}`}>
                      Transaksi
                    </span>
                  </motion.button>

                  {/* Statistik */}
                  <motion.button
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    custom={1}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('statistics')}
                    className="flex flex-col items-center justify-center w-16 py-1"
                  >
                    <div className={`w-6 h-6 mb-1 ${activeTab === 'statistics' ? 'text-blue-500' : 'text-gray-400'}`}>
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 13V17M12 9V17M16 5V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <span className={`text-[10px] font-medium ${activeTab === 'statistics' ? 'text-blue-500' : 'text-gray-500'}`}>
                      Statistik
                    </span>
                  </motion.button>

                  {/* Add Transaction Button */}
                  <motion.button
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    custom={2}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddClick}
                    className="flex flex-col items-center justify-center -mt-8 w-16"
                  >
                    <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg mb-1">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium text-blue-500">
                      Tambah
                    </span>
                  </motion.button>

                  {/* Goals */}
                  <motion.button
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    custom={3}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('goals')}
                    className="flex flex-col items-center justify-center w-16 py-1"
                  >
                    <div className={`w-6 h-6 mb-1 ${activeTab === 'goals' ? 'text-blue-500' : 'text-gray-400'}`}>
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12 4V2M12 22V20M4 12H2M22 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className={`text-[10px] font-medium ${activeTab === 'goals' ? 'text-blue-500' : 'text-gray-500'}`}>
                      Goals
                    </span>
                  </motion.button>

                  {/* Export */}
                  <motion.button
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    custom={4}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('export')}
                    className="flex flex-col items-center justify-center w-16 py-1"
                  >
                    <div className={`w-6 h-6 mb-1 ${activeTab === 'export' ? 'text-blue-500' : 'text-gray-400'}`}>
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 7L12 17M12 17L16 13M12 17L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <span className={`text-[10px] font-medium ${activeTab === 'export' ? 'text-blue-500' : 'text-gray-500'}`}>
                      Export
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.nav>

            {/* Add Transaction Button - Only visible on transactions tab and when modal is closed */}
            {activeTab === 'transactions' && !showAddModal && (
              <>
                {/* Desktop Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowAddModal(true)}
                  className="fixed right-6 bottom-24 z-50 hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: showAddModal ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.div>
                  <span className="font-medium">Tambah Transaksi</span>
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App; 