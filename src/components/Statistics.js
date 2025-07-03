import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import useLocalStorage from '../hooks/useLocalStorage';
import { motion } from 'framer-motion';

function Statistics() {
  const [period, setPeriod] = useState('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeChart, setActiveChart] = useState('expense'); // 'expense' or 'income'
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

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (statistics.labels.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: statistics.labels,
          datasets: [
            {
              data: statistics.values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.9)',
                'rgba(54, 162, 235, 0.9)',
                'rgba(255, 206, 86, 0.9)',
                'rgba(75, 192, 192, 0.9)',
                'rgba(153, 102, 255, 0.9)',
                'rgba(255, 159, 64, 0.9)',
                'rgba(75, 192, 192, 0.9)',
                'rgba(255, 99, 132, 0.9)'
              ],
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
          cutout: '75%'
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [statistics]);

  const navigatePeriod = (direction) => {
    const newDate = new Date(currentDate);
    if (period === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (period === 'monthly') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (period === 'yearly') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const formatPeriodLabel = () => {
    const options = { month: 'long', year: 'numeric' };
    if (period === 'weekly') {
      return `Minggu ${Math.ceil(currentDate.getDate() / 7)}, ${currentDate.toLocaleDateString('id-ID', options)}`;
    } else if (period === 'monthly') {
      return currentDate.toLocaleDateString('id-ID', options);
    } else if (period === 'yearly') {
      return currentDate.getFullYear().toString();
    }
    return '';
  };

  const getCategoryIcon = (label) => {
    // Implement the logic to return the appropriate category icon based on the label
    // This is a placeholder and should be replaced with the actual implementation
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 relative min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-indigo-100/20 to-transparent" />
      <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_top_right,_var(--tw-gradient-stops))] from-blue-50/20 via-indigo-50/10 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-transparent via-white/50 to-transparent" />
      
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPeriod(p)}
                  className={`flex-1 sm:flex-none text-sm sm:text-base px-3 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-md sm:rounded-lg md:rounded-xl font-medium transition-all duration-300 ${
                    period === p
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/80'
                  }`}
                >
                  {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Period Navigation */}
          <div className="flex items-center justify-between px-1 sm:px-2 md:px-4">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigatePeriod('prev')}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-white/80 text-gray-400 hover:text-blue-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl bg-white/60 backdrop-blur-xl border border-white/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
              {formatPeriodLabel()}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigatePeriod('next')}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-white/80 text-gray-400 hover:text-blue-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl bg-white/60 backdrop-blur-xl border border-white/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-10">
          {/* Income Card */}
          <motion.button
            whileHover={{ scale: 1.02, translateY: -5 }}
            onClick={() => setActiveChart('income')}
            className={`backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-6 md:p-8 border border-white/50 transition-all duration-500 group ${
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
            whileHover={{ scale: 1.02, translateY: -5 }}
            onClick={() => setActiveChart('expense')}
            className={`backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-6 md:p-8 border border-white/50 transition-all duration-500 group ${
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
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg ${
                    activeChart === 'income' 
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                      : 'bg-gradient-to-br from-red-400 to-red-600'
                  }`}>
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
                  <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
                    activeChart === 'income' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {statistics.values[index]}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics; 