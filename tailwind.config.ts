import type { Config } from "tailwindcss";

import tailwindScrollbar from 'tailwind-scrollbar';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInSlideUp: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(20px)' },
        },
        'float-alt': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-10px) translateX(5px)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'new-message': 'fadeInSlideUp 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 8s ease-in-out infinite',
        'float-alt': 'float-alt 7s ease-in-out infinite',
      },
    },
  },
  plugins: [
     tailwindScrollbar,
  ],
};
export default config;