import React, { useEffect, useState, useRef } from 'react';
import { transactionService } from '../../services/transactionService';
import { categoryService } from '../../services/categoryService';
import type { Transaction, Category } from '../../types';
import { Trash2, ArrowUpRight, ArrowDownRight, Search, Filter, Plus, ReceiptText, Lock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import TransactionModal from '../../components/TransactionModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const TransactionList: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  // Month filtering state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const [tData, cData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ]);
      setTransactions(tData);
      setCategories(cData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
        setIsMonthPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id);
        setTransactions(transactions.filter(t => t.id !== id));
        toast.success('Transaction deleted');
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.transactionDate);
    const isSameMonth = tDate.getMonth() === selectedDate.getMonth() && 
                        tDate.getFullYear() === selectedDate.getFullYear();
    
    if (!isSameMonth && filterType !== 'All Historical') return false;

    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category.name === filterCategory;
    const matchesType = filterType === 'All' || filterType === 'All Historical' || (t.type && t.type.toUpperCase() === filterType.toUpperCase());
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) return <div className="text-center p-12 text-muted-foreground font-medium">Loading transactions...</div>;

  return (
    <div className="space-y-8 pb-20 relative">
      <Helmet>
        <title>Expensy | Transactions</title>
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground">Transactions</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Viewing {filterType === 'All Historical' ? 'all history' : months[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear()}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           {/* Month Picker UI */}
           <div className="relative" ref={monthPickerRef}>
              <button 
                onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-all shadow-sm"
              >
                <Calendar size={18} className="text-primary" />
                {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </button>

              <AnimatePresence>
                {isMonthPickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 5, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute z-50 top-full right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl p-4 w-64"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => {
                        const d = new Date(selectedDate);
                        d.setFullYear(d.getFullYear() - 1);
                        setSelectedDate(d);
                      }} className="p-1 hover:bg-muted rounded-lg"><ChevronLeft size={16} /></button>
                      <span className="font-black text-sm">{selectedDate.getFullYear()}</span>
                      <button onClick={() => {
                        const d = new Date(selectedDate);
                        d.setFullYear(d.getFullYear() + 1);
                        setSelectedDate(d);
                      }} className="p-1 hover:bg-muted rounded-lg"><ChevronRight size={16} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((m, i) => (
                        <button
                          key={m}
                          onClick={() => {
                            const d = new Date(selectedDate);
                            d.setMonth(i);
                            setSelectedDate(d);
                            setIsMonthPickerOpen(false);
                          }}
                          className={cn(
                            "py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                            selectedDate.getMonth() === i 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {m.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                       <button 
                         onClick={() => {
                           setSelectedDate(new Date());
                           setIsMonthPickerOpen(false);
                         }}
                         className="w-full py-2 text-[10px] font-black uppercase text-primary hover:bg-primary/10 rounded-lg"
                       >
                         Go to Current Month
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <button 
             onClick={() => { setModalType('EXPENSE'); setIsModalOpen(true); }}
             className="flex items-center gap-2 px-4 py-2.5 bg-danger text-white rounded-xl text-sm font-bold hover:bg-danger/90 transition-all shadow-sm"
           >
              <ArrowDownRight size={18}/>
              Add Expense
           </button>
           <button 
             onClick={() => { setModalType('INCOME'); setIsModalOpen(true); }}
             className="flex items-center gap-2 px-4 py-2.5 bg-success text-white rounded-xl text-sm font-bold hover:bg-success/90 transition-all shadow-sm"
           >
              <ArrowUpRight size={18}/>
              Add Income
           </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card-fintech p-4 flex flex-col xl:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {user?.role !== 'PREMIUM' && (
          <div className="absolute inset-0 bg-card/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-widest">
              <Lock size={14} />
              Search & Filters are Pro Features
            </div>
          </div>
        )}
        <div className="relative w-full xl:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            disabled={user?.role !== 'PREMIUM'}
            className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold text-foreground transition-all disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center p-1 bg-background border border-border rounded-xl w-full sm:w-auto">
            {['All', 'Income', 'Expense', 'All Historical'].map(type => (
              <button
                key={type}
                disabled={user?.role !== 'PREMIUM'}
                onClick={() => setFilterType(type)}
                className={cn(
                  "flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                  filterType === type ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
                  user?.role !== 'PREMIUM' && "opacity-50 cursor-not-allowed"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <select
              disabled={user?.role !== 'PREMIUM'}
              className="w-full pl-11 pr-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-bold text-foreground appearance-none transition-all cursor-pointer disabled:opacity-50"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card-fintech overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Transaction</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground text-right">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground text-right">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground text-center w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <AnimatePresence>
                {filteredTransactions.length === 0 ? (
                  <motion.tr initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key="empty">
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
                          <ReceiptText size={24} />
                        </div>
                        <p className="text-foreground font-bold text-lg mb-1">No transactions found</p>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
                          We couldn't find any transactions matching your current filters. Adjust your filters or add a new transaction.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <button 
                            onClick={() => {
                              setSearchTerm('');
                              setFilterCategory('All');
                              setFilterType('All');
                            }}
                            className="text-primary font-bold text-sm hover:underline"
                          >
                            Clear all filters
                          </button>
                          <div className="hidden sm:block w-1 h-1 bg-border rounded-full"></div>
                          <button onClick={() => { setModalType('EXPENSE'); setIsModalOpen(true); }} className="text-danger font-bold text-sm hover:underline">Add Expense</button>
                          <button onClick={() => { setModalType('INCOME'); setIsModalOpen(true); }} className="text-success font-bold text-sm hover:underline">Add Income</button>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredTransactions.map((t, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.02, duration: 0.2 }}
                      key={t.id} 
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                            t.type?.toUpperCase() === 'INCOME' ? 'bg-success/10 text-success' : 'bg-background border border-border text-foreground'
                          )}>
                            {t.type?.toUpperCase() === 'INCOME' ? <ArrowUpRight size={18} strokeWidth={2.5} /> : <ArrowDownRight size={18} className="text-muted-foreground" strokeWidth={2.5} />}
                          </div>
                          <span className="font-bold text-foreground text-sm">{t.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground border border-border/50">
                          {t.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right whitespace-nowrap">
                        {new Date(t.transactionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-sm font-black text-right tracking-tight whitespace-nowrap",
                        t.type?.toUpperCase() === 'INCOME' ? 'text-success' : 'text-foreground'
                      )}>
                        {t.type?.toUpperCase() === 'INCOME' ? '+' : ''}{formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(t.id!)}
                          className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 dark:shadow-none hover:scale-110 active:scale-95 transition-all md:hidden z-20"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
        initialType={modalType}
      />
    </div>
  );
};

export default TransactionList;
