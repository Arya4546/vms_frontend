/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: 'var(--color-navy)',
        gold: 'var(--color-gold)',
        offwhite: 'var(--color-offwhite)',
        charcoal: 'var(--color-charcoal)',
        softgray: 'var(--color-softgray)',
        primary: '#1a2526',
        secondary: '#2a3b47',
        accent: '#007bff',
        highlight: '#f7c948',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};