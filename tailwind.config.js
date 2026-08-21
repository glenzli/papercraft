/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        craft: {
          50: '#fbf8f3',
          100: '#f5efe4',
          200: '#ebdcc9',
          300: '#dec2a4',
          400: '#cca07b',
          500: '#be855c',
          600: '#b06f4f',
          700: '#935841',
          800: '#774738',
          900: '#623c30',
        }
      }
    },
  },
  plugins: [],
}
