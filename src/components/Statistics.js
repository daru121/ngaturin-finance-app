import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Chart from 'chart.js/auto';
import useLocalStorage from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';

function Statistics() {
  const [period, setPeriod] = useState('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeChart, setActiveChart] = useState('expense');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [transactions] = useLocalStorage('transactions', []);

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      if (period === 'weekly') {
        const currentWeek = Math.ceil(currentDate.getDate() / 7);
        const transactionWeek = Math.ceil(transactionDate.getDate() / 7);
        return (
          transactionWeek === currentWeek &&
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        );
      } else if (period === 'monthly') {
        return (
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        );
      } else if (period === 'yearly') {
        return transactionDate.getFullYear() === currentDate.getFullYear();
      }
      return false;
    });
  }, [transactions, period, currentDate]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const typeTransactions = filteredTransactions.filter(t => t.type === activeChart);
    const total = typeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const categoryTotals = typeTransactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + parseFloat(amount);
      return acc;
    }, {});

    const categories = Object.keys(categoryTotals);
    const values = categories.map(category => {
      const percentage = (categoryTotals[category] / total) * 100;
      return Math.round(percentage);
    });

    return {
      labels: categories,
      values: values,
      amounts: categories.map(category => categoryTotals[category])
    };
  }, [filteredTransactions, activeChart]);

  // Calculate totals
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return { income, expense };
  }, [filteredTransactions]);

  // Define chart colors as constants
  const chartColors = {
    0: 'rgba(255, 99, 132, 0.9)',   // pink
    1: 'rgba(54, 162, 235, 0.9)',    // blue
    2: 'rgba(255, 206, 86, 0.9)',    // yellow
    3: 'rgba(75, 192, 192, 0.9)',    // teal
    4: 'rgba(153, 102, 255, 0.9)',   // purple
    5: 'rgba(255, 159, 64, 0.9)',    // orange
    6: 'rgba(75, 192, 192, 0.9)',    // teal
    7: 'rgba(255, 99, 132, 0.9)',    // pink
  };

  // Function to get solid version of chart color
  const getSolidColor = (index) => {
    const color = chartColors[index % Object.keys(chartColors).length];
    return color.replace(/, 0.9\)/, ', 1)');
  };

  // Memoize chart creation to prevent unnecessary re-renders
  const createChart = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (statistics.labels.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: statistics.labels,
          datasets: [
            {
              data: statistics.values,
              backgroundColor: Object.values(chartColors),
              borderWidth: 2,
              borderColor: '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          cutout: '75%',
          animation: {
            duration: 500
          }
        }
      });
    }
  }, [statistics]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      createChart();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [createChart]);

  const navigatePeriod = useCallback((direction) => {
    const newDate = new Date(currentDate);
    if (period === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (period === 'monthly') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (period === 'yearly') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  }, [currentDate, period]);

  const formatPeriodLabel = useCallback(() => {
    const options = { month: 'long', year: 'numeric' };
    if (period === 'weekly') {
      return `Minggu ${Math.ceil(currentDate.getDate() / 7)}, ${currentDate.toLocaleDateString('id-ID', options)}`;
    } else if (period === 'monthly') {
      return currentDate.toLocaleDateString('id-ID', options);
    } else if (period === 'yearly') {
      return currentDate.getFullYear().toString();
    }
    return '';
  }, [currentDate, period]);

  // Memoize category icons to prevent re-creation on every render
  const getCategoryIcon = useCallback((category) => {
    switch (category) {
      // Income icons
      case 'Gaji':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'Bonus':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'Investasi':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'Penjualan':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'Hadiah':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m8-12v24M4 12l8-8 8 8-8 8-8-8z" />
          </svg>
        );

      // Expense icons
      case 'Makanan & Minuman':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3zm0 4h18M7 7v10m4-10v10m4-10v10" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7v4a2 2 0 01-2 2h-2" />
          </svg>
        );
      case 'Transportasi':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4 4m0 0l4-4m-4 4V4" />
          </svg>
        );
      case 'Belanja':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'Tagihan':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'Hiburan':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'Kesehatan':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'Pendidikan':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      // Default icon for 'Lainnya' and any unmatched category
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
    }
  }, []);

  // Simplified motion variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 relative min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Background effects - simplified */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-indigo-100/20 to-transparent" />
      
      {/* Main Container */}
      <div className="relative rounded-[1.5rem] border border-white/30 shadow-lg bg-white/80 p-3 sm:p-4 md:p-8 overflow-hidden">
        {/* Controls Container */}
        <div className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-3 sm:p-4 md:p-8 border border-white/50 mb-6">
          {/* Period Selection */}
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-1.5 md:p-2 inline-flex shadow-inner w-full sm:w-auto">
              {['weekly', 'monthly', 'yearly'].map((p) => (
                <motion.button
                  key={p}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPeriod(p)}
                  className={`flex-1 sm:flex-none text-sm sm:text-base px-3 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-md sm:rounded-lg md:rounded-xl font-medium transition-colors duration-200 ${
                    period === p
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/80'
                  }`}
                >
                  {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Period Navigation - simplified animations */}
          <div className="flex items-center justify-between px-1 sm:px-2 md:px-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigatePeriod('prev')}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-white/80 text-gray-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center shadow-lg bg-white/60 backdrop-blur-xl border border-white/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
              {formatPeriodLabel()}
            </h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigatePeriod('next')}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-white/80 text-gray-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center shadow-lg bg-white/60 backdrop-blur-xl border border-white/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Summary Cards - simplified animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-10">
          {/* Income Card */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveChart('income')}
            className={`backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-white/50 transition-colors duration-200 ${
              activeChart === 'income' ? 'ring-2 ring-emerald-500/30 ring-offset-4 ring-offset-gray-50' : ''
            }`}
          >
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-600">Total Pendapatan</h3>
            </div>
            <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${
              activeChart === 'income' ? 'text-emerald-500' : 'text-gray-800'
            }`}>
              Rp {totals.income.toLocaleString()}
            </p>
          </motion.button>

          {/* Expense Card */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveChart('expense')}
            className={`backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-white/50 transition-colors duration-200 ${
              activeChart === 'expense' ? 'ring-2 ring-red-500/30 ring-offset-4 ring-offset-gray-50' : ''
            }`}
          >
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-600">Total Pengeluaran</h3>
            </div>
            <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${
              activeChart === 'expense' ? 'text-red-500' : 'text-gray-800'
            }`}>
              Rp {totals.expense.toLocaleString()}
            </p>
          </motion.button>
        </div>

        {/* Chart Container */}
        <div className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-white/50 mb-6 sm:mb-8 md:mb-10">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              Distribusi {activeChart === 'income' ? 'Pendapatan' : 'Pengeluaran'}
            </h3>
          </div>
          
          <div className="relative h-64 sm:h-80 md:h-96">
            {statistics.labels.length > 0 ? (
              <canvas ref={chartRef}></canvas>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full bg-gray-100/50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-lg sm:text-xl font-medium text-gray-500">
                    Belum ada data {activeChart === 'income' ? 'pendapatan' : 'pengeluaran'}
                  </p>
                  <p className="text-sm sm:text-base text-gray-400 mt-2">
                    pada periode ini
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category List */}
        <AnimatePresence>
          <div className="space-y-3 sm:space-y-4">
            {statistics.labels.map((label, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, translateY: -5 }}
                className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-6 md:p-8 border border-white/50 transition-all duration-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div 
                      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}
                      style={{ 
                        background: `linear-gradient(135deg, ${getSolidColor(index)} 0%, ${getSolidColor(index)} 100%)`
                      }}
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white">
                        {getCategoryIcon(label)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1">{label}</h3>
                      <p className="text-sm sm:text-base text-gray-500">
                        Rp {statistics.amounts[index].toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl sm:text-3xl md:text-4xl font-bold`} style={{ color: getSolidColor(index) }}>
                      {statistics.values[index]}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Wrap component with React.memo for additional optimization
export default React.memo(Statistics); 