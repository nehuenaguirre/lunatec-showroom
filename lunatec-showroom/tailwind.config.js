/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Un azul tecnológico y un verde WhatsApp como base
        brand: '#2563eb', 
        whatsapp: '#25D366',
        whatsappHover: '#1DA851'
      }
    },
  },
  plugins: [],
}