/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // base palette
        background: '#0A0D12',
        card: '#11151C',
        textPrimary: '#EAF2FF',
        textSecondary: '#A6B3C6',
        // accents updated to better match the Swarm.AI branding
        accent1: '#EAAA3B', // turquoise green for primary highlights
        accent2: '#EAAA3B', // royal blue for secondary highlights
        warning: '#FFB84D',
        danger: '#FF6B6B'
      },
      borderRadius: {
        '2xl': '1rem',
        '4xl': '2rem'
      }
    },
  },
  plugins: [],
};