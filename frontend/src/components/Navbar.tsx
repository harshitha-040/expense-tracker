import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <div className="h-20 bg-card/80 backdrop-blur-md border-b border-border px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 w-full">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 lg:hidden text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all shrink-0 -ml-2"
        >
          <Menu size={24} />
        </button>
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search for transactions..."
            className="w-full pl-12 pr-4 py-2.5 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary transition-all text-sm font-medium text-foreground"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-auto shrink-0">
        <button className="p-2.5 text-muted-foreground hover:bg-background rounded-xl transition-all relative">
          <Bell size={22} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-card"></span>
        </button>
        <div className="h-8 w-[1px] bg-border mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground leading-none mb-1">{user?.name}</p>
            <p className={cn(
              "text-[10px] uppercase tracking-wider font-bold leading-none",
              user?.role === 'PREMIUM' ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
            )}>
              {user?.role === 'PREMIUM' ? 'Premium Member' : 'Free Member'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <span className="font-bold">{user?.name?.[0].toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;