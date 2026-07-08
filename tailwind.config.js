/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A5C3A',
          light: '#2D7A4E',
          dark: '#0F3D26',
        },
        secondary: {
          DEFAULT: '#F5F1E8',
          light: '#FAF8F4',
          dark: '#E8E2D6',
        },
        accent: {
          DEFAULT: '#D4A843',
          light: '#E0C06A',
          dark: '#B8922E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'mobile': '480px',
      },
      animation: {
        'breath': 'breath 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        breath: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}