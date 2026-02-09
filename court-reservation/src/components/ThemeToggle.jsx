import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);
  
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
  
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--accent-green)] text-[var(--bg-primary)] shadow-[var(--shadow-lg)] hover:shadow-[var(--glow-green)] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
};
