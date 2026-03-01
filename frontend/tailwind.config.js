/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pump: {
          orange: '#FF6B35',
          red: '#FF4500',
          dark: '#0A0A0A',
          card: '#111111',
          border: '#1E1E1E',
          gray: '#888888',
          light: '#CCCCCC',
        }
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

