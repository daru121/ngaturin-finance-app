import React, { useState, useEffect, useRef, useMemo } from 'react';
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
      return true;
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

  // Define fixed colors for consistent use
  const COLORS = {
    blue: '#3B82F6',      // blue-500
    red: '#EF4444',       // red-500
    green: '#10B981',     // emerald-500
    orange: '#F97316',    // orange-500
    purple: '#8B5CF6',    // violet-500
    cyan: '#06B6D4',      // cyan-500
    yellow: '#F59E0B',    // amber-500
    pink: '#EC4899',      // pink-500
    gray: '#6B7280',      // gray-500
  };

  // Define category colors for income and expense
  const categoryColors = {
    // Income categories
    'Bonus': COLORS.blue,      // Menggunakan biru untuk Bonus
    'Gaji': COLORS.red,        // Menggunakan merah untuk Gaji
    'Investasi': COLORS.purple,
    'Penjualan': COLORS.yellow,
    'Hadiah': COLORS.pink,
    'Lainnya': COLORS.gray,
    
    // Expense categories
    'Makanan & Minuman': COLORS.red,
    'Transportasi': COLORS.orange,
    'Belanja': COLORS.purple,
    'Tagihan': COLORS.cyan,
    'Hiburan': COLORS.yellow,
    'Kesehatan': COLORS.green,
    'Pendidikan': COLORS.blue
  };

  // Get color for category
  const getCategoryColor = (category) => {
    return categoryColors[category] || COLORS.gray;
  };

  // Update chart when statistics change
  useEffect(() => {
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
              backgroundColor: statistics.labels.map((_, index) => getCategoryColor(statistics.labels[index])),
              borderWidth: 2,
              borderColor: '#fff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              animation: {
                duration: 100
              },
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const amount = statistics.amounts[context.dataIndex];
                  return [
                    `${value}%`,
                    `Rp ${amount.toLocaleString()}`
                  ];
                }
              }
            }
          },
          cutout: '75%',
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    }
  }, [statistics]);

  // Format period label
  const formatPeriodLabel = () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    if (period === 'weekly') {
      const weekNumber = Math.ceil(currentDate.getDate() / 7);
      return `Minggu ${weekNumber}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (period === 'monthly') {
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      return currentDate.getFullYear().toString();
    }
  };

  // Navigate between periods
  const navigatePeriod = (direction) => {
    const newDate = new Date(currentDate);
    if (period === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (period === 'monthly') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
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
  };

  // Update chart data with consistent colors
  const chartData = useMemo(() => {
    if (!statistics.labels.length || !chartRef.current) return null;

    const data = {
      labels: statistics.labels,
      datasets: [{
        data: statistics.values,
        backgroundColor: statistics.labels.map(category => getCategoryColor(category)),
        borderWidth: 0,
        hoverOffset: 4
      }]
    };

    return data;
  }, [statistics]);

  // Optimized chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        animation: {
          duration: 100
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      duration: 300,
      easing: 'easeOutQuart'
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    layout: {
      padding: 0
    }
  }), []);

  // Effect to update chart with optimized options
  useEffect(() => {
    if (!chartRef.current || !chartData) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartOptions]);

  const renderPeriodButtons = () => (
    <div className="inline-flex bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-1 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white/50">
      {['weekly', 'monthly', 'yearly'].map((p) => (
        <motion.button
          key={p}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.1 }}
          onClick={() => setPeriod(p)}
          className={`px-4 sm:px-8 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            period === p
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-gray-600 hover:bg-white/80'
          }`}
        >
          {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
        </motion.button>
      ))}
    </div>
  );

  const renderSummaryCard = (type) => {
    const isIncome = type === 'income';
    const amount = isIncome ? totals.income : totals.expense;
    const color = isIncome ? 'emerald' : 'red';

    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={() => setActiveChart(type)}
        style={{ willChange: 'transform' }}
        className={`group relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-${color}-100/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer ${
          activeChart === type ? `ring-2 ring-${color}-500 ring-offset-2` : ''
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-${color}-500/5 to-${color}-500/0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <div className="relative">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-${color}-500 transform group-hover:scale-110 transition-transform duration-500`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isIncome ? "M12 4v16m8-8H4" : "M20 12H4"} />
              </svg>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              {isIncome ? 'Total Pendapatan' : 'Total Pengeluaran'}
            </h3>
          </div>
          <div className={`relative text-3xl font-bold text-${color}-500`}>
            Rp {amount.toLocaleString()}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="absolute inset-0 bg-white/50 rounded-[2rem] backdrop-blur-xl transform rotate-6 scale-90 group-hover:rotate-12 transition-transform duration-300"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 sm:p-4 rounded-[2rem] shadow-lg transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Statistik</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Ringkasan keuangan Anda</p>
          </div>
        </div>
      </div>

      {/* Period Selection */}
      <div className="mb-6">
        {renderPeriodButtons()}
      </div>

      {/* Period Navigation */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          onClick={() => navigatePeriod('prev')}
          className="p-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-200 text-gray-600 hover:text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <h2 className="text-xl font-bold text-gray-800">
          {formatPeriodLabel()}
        </h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          onClick={() => navigatePeriod('next')}
          className="p-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-200 text-gray-600 hover:text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {renderSummaryCard('income')}
        {renderSummaryCard('expense')}
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          {activeChart === 'income' ? 'Distribusi Pendapatan' : 'Distribusi Pengeluaran'}
        </h3>
        <div className="relative h-64 mb-6">
          <canvas ref={chartRef} />
        </div>
        
        {/* Category List */}
        <div className="space-y-4">
          {statistics.labels.map((label, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.2,
                delay: index * 0.05
              }}
              style={{ willChange: 'transform' }}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center" style={{ color: getCategoryColor(label) }}>
                  <div className="w-6 h-6">
                    {getCategoryIcon(label)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                  <p className="text-sm" style={{ color: getCategoryColor(label) }}>
                    Rp {statistics.amounts[index].toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium" style={{ color: getCategoryColor(label) }}>
                {statistics.values[index]}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics; 