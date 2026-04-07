import { Sun, Moon, User, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);
  const { isLoggedIn, quickGuestLogin, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleGuestToggle = async () => {
    if (isLoggedIn) {
      logout();
    } else {
      setIsLoggingIn(true);
      await quickGuestLogin();
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Quick Guest Login Button */}
      <button
        onClick={handleGuestToggle}
        disabled={isLoggingIn}
        className={`w-14 h-14 rounded-full shadow-[var(--shadow-lg)] transition-all duration-300 flex items-center justify-center group relative ${isLoggedIn
            ? 'bg-[var(--accent-green)] text-black hover:shadow-[var(--glow-green)]'
            : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)]'
          } hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isLoggedIn ? "Logout" : "Quick Guest Login"}
      >
        {isLoggingIn ? (
          <Loader className="w-6 h-6 animate-spin" />
        ) : (
          <User className="w-6 h-6" />
        )}

        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold rounded-[var(--radius-md)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isLoggedIn ? 'Logout' : 'Quick Guest Login'}
        </span>
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="w-14 h-14 rounded-full bg-[var(--accent-green)] text-[var(--bg-primary)] shadow-[var(--shadow-lg)] hover:shadow-[var(--glow-green)] hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <Moon className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-500" />
        )}

        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold rounded-[var(--radius-md)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    </div>
  );
};
