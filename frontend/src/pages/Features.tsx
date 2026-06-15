import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, Shield, Zap, BarChart3, PieChart, Smartphone, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const Features: React.FC = () => {
  const features = [
    {
      icon: <BarChart3 size={32} />,
      title: 'Advanced Analytics',
      description: 'Dive deep into your spending habits with interactive charts and real-time data visualization. Understand where every rupee goes.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: <Zap size={32} />,
      title: 'AI Financial Insights',
      description: 'Our smart algorithms analyze your transaction history to provide personalized recommendations and budgeting tips.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      icon: <Shield size={32} />,
      title: 'Bank-Grade Security',
      description: 'Your financial data is encrypted at rest and in transit. We enforce strict data isolation so your information remains totally private.',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      icon: <PieChart size={32} />,
      title: 'Category Breakdown',
      description: 'Automatically categorize your expenses. See exactly how much you spend on food, rent, shopping, and entertainment.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: <Smartphone size={32} />,
      title: 'Cross-Device Sync',
      description: 'Access your financial dashboard from your phone, tablet, or desktop. Your data is perfectly synced across all devices.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10'
    },
    {
      icon: <Globe size={32} />,
      title: 'Dark & Light Modes',
      description: 'A beautiful interface that adapts to your preferences. Designed with premium fintech aesthetics for optimal readability.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
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
          <Link to="/" className="text-muted-foreground font-bold hover:text-foreground transition-colors hidden sm:block">
            Home
          </Link>
          <Link to="/pricing" className="text-muted-foreground font-bold hover:text-foreground transition-colors hidden sm:block">
            Pricing
          </Link>
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
        <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/3 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">Powerful features for <br/>powerful finances.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium mb-12">
            Everything you need to track, analyze, and optimize your wealth in one beautifully designed platform.
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-8 pb-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-[2rem] border border-border p-8 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110", feature.bgColor, feature.color)}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 pb-32">
         <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20 dark:shadow-none">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
               <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Experience the difference</h2>
               <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto mb-10 font-medium">Join thousands of users who have transformed their financial lives.</p>
               <Link to="/pricing" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl">
                 View Plans & Pricing <ArrowRight size={20} />
               </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 px-8">
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
               <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Features;
