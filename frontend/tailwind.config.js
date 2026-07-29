/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#fdf7f4',
          100: '#f9eae4',
          200: '#f3d3c6',
          300: '#e8b19c',
          400: '#da876d',
          500: '#c85a32', // Core Terracotta
          600: '#b44726',
          700: '#94381e',
          800: '#79301e',
          900: '#642c1e',
        },
        indigoCraft: {
          50: '#f0f3fa',
          100: '#dce4f3',
          500: '#2c3e6b', // Deep Indigo
          800: '#1b2646',
          900: '#121a30',
        },
        linen: '#fdfbf7',
        earthGold: '#d97706',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Cinzel"', 'serif'],
      },
    },
  },
  plugins: [],
}
