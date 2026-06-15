import React, { useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService';
import type { Transaction } from '../types';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Activity, Sparkles, Lightbulb, ChevronRight, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'framer-motion';
import TransactionModal from '../components/TransactionModal';
import { Helmet } from 'react-helmet-async';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ expense: 0, income: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  const fetchDashboardData = async () => {
    try {
      const [totals, transactions] = await Promise.all([
        transactionService.getTotals(),
        transactionService.getAll(),
      ]);
      setStats(totals);
      setRecentTransactions(transactions.slice(0, 5)); // show 5 max to save space

      const chartData = transactions.reduce((acc: any[], t) => {
        const date = new Date(t.transactionDate);
        const month = date.toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.name === month);
        if (existing) {
          existing.amount += t.type?.toUpperCase() === 'INCOME' ? t.amount : -t.amount;
        } else {
          acc.push({ name: month, amount: t.type?.toUpperCase() === 'INCOME' ? t.amount : -t.amount, sortKey: date.getTime() });
        }
        return acc;
      }, []).sort((a, b) => a.sortKey - b.sortKey).slice(-6);

      setMonthlyData(chartData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center p-12 text-muted-foreground font-medium">Loading your financial overview...</div>;

  const savingsRate = stats.income > 0 ? ((stats.income - stats.expense) / stats.income) : 0;
  const healthScore = Math.min(850, Math.max(300, Math.round(500 + (savingsRate * 350))));
  const getHealthStatus = (score: number) => {
    if (score >= 750) return { text: 'Excellent', color: 'text-green-400' };
    if (score >= 600) return { text: 'Good', color: 'text-blue-400' };
    if (score >= 450) return { text: 'Fair', color: 'text-amber-400' };
    return { text: 'Needs Attention', color: 'text-red-400' };
  };
  const healthStatus = getHealthStatus(healthScore);

  const cards = [
    { label: 'Total Balance', value: stats.balance, icon: <Wallet size={24} />, color: 'bg-primary text-primary-foreground border-none', textColor: 'text-primary-foreground' },
    { label: 'Total Income', value: stats.income, icon: <TrendingUp size={24} />, color: 'bg-card text-card-foreground', textColor: 'text-foreground' },
    { label: 'Total Expenses', value: stats.expense, icon: <TrendingDown size={24} />, color: 'bg-card text-card-foreground', textColor: 'text-foreground' },
    { label: 'Total Savings', value: stats.income - stats.expense, icon: <PiggyBank size={24} />, color: 'bg-card text-card-foreground', textColor: 'text-foreground' },
  ];

  return (
    <div className="space-y-8 pb-12 relative">
      <Helmet>
        <title>Expensy | Dashboard</title>
      </Helmet>

      {/* Dynamic Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 p-8 md:p-10 text-white shadow-2xl shadow-slate-900/20 dark:shadow-none border border-slate-800"
      >
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-6",
              user?.role === 'PREMIUM' 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                : "bg-white/10 border-white/20 text-slate-300"
            )}>
              {user?.role === 'PREMIUM' && <Sparkles size={12} />}
              <span>{user?.role === 'PREMIUM' ? 'Premium Member' : 'Free Member'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">Hello, {user?.name.split(' ')[0]}!</h1>
            <p className="text-slate-300 text-lg font-medium max-w-md">Track, analyze, and optimize your financial life with Expensy intelligence.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => { setModalType('EXPENSE'); setIsModalOpen(true); }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
              >
                 <TrendingDown size={20} className="text-danger" />
                 Add Expense
              </button>
              <button 
                onClick={() => { setModalType('INCOME'); setIsModalOpen(true); }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white border border-slate-700 rounded-2xl font-bold hover:bg-slate-700 transition-all active:scale-95 shadow-xl"
              >
                 <TrendingUp size={20} className="text-success" />
                 Add Income
              </button>
            </div>
          </div>
          
          {/* Health Score Card */}
          <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl px-8 py-6 rounded-3xl border border-white/10 shadow-2xl w-full lg:w-auto">
             <div className="flex-1">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Financial Health</p>
                <div className="flex items-end gap-2 mb-1">
                   <span className="text-5xl font-black leading-none">{healthScore}</span>
                   <span className="text-slate-500 font-bold mb-1">/ 850</span>
                </div>
                <p className={cn("text-sm font-bold", healthStatus.color)}>{healthStatus.text}</p>
             </div>
             <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-700"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={healthStatus.color.replace('text-', 'stroke-')}
                    strokeWidth="3"
                    strokeDasharray={`${(healthScore / 850) * 100}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <Activity className={healthStatus.color} size={24} />
             </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-between",
              card.color
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                card.label === 'Total Balance' ? "bg-white/20 text-white" : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
              )}>
                {card.icon}
              </div>
              <p className={cn("text-[10px] font-black uppercase tracking-widest", card.label === 'Total Balance' ? "text-primary-foreground/80" : "text-muted-foreground")}>{card.label}</p>
            </div>
            <h3 className="text-3xl font-black">{formatCurrency(card.value)}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 card-fintech p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-foreground">Cash Flow</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Your balance trend over time</p>
            </div>
            <select className="bg-background border border-border rounded-xl px-4 py-2 text-xs font-bold text-foreground outline-none cursor-pointer hover:border-primary transition-colors">
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 'bold', color: 'var(--foreground)' }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground font-medium italic">No monthly trend data</div>
            )}
          </div>
        </div>

        {/* AI Insights & Recommendations */}
        <div className="flex flex-col gap-6">
          {user?.role === 'PREMIUM' ? (
            <div className="card-fintech p-6 bg-gradient-to-br from-indigo-500 to-purple-600 border-none text-white shadow-xl shadow-indigo-500/20 dark:shadow-none relative overflow-hidden">
               <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-white/20 rounded-xl"><Sparkles size={20} /></div>
                   <h3 className="font-bold text-lg">AI Insights</h3>
                 </div>
                 <p className="text-sm text-indigo-100 font-medium leading-relaxed mb-4">
                   {savingsRate >= 0.2 
                     ? "Great job! Your savings rate is strong. You're building a solid financial buffer." 
                     : "Your expenses are close to your income. Consider tracking discretionary spending closely."}
                 </p>
                 <Link to="/analytics" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                   View Analytics <ChevronRight size={14} />
                 </Link>
               </div>
            </div>
          ) : (
            <div className="card-fintech p-6 bg-slate-100 dark:bg-slate-800/50 border-dashed border-2 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                 <Sparkles size={24} />
               </div>
               <h3 className="font-bold text-foreground mb-2">Unlock AI Insights</h3>
               <p className="text-xs text-muted-foreground mb-4">Upgrade to Pro to get personalized financial advice powered by AI.</p>
               <Link to="/profile" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Upgrade Now</Link>
            </div>
          )}
          
          <div className="card-fintech p-6 flex-1 border-primary/20 bg-primary/5 dark:bg-primary/10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-primary/20 text-primary rounded-xl"><Lightbulb size={20} /></div>
               <h3 className="font-bold text-foreground">Smart Tips</h3>
             </div>
             <ul className="space-y-4">
               <li className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                 <p className="text-sm font-medium text-muted-foreground"><strong className="text-foreground">50/30/20 Rule:</strong> Try to keep 50% for needs, 30% for wants, and 20% for savings.</p>
               </li>
               <li className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                 <p className="text-sm font-medium text-muted-foreground"><strong className="text-foreground">Emergency Fund:</strong> Aim to save at least 3-6 months of essential expenses.</p>
               </li>
             </ul>
          </div>
        </div>

        {/* Recent Activity (Full Width Bottom) */}
        <div className="card-fintech p-8 lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-xl font-black text-foreground">Recent Activity</h3>
               <p className="text-sm font-medium text-muted-foreground mt-1">Your latest transactions</p>
            </div>
            <Link to="/transactions" className="btn-primary bg-background border border-border text-foreground hover:bg-muted px-4 py-2 text-xs shadow-none">
               View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentTransactions.length === 0 ? (
              <div className="col-span-full text-center py-12">
                 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                   <Receipt size={24} />
                 </div>
                 <p className="text-foreground font-bold mb-1">No transactions yet</p>
                 <p className="text-muted-foreground text-sm mb-4">Add your first transaction to see activity here.</p>
                 <div className="flex items-center justify-center gap-4">
                   <button onClick={() => { setModalType('EXPENSE'); setIsModalOpen(true); }} className="text-danger font-bold text-sm hover:underline flex items-center gap-1"><TrendingDown size={16}/> Add Expense</button>
                   <button onClick={() => { setModalType('INCOME'); setIsModalOpen(true); }} className="text-success font-bold text-sm hover:underline flex items-center gap-1"><TrendingUp size={16}/> Add Income</button>
                 </div>
              </div>
            ) : (
              recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                      t.type?.toUpperCase() === 'INCOME' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'
                    )}>
                      {t.type?.toUpperCase() === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm leading-tight line-clamp-1">{t.title}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{t.category.name}</p>
                    </div>
                  </div>
                  <p className={cn("font-black text-sm", t.type?.toUpperCase() === 'INCOME' ? 'text-success' : 'text-danger')}>
                    {t.type?.toUpperCase() === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDashboardData} 
        initialType={modalType}
      />
    </div>
  );
};

export default Dashboard;
