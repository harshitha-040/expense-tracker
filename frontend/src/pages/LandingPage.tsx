import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, BarChart3, Wallet, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { user, isLoading } = useAuth();

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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 dark:shadow-none">
            <Wallet size={26} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">Expensy</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/features" className="text-muted-foreground font-bold hover:text-foreground transition-colors hidden sm:block">
            Features
          </Link>
          <Link to="/pricing" className="text-muted-foreground font-bold hover:text-foreground transition-colors hidden sm:block">
            Pricing
          </Link>
          <Link to="/login" className="text-muted-foreground font-bold hover:text-foreground transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link to="/pricing" className="btn-primary px-6 py-3 shadow-xl">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-40 pb-20 lg:pt-48 lg:pb-32 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/3 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-foreground text-sm font-bold uppercase tracking-widest mb-8 shadow-sm">
            <Sparkles size={16} className="text-amber-500" />
            <span>The new standard in finance</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-black text-foreground leading-[1.1] mb-8">
            Manage your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">financial life</span> <br/>
            beautifully.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Expensy helps you track every rupee, analyze spending habits with AI, and reach your goals through powerful, intuitive insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/pricing" className="w-full sm:w-auto btn-primary px-8 py-4 text-lg">
              Open Free Account
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg bg-card border border-border text-foreground hover:bg-muted transition-all flex items-center justify-center shadow-sm">
              Sign In to Dashboard
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm font-bold text-muted-foreground">
             <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success"/> No credit card required</div>
             <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success"/> Cancel anytime</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative z-10 w-full max-w-lg lg:max-w-none"
        >
          <div className="relative bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-danger/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-success/80"></div>
              </div>
              <div className="h-6 w-32 bg-muted rounded-full"></div>
            </div>
            
            <div className="space-y-6">
               <div className="h-32 bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-6 flex flex-col justify-end text-white relative overflow-hidden shadow-lg shadow-primary/20 dark:shadow-none">
                  <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Total Balance</p>
                  <h3 className="text-3xl font-black relative z-10">₹1,24,500</h3>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="h-28 bg-background border border-border rounded-2xl p-5 flex flex-col justify-between">
                     <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center"><ArrowRight size={20} className="-rotate-45" /></div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Income</p>
                        <p className="text-lg font-black text-foreground">₹85,000</p>
                     </div>
                  </div>
                  <div className="h-28 bg-background border border-border rounded-2xl p-5 flex flex-col justify-between">
                     <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center"><ArrowRight size={20} className="rotate-45" /></div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expenses</p>
                        <p className="text-lg font-black text-foreground">₹12,400</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-card border-y border-border py-32 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">Built for clarity & control</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              We've stripped away the complexity to give you a clear, actionable view of your financial health.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={28}/>, title: 'Bank-grade Security', desc: 'Your data is encrypted and protected with industry-standard security protocols. We never sell your data.' },
              { icon: <BarChart3 size={28}/>, title: 'Deep Analytics', desc: 'Beautiful, interactive charts break down your spending so you know exactly where your money goes.' },
              { icon: <Sparkles size={28}/>, title: 'AI-Powered Insights', desc: 'Receive smart recommendations and alerts when you deviate from your savings goals.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-background p-10 rounded-[2rem] border border-border shadow-sm group hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">Loved by thousands</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Join the growing community of people who have taken control of their financial destiny.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { quote: "Expensy completely changed how I view my budget. The AI insights caught subscriptions I forgot I was paying for.", name: "Sarah J.", role: "Product Designer" },
               { quote: "The cleanest UI of any finance app I've used. It feels like a premium banking experience, but completely free.", name: "Michael T.", role: "Software Engineer" },
               { quote: "Finally, a tracker that doesn't feel like a spreadsheet. The dark mode is gorgeous and the charts are lightning fast.", name: "Priya R.", role: "Marketing Director" },
             ].map((t, i) => (
                <div key={i} className="bg-card border border-border p-8 rounded-3xl shadow-sm">
                   <div className="flex gap-1 mb-6 text-amber-500">
                      {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
                   </div>
                   <p className="text-foreground font-medium text-lg leading-relaxed mb-8">"{t.quote}"</p>
                   <div>
                      <p className="font-black text-foreground">{t.name}</p>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">{t.role}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 pb-32">
         <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20 dark:shadow-none">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to take control?</h2>
               <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto mb-10 font-medium">Join Expensy today and start building the financial future you deserve.</p>
               <Link to="/pricing" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl">
                 Create Free Account <ArrowRight size={20} />
               </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 px-8">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
               <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
                   <Wallet size={18} strokeWidth={2.5} />
                 </div>
                 <span className="text-xl font-black tracking-tight text-foreground">Expensy</span>
               </div>
               <p className="text-muted-foreground font-medium max-w-sm">The modern standard for personal finance management. Track, analyze, and optimize your wealth.</p>
            </div>
            <div>
               <h4 className="font-black text-foreground mb-6 uppercase tracking-widest text-sm">Product</h4>
               <ul className="space-y-4 font-medium text-muted-foreground">
                  <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                  <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Updates</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-black text-foreground mb-6 uppercase tracking-widest text-sm">Connect</h4>
               <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors font-bold text-xs">
                     X
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors font-bold text-xs">
                     GH
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors font-bold text-xs">
                     IN
                  </a>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold text-muted-foreground">
            <p>&copy; 2026 Expensy Inc. All rights reserved.</p>
            <div className="flex gap-8">
               <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;