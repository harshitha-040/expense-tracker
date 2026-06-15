import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Loader2, Wallet, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const { register, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get plan from URL query params
  const queryParams = new URLSearchParams(location.search);
  const initialPlan = queryParams.get('plan') || 'Basic';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState(initialPlan);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);

    const result = await register({ name, email, password, plan });
    
    if (result === 'User Registered Successfully') {
      toast.success(plan !== 'Basic' 
        ? `Account created! Welcome to ${plan}.` 
        : 'Account created! Please sign in.'
      );
      navigate('/login');
    } else {
      toast.error(result);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary/30 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <Link to="/" className="flex items-center gap-3 justify-center mb-10 hover:scale-105 transition-transform w-fit mx-auto">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 dark:shadow-none">
            <Wallet size={26} strokeWidth={2.5} />
          </div>
          <span className="text-3xl font-black tracking-tight text-foreground">Expensy</span>
        </Link>

        <div className="bg-card rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-border p-8 md:p-10">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground font-medium text-lg">Start your financial journey today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  required
                  className="input-fintech pl-12"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="email"
                  required
                  className="input-fintech pl-12"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Select Plan</label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <select
                  className="input-fintech pl-12 appearance-none cursor-pointer"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  disabled={loading}
                >
                  <option value="Basic">Basic (Free)</option>
                  <option value="Pro">Pro (Premium Features)</option>
                  <option value="Family">Family (Shared Features)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-fintech pl-12 pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>Create Account <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-black hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;