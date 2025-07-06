import React, { useState, useEffect } from 'react';
import { FiTrash2, FiPlusCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const Goals = () => {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('financialGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    description: '',
    currentAmount: 0,
    deposits: [],
    isCompleted: false
  });
  const [newDeposit, setNewDeposit] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  useEffect(() => {
    localStorage.setItem('financialGoals', JSON.stringify(goals));
  }, [goals]);

  // Fungsi untuk memformat angka ke format rupiah dengan titik
  const formatRupiah = (angka) => {
    if (!angka) return '';
    // Hapus semua karakter selain angka
    const number = angka.toString().replace(/[^\d]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Fungsi untuk menghapus format rupiah (menghapus titik)
  const unformatRupiah = (angka) => {
    if (!angka) return '';
    return angka.toString().replace(/\./g, '');
  };

  const handleSaveGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount) {
      alert('Mohon isi judul dan target goals');
      return;
    }
    
    const targetAmountNumber = Number(unformatRupiah(newGoal.targetAmount));
    if (isNaN(targetAmountNumber) || targetAmountNumber <= 0) {
      alert('Mohon masukkan target amount yang valid');
      return;
    }

    setGoals([...goals, {
      ...newGoal,
      currentAmount: 0,
      deposits: [],
      targetAmount: targetAmountNumber
    }]);
    setNewGoal({
      title: '',
      targetAmount: '',
      description: '',
      currentAmount: 0,
      deposits: [],
      isCompleted: false
    });
    
    // Close the modal first
    setShowModal(false);
    
    // Show success animation
    setShowSuccess(true);
    
    // Hide success animation after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleOpenDepositModal = (index) => {
    setSelectedGoalIndex(index);
    setShowDepositModal(true);
  };

  const handleSaveDeposit = () => {
    const depositAmount = parseFloat(unformatRupiah(newDeposit.amount));
    if (!depositAmount || depositAmount <= 0) {
      alert('Mohon masukkan jumlah setoran yang valid');
      return;
    }

    const updatedGoals = [...goals];
    const goal = updatedGoals[selectedGoalIndex];
    
    if (!goal.deposits) {
      goal.deposits = [];
    }
    
    goal.deposits.push({
      ...newDeposit,
      amount: depositAmount
    });
    
    goal.currentAmount = goal.deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    
    setGoals(updatedGoals);
    setNewDeposit({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setShowDepositModal(false);
  };

  const calculateProgress = (current, target) => {
    return (current / parseFloat(target)) * 100;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Handler untuk input target amount
  const handleTargetAmountChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatRupiah(value);
    setNewGoal({ ...newGoal, targetAmount: formattedValue });
  };

  // Handler untuk input deposit amount
  const handleDepositAmountChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatRupiah(value);
    setNewDeposit({ ...newDeposit, amount: formattedValue });
  };

  const handleCompleteGoal = (index) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = {
      ...updatedGoals[index],
      isCompleted: true
    };
    setGoals(updatedGoals);
  };

  const isGoalAchieved = (goal) => {
    return goal.currentAmount >= goal.targetAmount;
  };

  const handleDeleteClick = (index) => {
    setSelectedGoalIndex(index);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const updatedGoals = goals.filter((_, i) => i !== selectedGoalIndex);
    setGoals(updatedGoals);
    setShowDeleteModal(false);
    setSelectedGoalIndex(null);
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 2000);
  };

  // Ubah fungsi handleDeleteGoal yang lama
  const handleDeleteButton = (index) => {
    handleDeleteClick(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white/80 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#4F46E5] p-2.5 sm:p-3 rounded-2xl">
            <RiMoneyDollarCircleLine className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Target Keuangan</h1>
            <p className="text-xs sm:text-sm text-gray-500">Wujudkan impian finansial Anda</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4F46E5] text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
        >
          <FiPlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Tambah Target</span>
        </motion.button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {goals.map((goal, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
              goal.isCompleted ? 'border-2 border-green-500' : ''
            }`}
          >
            <div className="p-4 sm:p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words">{goal.title}</h3>
                    {goal.isCompleted && (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                        Tercapai
                      </span>
                    )}
                  </div>
                  {goal.description && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">{goal.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteButton(index)}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500">Target</span>
                  <span className="font-semibold">Rp {Number(goal.targetAmount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500">Terkumpul</span>
                  <span className="font-semibold text-[#4F46E5]">Rp {Number(goal.currentAmount).toLocaleString('id-ID')}</span>
                </div>

                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        goal.isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-green-400'
                          : 'bg-gradient-to-r from-[#4F46E5] to-blue-400'
                      }`}
                    ></motion.div>
                  </div>
                  <p className="text-right text-xs text-gray-500 mt-1">
                    {calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(1)}%
                  </p>
                </div>

                {!goal.isCompleted && (
                  <>
                    {isGoalAchieved(goal) ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCompleteGoal(index)}
                        className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-xl hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                      >
                        <BsStars className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Selesaikan Target</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenDepositModal(index)}
                        className="w-full mt-3 px-4 py-2.5 bg-[#4F46E5] text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                      >
                        Tambah Setoran
                      </motion.button>
                    )}
                  </>
                )}
              </div>

              {goal.deposits && goal.deposits.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Riwayat Setoran</h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {goal.deposits.map((deposit, dIndex) => (
                      <div key={dIndex} className="bg-gray-50 rounded-lg p-2 text-xs sm:text-sm hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-medium text-gray-800">
                              Rp {deposit.amount.toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(deposit.date)}</p>
                          </div>
                          {deposit.note && (
                            <p className="text-xs text-gray-500 text-right max-w-[50%] break-words">{deposit.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {goals.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 flex flex-col items-center justify-center py-12 px-4 text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <RiMoneyDollarCircleLine className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">Belum Ada Target</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Mulai atur target keuangan Anda untuk mencapai tujuan finansial yang diinginkan
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal Tambah Target Baru */}
      {showModal && (
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
              <h2 className="text-lg font-semibold text-gray-800">Tambah Target</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Desktop Header */}
            <div className="hidden sm:flex items-center justify-between px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Tambah Target</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowModal(false)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="p-4 sm:p-10 space-y-4 sm:space-y-8">
              {/* Nama Target */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">Nama Target</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: Dana Pendidikan"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Target Nominal */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">Target Nominal</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">Rp</span>
                  <input
                    type="text"
                    placeholder="0"
                    value={newGoal.targetAmount}
                    onChange={handleTargetAmountChange}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">Deskripsi (Opsional)</label>
                <textarea
                  placeholder="Tambahkan detail target..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base h-20 sm:h-32 resize-none"
                  rows="3"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveGoal}
                className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Simpan Target
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Tambah Setoran */}
      {showDepositModal && (
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
              <h2 className="text-lg font-semibold text-gray-800">Tambah Setoran</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDepositModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Desktop Header */}
            <div className="hidden sm:flex items-center justify-between px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Tambah Setoran</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDepositModal(false)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="p-4 sm:p-10 space-y-4 sm:space-y-8">
              {/* Jumlah Setoran */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">Jumlah Setoran</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">Rp</span>
                  <input
                    type="text"
                    placeholder="0"
                    value={newDeposit.amount}
                    onChange={handleDepositAmountChange}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Tanggal Setoran */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">Tanggal Setoran</label>
                <input
                  type="date"
                  value={newDeposit.date}
                  onChange={(e) => setNewDeposit({ ...newDeposit, date: e.target.value })}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                />
              </div>

              {/* Catatan */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">Catatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Tambahkan catatan..."
                  value={newDeposit.note}
                  onChange={(e) => setNewDeposit({ ...newDeposit, note: e.target.value })}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 text-sm sm:text-base"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveDeposit}
                className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Simpan Setoran
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
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
              <h2 className="text-lg font-semibold text-gray-800">Hapus Target</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDeleteModal(false)}
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
                    Apakah Anda yakin ingin menghapus target ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100/50 space-x-3 flex">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                Batal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm hover:from-red-600 hover:to-red-700 transition-all"
              >
                Hapus
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Success Animation for Add Target */}
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
              className="relative flex flex-col items-center"
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
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/20 backdrop-blur-2xl flex items-center justify-center"
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
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl"
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-2xl"
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
                className="mt-4 sm:mt-6"
              >
                <div className="bg-white/80 backdrop-blur-2xl px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl border border-white/50">
                  <div className="flex flex-col items-center space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">
                      Target Berhasil Ditambahkan
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
              className="relative flex flex-col items-center"
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
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-500/20 backdrop-blur-2xl flex items-center justify-center"
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
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-2xl"
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-2xl"
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
                className="mt-4 sm:mt-6"
              >
                <div className="bg-white/80 backdrop-blur-2xl px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl border border-white/50">
                  <div className="flex flex-col items-center space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">
                      Target Terhapus
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

      {/* Add this to your CSS or create a new style tag */}
      <style jsx>{`
        @keyframes modalScale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal-scale {
          animation: modalScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Goals; 