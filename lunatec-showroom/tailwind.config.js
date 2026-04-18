/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#E95B7F',
          rose: '#C95AAC',
          violet: '#AB58DA',
          dark: '#833B71',
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #E95B7F, #C95AAC, #AB58DA, #833B71)',
      }
    },
  },
  plugins: [],
}