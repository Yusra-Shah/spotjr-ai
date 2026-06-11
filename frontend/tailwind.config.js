/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':     '#080C18',
        'bg-surface':  '#0C1120',
        'bg-elevated': '#111827',
        'bg-inset':    '#0A0F1C',
        'border-subtle':  '#1E2D4D',
        'border-default': '#253659',
        'border-strong':  '#2E4470',
        'text-primary':   '#F0F4FF',
        'text-secondary': '#94A3B8',
        'text-muted':     '#475569',
        'brand-blue':   '#2463EB',
        'brand-cyan':   '#06B6D4',
        'brand-indigo': '#4F46E5',
        'risk-low':      '#10B981',
        'risk-medium':   '#F59E0B',
        'risk-high':     '#F97316',
        'risk-critical': '#EF4444',
        'ai-primary':    '#8B5CF6',
        'ai-secondary':  '#7C3AED',
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
