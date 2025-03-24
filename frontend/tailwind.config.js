/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Add this line to enable dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "pacific": ["Pacifico", 'sans-serif'],
      },
      animation: {
        'fade-in-out': 'fadeInOut 3s ease-in-out infinite', // Custom fade-in and fade-out animation
      },
      keyframes: {
        fadeInOut: {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};