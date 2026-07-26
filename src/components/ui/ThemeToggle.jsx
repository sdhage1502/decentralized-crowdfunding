'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const baseSize = className || 'w-8 h-8';

  if (!mounted) {
    // Render a placeholder to avoid layout shift during hydration
    return (
      <div className={`rounded-full bg-black/5 dark:bg-white/10 animate-pulse ${baseSize}`} />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative flex items-center justify-center rounded-full border border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.06] text-ink dark:text-white transition-all duration-300 hover:bg-black/[0.07] dark:hover:bg-white/[0.12] hover:shadow-sm active:scale-90 shrink-0 ${baseSize}`}
    >
      <Sun
        size={16}
        strokeWidth={2}
        className={`absolute transition-all duration-300 ${
          isDark
            ? 'opacity-0 rotate-90 scale-0'
            : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <Moon
        size={16}
        strokeWidth={2}
        className={`absolute transition-all duration-300 ${
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-0'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
