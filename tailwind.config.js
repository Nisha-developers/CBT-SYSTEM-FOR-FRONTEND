/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1d4ed8',
          dark: '#1e3a8a',
        },
      },
    keyframes: {
  'fade-in': {
    '0%': { filter: 'blur(20px)'},
    '100%': { filter: 'blur(0px)' },
  },
  'fade-in-up': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'fade-in-left': {
    '0%': { opacity: '0', transform: 'translateX(-40px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  'fade-in-right': {
    '0%': { opacity: '0', transform: 'translateX(40px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
},
animation: {
  'fade-in': 'fade-in 0.6s ease-out',
  'fade-in-up': 'fade-in-up 0.6s ease-out',
  'fade-in-left': 'fade-in-left 0.7s ease-out',
  'fade-in-right': 'fade-in-right 0.7s ease-out',
},
    },
  },
  plugins: [],
};
// tailwind.config.js
 