import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import useLocalStorage from '../hooks/useLocalStorage';
import { motion } from 'framer-motion';
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

function Export() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [transactions] = useLocalStorage('transactions', []);
  const [isExporting, setIsExporting] = useState(false);

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    if (!startDate || !endDate) return [];
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions, startDate, endDate]);

  // Calculate summaries
  const summaries = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const categories = {};
    filteredTransactions.forEach(t => {
      if (!categories[t.category]) {
        categories[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        categories[t.category].income += parseFloat(t.amount);
      } else {
        categories[t.category].expense += parseFloat(t.amount);
      }
    });

    return { income, expense, categories };
  }, [filteredTransactions]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Helper function for consistent header styling
    const addSectionHeader = (text, yPosition) => {
      doc.setFillColor(30, 136, 229);
      doc.rect(20, yPosition, 170, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(text, 25, yPosition + 6);
      return yPosition + 15;
    };

    // Helper function for adding page header
    const addPageHeader = (pageNumber) => {
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Halaman ${pageNumber}`, 185, 10, { align: 'right' });
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 15, 190, 15);
    };

    // Title and Date
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Laporan Keuangan', 105, 25, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const startDate = dateRange[0] ? format(dateRange[0], 'd MMMM yyyy', { locale: id }) : '';
    const endDate = dateRange[1] ? format(dateRange[1], 'd MMMM yyyy', { locale: id }) : '';
    doc.text(`Periode: ${startDate} - ${endDate}`, 105, 35, { align: 'center' });

    // Add page number
    addPageHeader(1);
    
    let yPos = 45;

    // Summary Section
    yPos = addSectionHeader('Ringkasan', yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    
    const summaryData = [
      ['Total Transaksi', filteredTransactions.length.toString()],
      ['Total Pendapatan', `Rp ${summaries.income.toLocaleString()}`],
      ['Total Pengeluaran', `Rp ${summaries.expense.toLocaleString()}`],
      ['Total keseluruhan', `Rp ${(summaries.income - summaries.expense).toLocaleString()}`]
    ];

    summaryData.forEach(([label, value]) => {
      doc.text(label, 30, yPos);
      doc.text(value, 180, yPos, { align: 'right' });
      yPos += 7;
    });

    yPos += 10;

    // Categories Section
    yPos = addSectionHeader('Kategori', yPos);
    
    // Categories table header
    doc.setFillColor(240, 240, 240);
    doc.rect(25, yPos - 5, 160, 8, 'F');
    doc.setTextColor(60, 60, 60);
    doc.text('Kategori', 30, yPos);
    doc.text('Pendapatan', 100, yPos);
    doc.text('Pengeluaran', 150, yPos);
    yPos += 8;

    // Categories Content
    doc.setTextColor(0, 0, 0);
    const allCategories = [...new Set(filteredTransactions.map(t => t.category))];
    
    allCategories.forEach((category, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 30;
        addPageHeader(doc.internal.getNumberOfPages());
      }

      const income = filteredTransactions
        .filter(t => t.category === category && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = filteredTransactions
        .filter(t => t.category === category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Add zebra striping
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(25, yPos - 5, 160, 8, 'F');
      }
      
      doc.text(category, 30, yPos);
      doc.text(`Rp ${income.toLocaleString()}`, 100, yPos);
      doc.text(`Rp ${expense.toLocaleString()}`, 150, yPos);
      yPos += 8;
    });

    yPos += 10;

    // Transactions Section
    if (yPos > 220) {
      doc.addPage();
      yPos = 30;
      addPageHeader(doc.internal.getNumberOfPages());
    }

    yPos = addSectionHeader('Detail Transaksi', yPos);
    
    // Transaction table header
    doc.setFillColor(240, 240, 240);
    doc.rect(25, yPos - 5, 160, 8, 'F');
    doc.setTextColor(60, 60, 60);
    doc.text('Tanggal', 30, yPos);
    doc.text('Tipe', 65, yPos);
    doc.text('Kategori', 95, yPos);
    doc.text('Jumlah', 135, yPos);
    doc.text('Catatan', 165, yPos);
    yPos += 8;

    // Transactions Content
    doc.setTextColor(0, 0, 0);
    filteredTransactions.forEach((transaction, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 30;
        addPageHeader(doc.internal.getNumberOfPages());
      }

      // Add zebra striping
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(25, yPos - 5, 160, 8, 'F');
      }

      const date = format(new Date(transaction.date), 'dd/MM/yyyy');
      const type = transaction.type === 'income' ? 'Pendapatan' : 'Pengeluaran';
      const amount = `Rp ${transaction.amount.toLocaleString()}`;
      const notes = transaction.notes || '-';
      const truncatedNotes = notes.length > 15 ? notes.substring(0, 12) + '...' : notes;

      doc.text(date, 30, yPos);
      doc.text(type, 65, yPos);
      doc.text(transaction.category, 95, yPos);
      doc.text(amount, 135, yPos);
      doc.text(truncatedNotes, 165, yPos);
      
      yPos += 8;
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Dicetak pada: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id })}`,
        105,
        285,
        { align: 'center' }
      );
    }
    
    // Save PDF
    doc.save(`Laporan_Keuangan_${format(dateRange[0], 'dd-MM-yyyy')}_${format(dateRange[1], 'dd-MM-yyyy')}.pdf`);
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 relative min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-indigo-100/20 to-transparent" />
      <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_top_right,_var(--tw-gradient-stops))] from-blue-50/20 via-indigo-50/10 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-transparent via-white/50 to-transparent" />
      
      {/* Main Container */}
      <div className="relative rounded-[1.5rem] border border-white/30 shadow-lg bg-white/80 p-3 sm:p-4 md:p-8 overflow-hidden">
        {/* Date Range Picker Container */}
        <div className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-3 sm:p-4 md:p-8 border border-white/50 mb-6 relative z-50">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Pilih Periode Export
            </h3>
            <div className="relative">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                placeholderText="Pilih rentang tanggal"
                className="w-full p-4 sm:p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base bg-white/80 backdrop-blur-sm relative z-50"
                dateFormat="dd/MM/yyyy"
                popperClassName="z-[60]"
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8]
                    }
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Preview Container */}
        {filteredTransactions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-8 mb-6">
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
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-600">Total Pendapatan</h3>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-500">
                  Rp {summaries.income.toLocaleString()}
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
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-600">Total Pengeluaran</h3>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-500">
                  Rp {summaries.expense.toLocaleString()}
                </p>
              </motion.div>
            </div>

            {/* Category Summary Table */}
            <div className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-white/50 overflow-hidden">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
                Ringkasan Kategori
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Pendapatan</th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Pengeluaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white/50">
                    {Object.entries(summaries.categories).map(([category, data], idx) => (
                      <tr key={category} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 text-sm sm:text-base font-medium text-gray-900">{category}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm sm:text-base text-right text-emerald-600">Rp {data.income.toLocaleString()}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm sm:text-base text-right text-red-600">Rp {data.expense.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generatePDF}
              disabled={!startDate || !endDate || filteredTransactions.length === 0 || isExporting}
              className={`w-full max-w-md mx-auto py-3 px-6 rounded-xl text-white font-medium text-sm sm:text-base flex items-center justify-center space-x-3 transition-all duration-300 ${
                startDate && endDate && filteredTransactions.length > 0 && !isExporting
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
            >
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z" 
                  fill="currentColor"
                />
              </svg>
              <span>{isExporting ? 'Memproses...' : 'Export ke PDF'}</span>
            </motion.button>

            {/* Instructions */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="backdrop-blur-xl bg-white/60 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-white/50"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Informasi Export PDF
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <span className="text-sm sm:text-base text-gray-600">File PDF akan berisi laporan lengkap dengan tabel dan grafik yang informatif</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <span className="text-sm sm:text-base text-gray-600">Laporan mencakup ringkasan transaksi, analisis per kategori, dan detail setiap transaksi</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <span className="text-sm sm:text-base text-gray-600">Format PDF dapat dibuka di semua perangkat dan mudah untuk dicetak</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <span className="text-sm sm:text-base text-gray-600">Data dikelompokkan dengan rapi dan mudah dibaca</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}

        {/* Empty State */}
        {(!startDate || !endDate || filteredTransactions.length === 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8 pointer-events-none"
          >
            <div className="relative mb-6 sm:mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                  <DocumentIcon />
                </div>
              </div>
            </div>
            <div className="text-center space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
                Pilih Periode Export
              </h3>
              <p className="text-base sm:text-lg text-gray-500 max-w-md">
                Pilih rentang tanggal untuk melihat preview dan mengexport data transaksi Anda
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Export; 