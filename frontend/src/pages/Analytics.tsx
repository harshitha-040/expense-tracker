import React, { useEffect, useState, useRef } from 'react';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import type { Transaction } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Zap, Lock, ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Month filtering state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.role !== 'PREMIUM') {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const tData = await transactionService.getAll();
        setTransactions(tData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
        setIsMonthPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user]);

  if (loading) return <div className="text-center p-12 text-slate-500 font-bold text-xl">Analyzing your finances...</div>;

  if (user?.role !== 'PREMIUM') {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <Helmet>
          <title>Expensy | Analytics</title>
        </Helmet>
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6">
          <Lock size={40} />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-4">Advanced Analytics is a Pro Feature</h1>
        <p className="text-muted-foreground font-medium max-w-md mb-8">
          Get deep insights into your spending habits, monthly trends, and category breakdowns with our Pro plan.
        </p>
        <Link 
          to="/pricing" 
          className="btn-primary px-8 py-4 shadow-xl shadow-primary/20 flex items-center gap-2"
        >
          View Pricing Plans <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  // Filter transactions for selected month
  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.transactionDate);
    return tDate.getMonth() === selectedDate.getMonth() && 
           tDate.getFullYear() === selectedDate.getFullYear();
  });

  const stats = filteredTransactions.reduce((acc, t) => {
    if (t.type?.toUpperCase() === 'INCOME') acc.income += t.amount;
    else if (t.type?.toUpperCase() === 'EXPENSE') acc.expense += t.amount;
    acc.balance = acc.income - acc.expense;
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  const categoryData = filteredTransactions
    .filter(t => t.type?.toUpperCase() === 'EXPENSE')
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category.name);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category.name, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const totalExpense = categoryData.reduce((sum, item) => sum + item.value, 0);

  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  const monthlyData = transactions.reduce((acc: any[], t) => {
    const date = new Date(t.transactionDate);
    const month = date.toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      if (t.type?.toUpperCase() === 'INCOME') existing.income += t.amount;
      else if (t.type?.toUpperCase() === 'EXPENSE') existing.expense += t.amount;
    } else {
      acc.push({ 
        name: month, 
        income: t.type?.toUpperCase() === 'INCOME' ? t.amount : 0, 
        expense: t.type?.toUpperCase() === 'EXPENSE' ? t.amount : 0,
        sortKey: date.getTime()
      });
    }
    return acc;
  }, []).sort((a, b) => a.sortKey - b.sortKey).slice(-12);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-8 pb-12">
      <Helmet>
        <title>Expensy | Analytics</title>
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground">Financial Analytics</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Analyzing {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </p>
        </div>

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
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-fintech p-6 bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-xl shadow-blue-200 dark:shadow-none">
           <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg text-white"><Target size={20}/></div>
           </div>
           <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">Savings Rate</p>
           <h3 className="text-3xl font-black text-white mt-1">
             {stats.income > 0 ? Math.round(((stats.income - stats.expense) / stats.income) * 100) : 0}%
           </h3>
        </div>
        <div className="card-fintech p-6">
           <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><TrendingUp size={20}/></div>
           </div>
           <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Income</p>
           <h3 className="text-2xl font-black text-foreground mt-1">{formatCurrency(stats.income)}</h3>
        </div>
        <div className="card-fintech p-6">
           <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg"><TrendingDown size={20}/></div>
           </div>
           <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Expenses</p>
           <h3 className="text-2xl font-black text-foreground mt-1">{formatCurrency(stats.expense)}</h3>
        </div>
        <div className="card-fintech p-6">
           <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Zap size={20}/></div>
           </div>
           <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Avg Daily</p>
           <h3 className="text-2xl font-black text-foreground mt-1">{formatCurrency(stats.expense / (filteredTransactions.length > 0 ? 30 : 1))}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Income vs Expense */}
        <div className="card-fintech p-8">
          <h3 className="text-lg font-bold text-foreground mb-8">Income vs Expenses Trend</h3>
          <div className="h-80 w-full">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                  <Legend verticalAlign="top" align="right" height={36}/>
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground font-medium italic">No monthly data available</div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card-fintech p-8">
          <h3 className="text-lg font-bold text-foreground mb-8">Expense Distribution</h3>
          <div className="h-80 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={categoryData.length === 1 ? 0 : 8}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                     itemStyle={{ fontWeight: 'bold', color: 'var(--foreground)' }}
                     formatter={(value: any, name: any) => [
                       `${formatCurrency(value)} (${((value/totalExpense)*100).toFixed(1)}%)`,
                       name
                     ]}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground font-medium italic">No expenses to display</div>
            )}
          </div>
        </div>

        {/* Monthly Spending Patterns */}
        <div className="card-fintech p-8 lg:col-span-2">
           <h3 className="text-lg font-bold text-foreground mb-8">Monthly Spending Trend</h3>
           <div className="h-80 w-full">
             {monthlyData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={monthlyData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
                   <Tooltip 
                     cursor={{fill: 'var(--background)'}}
                     contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                     itemStyle={{ fontWeight: 'bold' }}
                     formatter={(value: any) => formatCurrency(value)}
                   />
                   <Bar dataKey="expense" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-muted-foreground font-medium italic">No transaction trend available</div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
