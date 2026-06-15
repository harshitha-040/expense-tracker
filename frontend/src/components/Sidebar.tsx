import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, LogOut, Wallet, BarChart2, Sun, Moon, UserCircle, X, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Close sidebar on mobile when resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true); // Open by default on desktop
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname, setIsOpen]);

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
    { to: '/analytics', icon: <BarChart2 size={22} />, label: 'Analytics', premium: true },
    { to: '/transactions', icon: <Receipt size={22} />, label: 'Transactions' },
    { to: '/profile', icon: <UserCircle size={22} />, label: 'Profile' },
  ];

  const filteredNavItems = navItems.filter(item => !item.premium || user?.role === 'PREMIUM');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={cn(
        "fixed lg:sticky top-0 left-0 h-screen flex flex-col bg-card border-r border-border transition-all duration-300 z-50 overflow-hidden shrink-0 whitespace-nowrap",
        // On mobile: strictly hide or show. On desktop: scale between 72 (288px) and 20 (80px)
        isOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}>
        <div className="h-20 px-6 flex items-center justify-between lg:justify-start gap-4 shrink-0 border-b lg:border-none border-border">
          {/* Desktop Toggle */}
          <button 
            className="hidden lg:block text-muted-foreground hover:text-foreground shrink-0 outline-none focus:ring-2 focus:ring-primary rounded-lg" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            isOpen ? "opacity-100 w-auto" : "lg:opacity-0 lg:w-0"
          )}>
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 dark:shadow-none shrink-0">
              <Wallet size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">Expensy</span>
          </div>

          {/* Mobile Close */}
          <button className="lg:hidden text-muted-foreground hover:text-foreground shrink-0 ml-auto" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className={cn("flex-1 py-4 space-y-2 overflow-y-auto overflow-x-hidden", isOpen ? "px-4" : "px-3")}>
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={!isOpen ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-2xl transition-all duration-200 font-semibold group relative",
                  isOpen ? "gap-3 px-4 py-3.5" : "justify-center p-3.5 mx-auto w-12",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 dark:shadow-none translate-x-1 lg:translate-x-0"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                )
              }
            >
              <div className="shrink-0">{item.icon}</div>
              <span className={cn(
                "transition-all duration-300 overflow-hidden",
                isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              )}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className={cn("py-4 space-y-4", isOpen ? "px-4" : "px-3")}>
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            className={cn(
              "flex items-center rounded-2xl text-muted-foreground hover:bg-background hover:text-foreground transition-all font-semibold",
              isOpen ? "gap-3 px-4 py-3.5 w-full" : "justify-center p-3.5 mx-auto w-12"
            )}
          >
            {theme === 'light' ? <Moon size={22} className="shrink-0" /> : <Sun size={22} className="shrink-0" />}
            <span className={cn(
                "transition-all duration-300 overflow-hidden",
                isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              )}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          <div className={cn(
            "bg-background border border-border transition-all overflow-hidden",
            isOpen ? "p-4 rounded-3xl" : "p-2 rounded-2xl flex flex-col items-center gap-3 w-12 mx-auto"
          )}>
             {isOpen ? (
               <>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                       {user?.name?.[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                       <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                 </div>
                 <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-danger bg-card border border-danger/10 hover:bg-danger/10 w-full transition-all text-sm font-bold shadow-sm"
                 >
                  <LogOut size={16} />
                  <span>Logout</span>
                 </button>
               </>
             ) : (
               <>
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0" title={user?.name}>
                    {user?.name?.[0].toUpperCase()}
                 </div>
                 <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-danger hover:bg-danger/10 w-full flex items-center justify-center transition-all"
                 >
                  <LogOut size={18} />
                 </button>
               </>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
