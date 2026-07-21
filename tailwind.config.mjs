/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enables class-based dark mode toggling via .dark class
  theme: {
    extend: {
      colors: {
        // --- NEW DESIGN.MD SPECIFICATION TOKENS ---
        bg: 'rgb(var(--raw-bg) / <alpha-value>)',
        surface: 'rgb(var(--raw-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--raw-surface-alt) / <alpha-value>)',
        border: 'rgb(var(--raw-border) / <alpha-value>)',

        text: {
          strong: 'rgb(var(--raw-text-strong) / <alpha-value>)',
          body: 'rgb(var(--raw-text-body) / <alpha-value>)',
          muted: 'rgb(var(--raw-text-muted) / <alpha-value>)',
          inverse: 'rgb(var(--raw-text-inverse) / <alpha-value>)',
        },

        primary: {
          DEFAULT: 'rgb(var(--raw-primary) / <alpha-value>)',
          hover: 'rgb(var(--raw-primary-hover) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--raw-accent) / <alpha-value>)',
          hover: 'rgb(var(--raw-accent-hover) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--raw-success) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--raw-warning) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--raw-danger) / <alpha-value>)',
        },

        // --- LEGACY MAPPINGS FOR BACKWARD COMPATIBILITY ---
        // Maps the old classes to the new tokens directly
        paper: 'rgb(var(--raw-bg) / <alpha-value>)',
        'paper-2': 'rgb(var(--raw-surface) / <alpha-value>)',
        'paper-3': 'rgb(var(--raw-surface-alt) / <alpha-value>)',
        
        'paper-glass': 'rgb(var(--raw-bg) / 0.8)',
        'paper-2-glass': 'rgb(var(--raw-surface) / 0.7)',
        'paper-3-glass': 'rgb(var(--raw-surface-alt) / 0.75)',
        
        ink: 'rgb(var(--raw-text-strong) / <alpha-value>)',
        'ink-2': 'rgb(var(--raw-text-body) / <alpha-value>)',
        
        rule: 'rgb(var(--raw-border) / <alpha-value>)',
        'rule-strong': 'rgb(var(--raw-border) / <alpha-value>)',
        
        // Old accent class mapped to primary blue
        'accent-bg': 'rgb(var(--raw-accent) / 0.08)',
        
        // Old semantic classes mapped to new semantic tokens
        'success-bg': 'rgb(var(--raw-success) / 0.08)',
        'success-border': 'rgb(var(--raw-success) / 0.3)',
        
        error: 'rgb(var(--raw-danger) / <alpha-value>)',
        'error-bg': 'rgb(var(--raw-danger) / 0.08)',
        'error-border': 'rgb(var(--raw-danger) / 0.3)',
        
        'warning-bg': 'rgb(var(--raw-warning) / 0.08)',
        'warning-border': 'rgb(var(--raw-warning) / 0.3)',
        
        focus: 'rgb(var(--raw-primary) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

