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

const AnimatedNumber = ({ value, isIncome }) => {
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
      className={`relative text-3xl font-bold ${
        isIncome === undefined 
          ? value >= 0 
            ? 'text-emerald-500' 
            : 'text-red-500'
          : isIncome 
            ? 'text-emerald-500' 
            : 'text-red-500'
      }`}
    >
      <span>
        Rp {Math.abs(value).toLocaleString()}
      </span>
    </motion.div>
  );
};

function Transactions({ showAddModal, setShowAddModal }) {
  const [startDate, setStartDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('daily');
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

  // Add Indonesian locale
  const indonesianLocale = {
    months: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    weekdays: [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu"
    ],
    weekdaysShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
  };

  // Helper function to format date to Indonesian format
  const formatToIndonesian = (date) => {
    const day = date.getDate();
    const month = indonesianLocale.months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

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
    
    // Close the modal first
    setShowAddModal(false);
    
    // Reset form
    resetForm();
    
    // Show success animation
    setShowSuccess(true);
    
    // Hide success animation after 2 seconds (reduced from 3s for better UX)
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
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

  // Filter transactions based on selected date and view
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        if (view === 'daily') {
          return (
            transactionDate.getDate() === startDate.getDate() &&
            transactionDate.getMonth() === startDate.getMonth() &&
            transactionDate.getFullYear() === startDate.getFullYear()
          );
        } else {
          return (
            transactionDate.getMonth() === startDate.getMonth() &&
            transactionDate.getFullYear() === startDate.getFullYear()
          );
        }
      })
      .filter(transaction => {
        if (!searchQuery) return true;
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

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dateStr = formatToIndonesian(date);
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(transaction);
    });

    return groups;
  }, [filteredTransactions]);

  const periodTitle = useMemo(() => {
    if (view === 'daily') {
      return 'Transaksi Bulan Ini';
    } else {
      return 'Transaksi Tahun Ini';
    }
  }, [view]);

  // Function to check if a date has transactions
  const hasTransactions = (date) => {
    return transactions.some(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getDate() === date.getDate() &&
        transactionDate.getMonth() === date.getMonth() &&
        transactionDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Function to get transaction total for a date
  const getTransactionTotal = (date) => {
    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getDate() === date.getDate() &&
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((total, transaction) => {
        return transaction.type === 'income' 
          ? total + transaction.amount 
          : total - transaction.amount;
      }, 0);
  };

  // Custom day component for DatePicker
  const CustomDay = ({ date, dayOfMonth, ...props }) => {
    const hasTransactionsOnDay = hasTransactions(date);
    const total = getTransactionTotal(date);
    
    return (
      <div
        className={`relative w-8 h-8 flex items-center justify-center ${
          props.selected 
            ? 'bg-blue-500 text-white rounded-full' 
            : hasTransactionsOnDay 
              ? 'bg-blue-50 rounded-full' 
              : ''
        }`}
        {...props}
      >
        {dayOfMonth}
        {hasTransactionsOnDay && (
          <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
            total >= 0 ? 'bg-emerald-500' : 'bg-red-500'
          }`} />
        )}
      </div>
    );
  };

  // Custom header for DatePicker with Indonesian month names
  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className="flex items-center justify-between px-2 py-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>
      <h3 className="text-base font-semibold text-gray-800">
        {`${indonesianLocale.months[date.getMonth()]} ${date.getFullYear()}`}
      </h3>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white/80 p-4 sm:p-6 md:p-8">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="absolute inset-0 bg-white/50 rounded-[2rem] backdrop-blur-xl transform rotate-6 scale-90 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 sm:p-4 rounded-[2rem] shadow-lg transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transaksi</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{formattedPeriod}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 sm:space-y-6 mb-8">
          {/* View Toggle and Date Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="inline-flex bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-1 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white/50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('daily')}
                className={`flex-1 px-4 sm:px-8 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  view === 'daily'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:bg-white/80'
                }`}
              >
                Harian
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('monthly')}
                className={`flex-1 px-4 sm:px-8 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  view === 'monthly'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:bg-white/80'
                }`}
              >
                Bulanan
              </motion.button>
            </div>

            {/* DatePicker */}
            <div className="relative group w-full sm:w-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="d MMMM yyyy"
                locale="id"
                renderCustomHeader={CustomHeader}
                renderDayContents={(dayOfMonth, date) => (
                  <CustomDay date={date} dayOfMonth={dayOfMonth} />
                )}
                showPopperArrow={false}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                calendarClassName="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                dayClassName={() => "hover:bg-blue-50 rounded-full"}
                monthClassName={() => "mt-2"}
                weekDayClassName={() => "text-gray-400 font-medium text-center py-2"}
                formatWeekDay={day => indonesianLocale.weekdaysShort[new Date(day).getDay()]}
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-12 py-3 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-white/50 text-sm"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Income Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-100/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-500/0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-emerald-500 transform group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">Pendapatan</h3>
                </div>
                <AnimatedNumber value={totals.income} isIncome={true} />
              </div>
            </motion.div>

            {/* Expense Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-red-100/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-500/0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-red-500 transform group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">Pengeluaran</h3>
                </div>
                <AnimatedNumber value={totals.expense} isIncome={false} />
              </div>
            </motion.div>

            {/* Total Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-blue-100/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-blue-500 transform group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">Total</h3>
                </div>
                <AnimatedNumber value={totals.total} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Transaction List Container - Add padding bottom for FAB */}
        <div className="pb-24">
          {/* Transaction List */}
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              Object.entries(groupedTransactions).map(([date, transactions]) => (
                <div key={date} className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-grow bg-gradient-to-r from-gray-200/0 via-gray-200 to-gray-200/0"></div>
                    <div className="px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-gray-100">
                      <p className="text-sm font-medium text-gray-600">{date}</p>
                    </div>
                    <div className="h-px flex-grow bg-gradient-to-r from-gray-200/0 via-gray-200 to-gray-200/0"></div>
                  </div>

                  {/* Transactions */}
                  <div className="space-y-3">
                    {transactions.map(transaction => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ 
                          duration: 0.2,
                          ease: "easeOut"
                        }}
                        className="group relative bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-100/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative p-4">
                          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center ${
                                transaction.type === 'income' 
                                  ? 'text-emerald-500'
                                  : 'text-red-500'
                              }`}>
                                <div className="w-6 h-6">
                                  {getCategoryIcon(transaction.category)}
                                </div>
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                  {transaction.category}
                                </h3>
                                {transaction.notes && (
                                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                    {transaction.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              <p className={`text-base font-semibold whitespace-nowrap ${
                                transaction.type === 'income' 
                                  ? 'text-emerald-500' 
                                  : 'text-red-500'
                              }`}>
                                Rp {transaction.amount.toLocaleString()}
                              </p>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(transaction.id)}
                                  className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTransaction(transaction);
                                    setShowPreviewModal(true);
                                  }}
                                  className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 px-4"
              >
                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Transaksi</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Tambahkan transaksi pertama Anda untuk mulai melacak keuangan dengan lebih baik
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Add Transaction Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ 
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 0.2,
                    ease: "easeOut"
                  }
                }}
                exit={{ 
                  scale: 0.95,
                  y: 20,
                  opacity: 0,
                  transition: {
                    duration: 0.15
                  }
                }}
                style={{ willChange: 'transform' }}
                className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50 mt-4 sm:mt-8 mb-20"
              >
                {/* Mobile Header */}
                <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">Tambah Transaksi</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddModal(false)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Desktop Header */}
                <div className="hidden sm:flex items-center justify-between px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-100">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Tambah Transaksi</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddModal(false)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-10 space-y-4 sm:space-y-8">
                  {/* Transaction Type - Mobile */}
                  <div className="sm:hidden">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Jenis Transaksi</label>
                    <div className="flex rounded-xl bg-gray-50 p-1">
                      <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          type === 'income'
                            ? 'bg-white text-emerald-500 shadow'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Pendapatan
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          type === 'expense'
                            ? 'bg-white text-red-500 shadow'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Pengeluaran
                      </button>
                    </div>
                  </div>

                  {/* Transaction Type - Desktop */}
                  <div className="hidden sm:block space-y-2 sm:space-y-3">
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

                  {/* Amount */}
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-medium text-gray-700">Jumlah</label>
                    <div className="relative">
                      <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">Rp</span>
                      <input
                        type="text"
                        value={amount ? formatNumber(amount) : ''}
                        onChange={handleAmountChange}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-medium text-gray-700">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
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

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-medium text-gray-700">Tanggal</label>
                    <DatePicker
                      selected={date}
                      onChange={(date) => setDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm sm:text-base font-medium text-gray-700">Catatan (Opsional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base h-20 sm:h-32 resize-none"
                      placeholder="Tambahkan catatan..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 ${
                      type === 'income'
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    Simpan
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ 
                  scale: 1,
                  transition: {
                    duration: 0.2,
                    ease: "easeOut"
                  }
                }}
                exit={{ 
                  scale: 0.9,
                  opacity: 0,
                  transition: {
                    duration: 0.15
                  }
                }}
                style={{ willChange: 'transform' }}
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
                  initial={{ opacity: 0, y: 10 }}
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
                className="bg-white/80 backdrop-blur-xl rounded-3xl w-full max-w-sm relative overflow-hidden border border-white/50"
              >
                {/* Header */}
                <motion.div 
                  className="flex items-center justify-between p-4 border-b border-gray-100/50"
                >
                  <h2 className="text-lg font-semibold text-gray-800">Hapus Transaksi</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeleteConfirm({ show: false, id: null })}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </motion.div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                        delay: 0.2
                      }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">Konfirmasi Hapus</h3>
                      <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100/50 space-x-3 flex">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteConfirm({ show: false, id: null })}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDelete}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm hover:from-red-600 hover:to-red-700 transition-all"
                  >
                    Hapus
                  </motion.button>
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
                  initial={{ opacity: 0, y: 10 }}
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
                className="bg-white/80 backdrop-blur-xl rounded-3xl w-full max-w-sm relative overflow-hidden border border-white/50"
              >
                {/* Header with Close Button */}
                <motion.div 
                  className="flex items-center justify-between p-4 border-b border-gray-100/50"
                >
                  <h2 className="text-lg font-semibold text-gray-800">Detail Transaksi</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPreviewModal(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </motion.div>

                {/* Content */}
                <div className="p-4 space-y-6">
                  {/* Category and Type */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        selectedTransaction.type === 'income' 
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                          : 'bg-gradient-to-br from-red-400 to-red-600 text-white'
                      }`}
                    >
                      <div className="w-6 h-6">
                        {getCategoryIcon(selectedTransaction.category)}
                      </div>
                    </motion.div>
                    <div>
                      <motion.h3 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg font-semibold text-gray-800"
                      >
                        {selectedTransaction.category}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`text-sm font-medium ${
                          selectedTransaction.type === 'income' 
                            ? 'text-emerald-500'
                            : 'text-red-500'
                        }`}
                      >
                        {selectedTransaction.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                      </motion.p>
                    </div>
                  </div>

                  {/* Amount */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30"
                  >
                    <p className="text-sm text-gray-500 mb-1">Jumlah</p>
                    <p className={`text-2xl font-bold ${
                      selectedTransaction.type === 'income' 
                        ? 'text-emerald-500'
                        : 'text-red-500'
                    }`}>
                      Rp {selectedTransaction.amount.toLocaleString()}
                    </p>
                  </motion.div>

                  {/* Date */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-sm text-gray-500 mb-1">Tanggal</p>
                    <p className="text-base font-medium text-gray-800">
                      {new Date(selectedTransaction.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </motion.div>

                  {/* Notes */}
                  {selectedTransaction.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <p className="text-sm text-gray-500 mb-1">Catatan</p>
                      <p className="text-base text-gray-800 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                        {selectedTransaction.notes}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100/50 space-x-3 flex">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPreviewModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors"
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
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm hover:from-red-600 hover:to-red-700 transition-all"
                  >
                    Hapus
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Transactions; 