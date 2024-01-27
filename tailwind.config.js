/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  theme: {
    extend: {
      backgroundColor: {
        'sidebar-dark': '#232529', 
        'maincontent-dark': '#1b1d21', 
        'menu-bg': 'rgb(49, 51, 55)'
      },
      colors: {
        'custom-gray': '#1b1d21',
        'grey-txt': '#86888D',
        'grey-txt2': '#86888D',
        'grey-txt3': '#86888D'
      }
    },
  },
  plugins: [],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
};
