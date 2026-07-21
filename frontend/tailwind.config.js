/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand palette — earthy amber tones
        primary: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Secondary — deep teal/forest green for artisan feel
        secondary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Accent — terracotta for rural craft vibes
        accent: {
          50:  '#fdf4f0',
          100: '#fbe5dc',
          200: '#f8cabf',
          300: '#f3a18d',
          400: '#ec6f52',
          500: '#e2522e',
          600: '#cf3a1e',
          700: '#ac2e1a',
          800: '#8e281b',
          900: '#76251c',
          950: '#3f0f0a',
        },
        // Surface/background — warm off-white
        surface: {
          DEFAULT: '#faf8f5',
          dark:    '#1a1714',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:    '0 2px 12px 0 rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px 0 rgba(0,0,0,0.15)',
        glass:   '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-in-out',
        'slide-up':      'slideUp 0.3s ease-out',
        'slide-down':    'slideDown 0.2s ease-out',
        'scale-in':      'scaleIn 0.2s ease-out',
        'spin-slow':     'spin 2s linear infinite',
        'pulse-soft':    'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      backgroundImage: {
        'hero-pattern':   "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
