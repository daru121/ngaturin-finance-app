import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import DatePicker from 'react-datepicker';
import useLocalStorage from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const DocumentIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Custom hook untuk mendeteksi mobile device
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

// Komponen DatePicker yang diisolasi
const IsolatedDatePicker = ({ label, selected, onChange, startDate, endDate, minDate, isStart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localDate, setLocalDate] = useState(selected);

  // Handle perubahan tanggal
  const handleChange = (date) => {
    setLocalDate(date);
    onChange(date);
    setIsOpen(false);
  };

  // Custom input untuk menghindari masalah ResizeObserver
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-left"
      onClick={() => setIsOpen(true)}
      ref={ref}
    >
      {value || label}
    </button>
  ));

  return (
    <div className="relative">
      <DatePicker
        selected={localDate}
        onChange={handleChange}
        customInput={<CustomInput />}
        dateFormat="dd/MM/yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        selectsStart={isStart}
        selectsEnd={!isStart}
        popperModifiers={[
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'viewport',
              tether: false,
              altAxis: true
            }
          }
        ]}
        popperPlacement="bottom"
        popperClassName="date-picker-popper"
      />
    </div>
  );
};

function Export() {
  const [transactions] = useLocalStorage('transactions', []);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate totals and category summaries
  const { totals, categoryTotals } = useMemo(() => {
    if (!startDate || !endDate) {
      return {
        totals: { income: 0, expense: 0 },
        categoryTotals: { income: [], expense: [] }
      };
    }

    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const categoryMap = {
      income: new Map(),
      expense: new Map()
    };

    const totals = filteredTransactions.reduce(
      (acc, transaction) => {
        const amount = transaction.amount;
        if (transaction.type === 'income') {
          acc.income += amount;
          const currentAmount = categoryMap.income.get(transaction.category) || 0;
          categoryMap.income.set(transaction.category, currentAmount + amount);
        } else {
          acc.expense += amount;
          const currentAmount = categoryMap.expense.get(transaction.category) || 0;
          categoryMap.expense.set(transaction.category, currentAmount + amount);
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    const categoryTotals = {
      income: Array.from(categoryMap.income.entries()).map(([category, amount]) => ({
        category,
        amount
      })),
      expense: Array.from(categoryMap.expense.entries()).map(([category, amount]) => ({
        category,
        amount
      }))
    };

    return { totals, categoryTotals };
  }, [transactions, startDate, endDate]);

  const generatePDF = async () => {
    if (!startDate || !endDate) return;

    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      const formattedStartDate = format(startDate, 'd MMMM yyyy', { locale: id });
      const formattedEndDate = format(endDate, 'd MMMM yyyy', { locale: id });

      // Add title
      doc.setFontSize(16);
      doc.text('Laporan Keuangan', 105, 20, { align: 'center' });
      
      // Add period
      doc.setFontSize(12);
      doc.text(`Periode: ${formattedStartDate} - ${formattedEndDate}`, 105, 30, { align: 'center' });

      // Add summary
      doc.setFontSize(14);
      doc.text('Ringkasan', 20, 45);
      
      const summaryData = [
        ['Total Pendapatan', `Rp ${totals.income.toLocaleString()}`],
        ['Total Pengeluaran', `Rp ${totals.expense.toLocaleString()}`],
      ];

      autoTable(doc, {
        startY: 50,
        head: [],
        body: summaryData,
        theme: 'plain',
        styles: { fontSize: 12, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 }
        }
      });

      // Add category details
      let currentY = doc.lastAutoTable.finalY + 20;

      // Income categories with dates and notes
      if (categoryTotals.income.length > 0) {
        doc.text('Detail Pendapatan', 20, currentY);
        currentY += 5;

        // Get income transactions
        const incomeTransactions = transactions
          .filter(t => t.type === 'income')
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        autoTable(doc, {
          startY: currentY,
          head: [['Tanggal', 'Kategori', 'Jumlah', 'Catatan']],
          body: incomeTransactions.map(transaction => [
            format(new Date(transaction.date), 'dd/MM/yyyy'),
            transaction.category,
            `Rp ${transaction.amount.toLocaleString()}`,
            transaction.notes || '-'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [46, 125, 50] },
          styles: { fontSize: 10, cellPadding: 5 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
            3: { cellWidth: 70 }
          }
        });

        currentY = doc.lastAutoTable.finalY + 15;
      }

      // Expense categories with dates and notes
      if (categoryTotals.expense.length > 0) {
        doc.text('Detail Pengeluaran', 20, currentY);
        currentY += 5;

        // Get expense transactions
        const expenseTransactions = transactions
          .filter(t => t.type === 'expense')
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        autoTable(doc, {
          startY: currentY,
          head: [['Tanggal', 'Kategori', 'Jumlah', 'Catatan']],
          body: expenseTransactions.map(transaction => [
            format(new Date(transaction.date), 'dd/MM/yyyy'),
            transaction.category,
            `Rp ${transaction.amount.toLocaleString()}`,
            transaction.notes || '-'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [211, 47, 47] },
          styles: { fontSize: 10, cellPadding: 5 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
            3: { cellWidth: 70 }
          }
        });
      }

      // Save the PDF
      const fileName = `laporan_keuangan_${format(startDate, 'dd-MM-yyyy')}_${format(endDate, 'dd-MM-yyyy')}.pdf`;
      doc.save(fileName);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white/80 pb-28 sm:pb-8">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="absolute inset-0 bg-white/50 rounded-2xl backdrop-blur-xl transform rotate-6 scale-90 group-hover:rotate-12 transition-transform duration-300"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 sm:p-4 rounded-2xl shadow-lg transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Export Laporan</h1>
            <p className="text-sm text-gray-500 mt-1">Generate laporan keuangan dalam format PDF</p>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Income Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-emerald-100/50 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Pendapatan</p>
                  <p className="text-lg font-bold text-emerald-500">
                    Rp {(totals?.income || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Expense Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-red-100/50 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Pengeluaran</p>
                  <p className="text-lg font-bold text-red-500">
                    Rp {(totals?.expense || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Date Range Picker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100/50"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pilih Periode Export</h2>
            <div className="space-y-4">
              <IsolatedDatePicker
                label="Pilih Tanggal Mulai"
                selected={startDate}
                onChange={(date) => setDateRange([date, endDate])}
                startDate={startDate}
                endDate={endDate}
                isStart={true}
              />
              <IsolatedDatePicker
                label="Pilih Tanggal Akhir"
                selected={endDate}
                onChange={(date) => setDateRange([startDate, date])}
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                isStart={false}
              />
            </div>
          </motion.div>

          {/* Category Summary */}
          {startDate && endDate && (categoryTotals.income.length > 0 || categoryTotals.expense.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100/50"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Kategori</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Income Categories */}
                <div>
                  <h3 className="text-sm font-medium text-emerald-500 mb-3">Pendapatan</h3>
                  <div className="space-y-2">
                    {categoryTotals.income.map(({ category, amount }) => (
                      <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-600">{category}</span>
                        <span className="text-sm font-medium text-emerald-500">Rp {amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expense Categories */}
                <div>
                  <h3 className="text-sm font-medium text-red-500 mb-3">Pengeluaran</h3>
                  <div className="space-y-2">
                    {categoryTotals.expense.map(({ category, amount }) => (
                      <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-600">{category}</span>
                        <span className="text-sm font-medium text-red-500">Rp {amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Export Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <button
              onClick={generatePDF}
              disabled={!startDate || !endDate || isExporting}
              className={`w-full py-4 rounded-xl text-white font-medium shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                !startDate || !endDate
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isExporting
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export ke PDF</span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-20 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>PDF berhasil di-generate!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Export; 