import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, CheckCircle2, X } from 'lucide-react';
import { cn } from '../lib/utils';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for individuals just starting to track expenses.',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        'Up to 50 transactions/month',
        'Basic category breakdown',
        'Light & Dark mode',
        'Mobile responsive',
      ],
      notIncluded: [
        'AI Financial Insights',
        'Smart Recommendations',
        'Unlimited history',
        'Export to CSV',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'Everything you need to master your personal finances.',
      priceMonthly: 199,
      priceAnnual: 149,
      features: [
        'Unlimited transactions',
        'Advanced Analytics & Charts',
        'AI Financial Insights',
        'Smart Recommendations',
        'Export to CSV',
        'Priority support',
      ],
      notIncluded: [],
      cta: 'Start 14-Day Trial',
      popular: true,
    },
    {
      name: 'Family',
      description: 'Built for households managing money together.',
      priceMonthly: 399,
      priceAnnual: 299,
      features: [
        'Everything in Pro',
        'Up to 5 family members',
        'Shared household budgets',
        'Multi-device sync',
        'Dedicated account manager',
      ],
      notIncluded: [],
      cta: 'Get Family Plan',
      popular: false,
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto absolute top-0 left-0 right-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 dark:shadow-none">
            <Wallet size={26} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">Expensy</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/login" className="text-muted-foreground font-bold hover:text-foreground transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary px-6 py-3 shadow-xl">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="relative px-8 pt-40 pb-20 max-w-7xl mx-auto text-center">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/3 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium mb-12">
            No hidden fees. No surprise charges. Choose the plan that best fits your financial journey.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1.5 bg-card border border-border rounded-2xl shadow-sm mb-16">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                !isAnnual ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                isAnnual ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual Billing
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider",
                isAnnual ? "bg-white/20 text-white" : "bg-success/10 text-success"
              )}>Save 25%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                "relative bg-card rounded-[2.5rem] p-8 text-left border transition-all duration-300",
                plan.popular 
                  ? "border-primary shadow-2xl shadow-primary/20 dark:shadow-none scale-105 z-10" 
                  : "border-border shadow-sm hover:border-primary/50"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-black text-foreground mb-2">{plan.name}</h3>
              <p className="text-sm font-medium text-muted-foreground mb-6 min-h-[40px]">{plan.description}</p>
              
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-black text-foreground">
                  ₹{isAnnual ? plan.priceAnnual : plan.priceMonthly}
                </span>
                <span className="text-muted-foreground font-bold mb-2">/mo</span>
              </div>

              <Link 
                to={`/register?plan=${plan.name}`} 
                className={cn(
                  "w-full py-4 rounded-2xl font-bold flex items-center justify-center transition-all mb-8",
                  plan.popular 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 active:scale-95" 
                    : "bg-background border border-border text-foreground hover:bg-muted"
                )}
              >
                {plan.cta}
              </Link>

              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-foreground mb-4">What's included</p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-success shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, idx) => (
                  <div key={`not-${idx}`} className="flex items-center gap-3 opacity-50">
                    <X size={18} className="text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground line-through">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 px-8 mt-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground shadow-sm">
                <Wallet size={12} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black tracking-tight text-foreground">Expensy</span>
            </div>
            <p>&copy; 2026 Expensy Inc. All rights reserved.</p>
            <div className="flex gap-8">
               <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
               <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
               <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Pricing;