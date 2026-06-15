import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Shield, Moon, Sun, Settings, Bell, CreditCard, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Profile: React.FC = () => {
  const { user, upgrade } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleUpgrade = async () => {
    const message = await upgrade();
    if (message.includes('Upgraded')) {
      toast.success('Welcome to Premium!');
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <Helmet>
        <title>Expensy | Profile</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-black text-foreground">Account Profile</h1>
        <p className="text-muted-foreground font-medium mt-1">Manage your personal settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="md:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-fintech p-8"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Personal Information
            </h3>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-primary/20 dark:shadow-none text-3xl font-black">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground">{user?.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground font-medium mt-1">
                  <Mail size={16} />
                  <span>{user?.email}</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold uppercase tracking-widest border border-success/20">
                  <Shield size={14} />
                  Verified Account
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || ''}
                    className="input-fintech bg-muted/50 text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="input-fintech bg-muted/50 text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium italic">
                * Note: Your email and name are securely locked to your account identity.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-fintech p-8"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              App Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Theme Appearance</h4>
                    <p className="text-xs text-muted-foreground font-medium">Switch between light and dark mode</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm"
                >
                  Enable {theme === 'light' ? 'Dark' : 'Light'} Mode
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl opacity-60 pointer-events-none">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Email Notifications</h4>
                    <p className="text-xs text-muted-foreground font-medium">Weekly financial summaries</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-card border border-border rounded-lg text-xs font-bold text-muted-foreground">
                  Coming Soon
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Status Info */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-fintech p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-none text-white shadow-xl shadow-slate-900/20 dark:shadow-none"
          >
            <div className="flex items-center justify-between mb-8">
               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                 <CreditCard size={20} className="text-white" />
               </div>
               <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                 Active Plan
               </span>
            </div>
            <div>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Tier</p>
               <h3 className="text-3xl font-black text-white mb-2">{user?.role === 'PREMIUM' ? 'Premium' : 'Free'}</h3>
               <p className="text-slate-300 text-sm font-medium mb-6">
                 {user?.role === 'PREMIUM' ? 'All features unlocked.' : 'Upgrade to unlock all features.'}
               </p>
               
               {user?.role !== 'PREMIUM' && (
                 <button 
                  onClick={handleUpgrade}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                 >
                   <Zap size={18} />
                   Upgrade to Pro
                 </button>
               )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-fintech p-6"
          >
             <h3 className="font-bold text-foreground mb-4">Security</h3>
             <ul className="space-y-3">
               <li className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                 <CheckCircle2 size={16} className="text-success" /> Two-Factor Auth (Off)
               </li>
               <li className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                 <CheckCircle2 size={16} className="text-success" /> Secure Connection
               </li>
             </ul>
             <button className="w-full mt-6 py-2.5 bg-background border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm">
               Change Password
             </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
