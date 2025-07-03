import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useLocalStorage from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';

const categories = {
  income: [
    'Gaji',
    'Bonus',
    'Investasi',
    'Penjualan',
    'Hadiah',
    'Lainnya'
  ],
  expense: [
    'Makanan & Minuman',
    'Transportasi',
    'Belanja',
    'Tagihan',
    'Hiburan',
    'Kesehatan',
    'Pendidikan',
    'Lainnya'
  ]
};

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

const formatNumber = (num) => {
  // Remove non-digit characters
  const number = num.toString().replace(/[^\d]/g, '');
  // Format with thousand separator
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const unformatNumber = (str) => {
  // Remove all non-digit characters
  return str.replace(/[^\d]/g, '');
};

function Transactions() {
  const [startDate, setStartDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('daily');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState('income');
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date(),
    type: 'income',
    asset: 'cash',
    category: '',
    amount: '',
    note: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [view, setView] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const unformattedValue = unformatNumber(value);
    // Only update if it's empty or a valid number
    if (unformattedValue === '' || /^\d+$/.test(unformattedValue)) {
      setAmount(unformattedValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      date: date.toISOString(),
      type,
      category,
      amount: parseFloat(unformatNumber(amount)),
      notes
    };
    setTransactions([...transactions, newTransaction]);
    setShowModal(false);
    resetForm();
    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resetForm = () => {
    setDate(new Date());
    setType('expense');
    setCategory('');
    setAmount('');
    setNotes('');
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = () => {
    setTransactions(transactions.filter(t => t.id !== deleteConfirm.id));
    setDeleteConfirm({ show: false, id: null });
    // Show delete success animation
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 2000);
  };

  const formattedPeriod = useMemo(() => {
    const options = { month: 'long', year: 'numeric' };
    const monthOptions = { month: 'long' };
    const yearOptions = { year: 'numeric' };
    
    if (view === 'daily') {
      return startDate.toLocaleDateString('id-ID', options);
    } else {
      return startDate.toLocaleDateString('id-ID', yearOptions);
    }
  }, [startDate, view]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        if (view === 'daily') {
          return (
            transactionDate.getMonth() === startDate.getMonth() &&
            transactionDate.getFullYear() === startDate.getFullYear()
          );
        } else {
          return transactionDate.getFullYear() === startDate.getFullYear();
        }
      })
      .filter(transaction => {
        const searchLower = searchQuery.toLowerCase();
        return (
          transaction.category.toLowerCase().includes(searchLower) ||
          (transaction.notes && transaction.notes.toLowerCase().includes(searchLower)) ||
          transaction.amount.toString().includes(searchLower)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, view, startDate, searchQuery]);

  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, total: income - expense };
  }, [filteredTransactions]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      let dateStr;
      
      if (view === 'daily') {
        dateStr = date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } else {
        dateStr = date.toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric'
        });
      }

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(transaction);
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return groups;
  }, [filteredTransactions, view]);

  const periodTitle = useMemo(() => {
    if (view === 'daily') {
      return 'Transaksi Bulan Ini';
    } else {
      return 'Transaksi Tahun Ini';
    }
  }, [view]);

  return (
    <div className="p-2 sm:p-4 md:p-8 relative min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-indigo-100/20 to-transparent" />
      <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_top_right,_var(--tw-gradient-stops))] from-blue-50/20 via-indigo-50/10 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-transparent via-white/50 to-transparent" />
      
      {/* Main Container */}
      <div className="relative rounded-[1.5rem] border border-white/30 shadow-lg bg-white/80 p-3 sm:p-4 md:p-8 overflow-hidden">
        {/* Header Section */}
        <div className="relative mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              {/* Logo */}
              <div className="relative group">
                <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3 md:p-5 rounded-xl sm:rounded-2xl shadow-lg transform transition-all duration-500 group-hover:scale-105">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transform transition duration-500">
                    <path 
                      d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z" 
                      stroke="white" 
                      strokeWidth="2"
                      className="drop-shadow-lg"
                    />
                    <path 
                      d="M8 9H16M8 12H16M8 15H13" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                      className="drop-shadow-lg"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient tracking-tight">
                  Ngaturin
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide mt-0.5 sm:mt-1">{formattedPeriod}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Container */}
        <div className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-3 sm:p-4 md:p-8 border border-white/50">
          {/* View Toggle */}
          <div className="flex items-center justify-center mb-4 sm:mb-6 md:mb-8">
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-1.5 md:p-2 inline-flex shadow-inner w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('daily')}
                className={`flex-1 sm:flex-none text-sm sm:text-base px-3 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-md sm:rounded-lg md:rounded-xl font-medium transition-all duration-300 ${
                  view === 'daily'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/80'
                }`}
              >
                Harian
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('monthly')}
                className={`flex-1 sm:flex-none text-sm sm:text-base px-3 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-md sm:rounded-lg md:rounded-xl font-medium transition-all duration-300 ${
                  view === 'monthly'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/80'
                }`}
              >
                Bulanan
              </motion.button>
            </div>
          </div>

          {/* Period Navigation */}
          <div className="flex items-center justify-between px-1 sm:px-2 md:px-4 mb-4 sm:mb-6 md:mb-8">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newDate = new Date(startDate);
                if (view === 'daily') {
                  newDate.setMonth(newDate.getMonth() - 1);
                } else {
                  newDate.setFullYear(newDate.getFullYear() - 1);
                }
                setStartDate(newDate);
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-white/80 text-gray-400 hover:text-blue-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl bg-white/60 backdrop-blur-xl border border-white/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
              {periodTitle}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newDate = new Date(startDate);
                if (view === 'daily') {
                  newDate.setMonth(newDate.getMonth() + 1);
                } else {
                  newDate.setFullYear(newDate.getFullYear() + 1);
                }
                setStartDate(newDate);
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-white/80 text-gray-400 hover:text-blue-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl bg-white/60 backdrop-blur-xl border border-white/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 pl-12 sm:pl-14 md:pl-16 bg-white/60 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl text-sm sm:text-base md:text-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/50"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-400 absolute left-4 sm:left-5 md:left-6 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-10">
          {/* Income Card */}
          <motion.div
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-6 md:p-8 border border-white/50 transition-all duration-500 group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-600">Pendapatan</h3>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-500 tracking-tight">
              Rp {totals.income.toLocaleString()}
            </p>
          </motion.div>

          {/* Expense Card */}
          <motion.div
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-6 md:p-8 border border-white/50 transition-all duration-500 group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-600">Pengeluaran</h3>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-500 tracking-tight">
              Rp {totals.expense.toLocaleString()}
            </p>
          </motion.div>

          {/* Total Card */}
          <motion.div
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl p-4 sm:p-6 md:p-8 border border-white/50 transition-all duration-500 group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-600">Total</h3>
            </div>
            <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${totals.total >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              Rp {totals.total.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Transaction List Container with Sticky FAB */}
        <div className="relative">
          <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-20">
            {Object.keys(groupedTransactions).length > 0 ? (
              Object.entries(groupedTransactions).map(([date, transactions]) => (
                <div key={date} className="space-y-3 sm:space-y-4 md:space-y-6">
                  {/* Date Header */}
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                    <div className="hidden sm:block h-[1px] flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                    <div className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-xl shadow-lg border border-white/50 text-center">
                      <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-600">{date}</h3>
                    </div>
                    <div className="hidden sm:block h-[1px] flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  </div>

                  {/* Transaction Items */}
                  {transactions.map(transaction => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      className="backdrop-blur-xl bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 md:p-6 border border-white/50 transition-all duration-500"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg ${
                            transaction.type === 'income' 
                              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                              : 'bg-gradient-to-br from-red-400 to-red-600'
                          }`}>
                            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white drop-shadow-lg">
                              {getCategoryIcon(transaction.category)}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-0.5 sm:mb-1">{transaction.category}</h3>
                            <p className="text-xs sm:text-sm text-gray-500">{transaction.notes}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end">
                          <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0 sm:mb-4 ${
                            transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            Rp {transaction.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(transaction.id)}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setShowPreviewModal(true);
                              }}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8"
              >
                {/* Empty state content with responsive updates */}
                <div className="relative mb-6 sm:mb-8 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-white/90 drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>

                {/* Empty state text with gradient */}
                <div className="text-center space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
                    Belum Ada Transaksi
                  </h3>
                  <p className="text-base sm:text-lg text-gray-500 max-w-md">
                    Tambahkan transaksi pertama Anda untuk mulai melacak keuangan dengan lebih baik
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Add Transaction Button - Always visible */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="fixed right-6 bottom-24 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-2xl flex items-center justify-center transform transition-all duration-300"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </motion.button>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }
                }}
                exit={{ 
                  scale: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.2
                  }
                }}
                className="relative"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.3
                    }
                  }}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-emerald-500/20 backdrop-blur-2xl flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        duration: 0.3
                      }
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl"
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-2xl"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: 1,
                        opacity: 1,
                        transition: {
                          delay: 0.3,
                          duration: 0.5,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.5,
                      duration: 0.3
                    }
                  }}
                  className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 w-max"
                >
                  <div className="bg-white/80 backdrop-blur-2xl px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-2xl border border-white/50">
                    <div className="flex flex-col items-center space-y-0.5 sm:space-y-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-800">
                        Transaksi Berhasil
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-500 font-medium">
                        Data telah tersimpan
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {deleteConfirm.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ 
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
                exit={{ 
                  scale: 0.9,
                  y: 20,
                  opacity: 0
                }}
                className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-10 border border-white/50"
              >
                <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-xl sm:rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 text-white transform group-hover:rotate-12 transition duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">Hapus Transaksi?</h3>
                    <p className="text-base sm:text-lg text-gray-500">Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.</p>
                  </div>
                  <div className="flex items-center space-x-4 w-full">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDeleteConfirm({ show: false, id: null })}
                      className="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
                    >
                      Batal
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmDelete}
                      className="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
                    >
                      Hapus
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Success Animation */}
        <AnimatePresence>
          {showDeleteSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }
                }}
                exit={{ 
                  scale: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.2
                  }
                }}
                className="relative"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.3
                    }
                  }}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-red-500/20 backdrop-blur-2xl flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        duration: 0.3
                      }
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-2xl"
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-2xl"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: 1,
                        opacity: 1,
                        transition: {
                          delay: 0.3,
                          duration: 0.5,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </motion.svg>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.5,
                      duration: 0.3
                    }
                  }}
                  className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 w-max"
                >
                  <div className="bg-white/80 backdrop-blur-2xl px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-2xl border border-white/50">
                    <div className="flex flex-col items-center space-y-0.5 sm:space-y-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-800">
                        Transaksi Terhapus
                      </h3>
                      <p className="text-xs sm:text-sm text-red-500 font-medium">
                        Data telah dihapus
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreviewModal && selectedTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-start justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ 
                  scale: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
                exit={{ 
                  scale: 0.9,
                  y: 50,
                  transition: {
                    duration: 0.2
                  }
                }}
                className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50 mt-4 sm:mt-8"
              >
                <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Detail Transaksi</h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPreviewModal(false)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 sm:p-10">
                  <div className="space-y-6 sm:space-y-8">
                    {/* Transaction Icon and Type */}
                    <div className="flex items-center space-x-4 sm:space-x-6">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl ${
                        selectedTransaction.type === 'income' 
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                          : 'bg-gradient-to-br from-red-400 to-red-600'
                      }`}>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg">
                          {getCategoryIcon(selectedTransaction.category)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{selectedTransaction.category}</h3>
                        <p className={`text-sm sm:text-base font-medium ${
                          selectedTransaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                          {selectedTransaction.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-white/50">
                      <p className="text-sm sm:text-base font-medium text-gray-500 mb-2">Jumlah</p>
                      <p className={`text-2xl sm:text-4xl font-bold ${
                        selectedTransaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        Rp {selectedTransaction.amount.toLocaleString()}
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm sm:text-base font-medium text-gray-500 mb-2">Tanggal</p>
                      <p className="text-base sm:text-xl font-medium text-gray-800">
                        {new Date(selectedTransaction.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Notes */}
                    {selectedTransaction.notes && (
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-500 mb-2">Catatan</p>
                        <p className="text-base sm:text-xl text-gray-800 bg-white/60 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-white/50">
                          {selectedTransaction.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 sm:mt-10 flex space-x-4 sm:space-x-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPreviewModal(false)}
                      className="flex-1 py-3 sm:py-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg sm:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl text-sm sm:text-lg"
                    >
                      Tutup
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowPreviewModal(false);
                        handleDelete(selectedTransaction.id);
                      }}
                      className="flex-1 py-3 sm:py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl text-sm sm:text-lg"
                    >
                      Hapus
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Transaction Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-start justify-center z-50 p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ 
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
                exit={{ 
                  scale: 0.9,
                  y: 50,
                  opacity: 0
                }}
                className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50 mt-4 sm:mt-8 mb-20"
              >
                <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Tambah Transaksi</h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowModal(false)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors duration-300"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 sm:h-6 sm:w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2.5} 
                          d="M12 4v16m8-8H4" 
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                  {/* Transaction Type */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-sm sm:text-base font-medium text-gray-700">Jenis Transaksi</label>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setType('income')}
                        className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-2 sm:space-y-3 ${
                          type === 'income'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                            : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-medium">Pendapatan</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setType('expense')}
                        className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex flex-col items-center space-y-2 sm:space-y-3 ${
                          type === 'expense'
                            ? 'border-red-500 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-200 hover:bg-red-50/50'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                        <span className="font-medium">Pengeluaran</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-sm sm:text-base font-medium text-gray-700">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {type === 'income'
                        ? categories.income.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))
                        : categories.expense.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-sm sm:text-base font-medium text-gray-700">Jumlah</label>
                    <div className="relative">
                      <span className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">Rp</span>
                      <input
                        type="text"
                        value={amount ? formatNumber(amount) : ''}
                        onChange={handleAmountChange}
                        className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-sm sm:text-base font-medium text-gray-700">Tanggal</label>
                    <DatePicker
                      selected={date}
                      onChange={(date) => setDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-sm sm:text-base font-medium text-gray-700">Catatan (Opsional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base h-24 sm:h-32 resize-none"
                      placeholder="Tambahkan catatan..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl text-white font-medium text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 ${
                      type === 'income'
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    Simpan Transaksi
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Transactions; 