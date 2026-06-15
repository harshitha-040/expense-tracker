import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Plus, TrendingUp, TrendingDown, Calendar, Tag, FileText, IndianRupee, ChevronDown, Check } from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { type Category, type TransactionRequest } from '../types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialType?: 'INCOME' | 'EXPENSE';
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSuccess, initialType = 'EXPENSE' }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<TransactionRequest>({
    title: '',
    amount: 0,
    type: initialType,
    categoryId: 0,
    transactionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const isIncome = formData.type === 'INCOME';
  const accentColor = isIncome ? 'text-success' : 'text-danger';
  const bgColor = isIncome ? 'bg-success/10' : 'bg-danger/10';
  const borderColor = isIncome ? 'focus-within:border-success/50' : 'focus-within:border-danger/50';
  const btnColor = isIncome ? 'bg-success hover:bg-success/90' : 'bg-danger hover:bg-danger/90';
  const activeItemColor = isIncome ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
        
        const filtered = data.filter(c => c.type === initialType);
        if (filtered.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: filtered[0].id }));
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    if (isOpen) {
      fetchCategories();
      setFormData({
        title: '',
        amount: 0,
        type: initialType,
        categoryId: 0,
        transactionDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setIsAddingCategory(false);
      setNewCategoryName('');
      setIsDropdownOpen(false);
    }
  }, [isOpen, initialType]);

  const filteredCategories = categories.filter(c => c.type === formData.type);
  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  const suggestedCategories = isIncome 
    ? ['Salary', 'Freelance', 'Business', 'Investments', 'Bonus', 'Other']
    : ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

  const handleSuggestedClick = async (name: string) => {
    const existing = categories.find(c => c.name === name && c.type === formData.type);
    if (existing) {
      setFormData(prev => ({ ...prev, categoryId: existing.id }));
      setIsAddingCategory(false);
    } else {
      setIsAddingCategory(true);
      setNewCategoryName(name);
    }
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalCategoryId = formData.categoryId;

      if (isAddingCategory) {
        if (!newCategoryName.trim()) {
          toast.error('Please enter a category name');
          setLoading(false);
          return;
        }
        const newCat = await categoryService.add({ 
          name: newCategoryName, 
          type: formData.type 
        });
        finalCategoryId = newCat.id;
        setCategories(prev => [...prev, newCat]);
      }

      if (!formData.title || !formData.amount || formData.amount <= 0 || !finalCategoryId) {
        toast.error('Please fill all fields correctly');
        setLoading(false);
        return;
      }

      await transactionService.add({ ...formData, categoryId: finalCategoryId });
      toast.success(`${isIncome ? 'Income' : 'Expense'} added successfully!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Failed to add transaction';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#0B1220] rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="px-10 py-8 flex justify-between items-center relative overflow-hidden">
               <div className={cn("absolute top-0 left-0 w-full h-1", isIncome ? "bg-success" : "bg-danger")}></div>
               <div className="flex items-center gap-4">
                  <div className={cn("p-4 rounded-2xl", bgColor, accentColor)}>
                     {isIncome ? <TrendingUp size={28} strokeWidth={2.5} /> : <TrendingDown size={28} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Add {isIncome ? 'Income' : 'Expense'}</h2>
                    <p className="text-sm font-medium text-slate-400">Log your financial {isIncome ? 'growth' : 'activity'} details.</p>
                  </div>
               </div>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title Input */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
                    <FileText size={14} /> Title
                  </label>
                  <div className={cn("group flex items-center px-4 bg-slate-900/50 border border-white/5 rounded-2xl transition-all", borderColor)}>
                    <input
                      type="text"
                      required
                      className="w-full py-4 bg-transparent outline-none text-sm font-bold text-white placeholder:text-slate-600"
                      placeholder={isIncome ? "e.g. Monthly Salary" : "e.g. Groceries"}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
                    <IndianRupee size={14} /> Amount
                  </label>
                  <div className={cn("group flex items-center px-4 bg-slate-900/50 border border-white/5 rounded-2xl transition-all", borderColor)}>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full py-4 bg-transparent outline-none text-sm font-black text-white placeholder:text-slate-600"
                      placeholder="0.00"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Date Input */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
                    <Calendar size={14} /> Date
                  </label>
                  <div className={cn("group flex items-center px-4 bg-slate-900/50 border border-white/5 rounded-2xl transition-all", borderColor)}>
                    <input
                      type="date"
                      required
                      className="w-full py-4 bg-transparent outline-none text-sm font-bold text-white appearance-none cursor-pointer [color-scheme:dark]"
                      value={formData.transactionDate}
                      onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category Input (Custom Dropdown) */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
                      <Tag size={14} /> Category
                    </label>
                    <button 
                      type="button"
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                    >
                      {isAddingCategory ? 'Select Existing' : '+ New Category'}
                    </button>
                  </div>
                  
                  {isAddingCategory ? (
                    <div className={cn("group flex items-center px-4 bg-slate-900/50 border border-white/5 rounded-2xl transition-all", borderColor)}>
                      <input
                        type="text"
                        required
                        className="w-full py-4 bg-transparent outline-none text-sm font-bold text-white placeholder:text-slate-600"
                        placeholder="Type new category..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={cn(
                          "w-full px-4 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-sm font-bold text-white flex justify-between items-center transition-all",
                          borderColor,
                          isDropdownOpen && "border-primary/50 ring-1 ring-primary/20"
                        )}
                      >
                        <span className={!selectedCategory ? "text-slate-600" : "text-white"}>
                          {selectedCategory ? selectedCategory.name : "Select Category"}
                        </span>
                        <ChevronDown size={18} className={cn("text-slate-500 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 5, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-[60] left-0 right-0 bg-[#0B1220] border border-white/10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden max-h-60 overflow-y-auto"
                          >
                            <div className="p-2 space-y-1">
                              {filteredCategories.length === 0 ? (
                                <div className="px-4 py-3 text-xs font-bold text-slate-500 text-center">No categories found</div>
                              ) : (
                                filteredCategories.map(c => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, categoryId: c.id });
                                      setIsDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "w-full px-4 py-3 rounded-xl text-left text-sm font-bold transition-all flex items-center justify-between group",
                                      formData.categoryId === c.id 
                                        ? activeItemColor
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                  >
                                    {c.name}
                                    {formData.categoryId === c.id && <Check size={16} />}
                                  </button>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  
                  {/* Suggested Categories */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {suggestedCategories.map(name => {
                      const isSelected = (!isAddingCategory && selectedCategory?.name === name) || 
                                         (isAddingCategory && newCategoryName === name);
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => handleSuggestedClick(name)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border",
                            isSelected 
                              ? cn("border-transparent text-white shadow-md", isIncome ? "bg-success" : "bg-danger")
                              : "bg-slate-900/50 border-white/5 text-slate-500 hover:border-white/10 hover:text-white"
                          )}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
                  <FileText size={14} /> Notes (Optional)
                </label>
                <div className={cn("group flex items-center px-4 bg-slate-900/50 border border-white/5 rounded-2xl transition-all", borderColor)}>
                  <textarea
                    className="w-full py-4 bg-transparent outline-none text-sm font-medium text-white placeholder:text-slate-600 min-h-[100px] resize-none"
                    placeholder="Describe the transaction..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-5 rounded-[1.5rem] text-lg font-black text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3",
                  btnColor,
                  loading && "opacity-80 cursor-not-allowed"
                )}
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <><Plus size={24} strokeWidth={3} /> Add {isIncome ? 'Income' : 'Expense'}</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
