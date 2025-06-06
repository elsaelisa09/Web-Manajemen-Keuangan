import React from 'react';
import { Moon, Sun, PiggyBank, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-white/20 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-lg emoji-bg dark:bg-gradient-to-r dark:from-gray-900/95 dark:to-gray-800/95">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <PiggyBank className="h-7 w-7 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Elsa Finance ✨
            </h1>
            <p className="text-sm text-gray-600 font-bold">
              Yuk kelola uang dengan bijak! 💰
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="h-10 px-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 font-bold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
