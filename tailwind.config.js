/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Comic Sans MS', 'Comic Sans', 'cursive'],
        reading: ['Lexend', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out'
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        readingrally: {
          "primary": "#0ea5e9",
          "secondary": "#d946ef",
          "accent": "#fcd34d",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "font-family": "Lexend, sans-serif",
        },
      },
      "light",
      "cupcake",
    ],
    darkTheme: "light",
  },
};
