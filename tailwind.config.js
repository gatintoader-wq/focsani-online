/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EEF3F8',
          100: '#D5E0EC',
          200: '#A9BFD6',
          300: '#7C9CBD',
          400: '#4F7AA3',
          500: '#2C5A85',
          600: '#154A74',
          700: '#0E3A5E',
          800: '#0A2540',
          900: '#071C30',
        },
        accent: {
          50: '#FFF8E1',
          100: '#FFEFB3',
          200: '#FFE37F',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107',
          600: '#E0A500',
          700: '#B07F00',
        },
        secondary: {
          50: '#EEF6FD',
          100: '#D6E9FA',
          500: '#2F80C8',
          600: '#1F6BB0',
          700: '#17528A',
        },
        success: {
          50: '#E8F7EE',
          100: '#C6EDD4',
          500: '#1F9D55',
          600: '#17803F',
          700: '#126734',
        },
        warning: {
          50: '#FFF4E5',
          100: '#FFE0B2',
          500: '#F57C00',
          600: '#E26D00',
          700: '#B85800',
        },
        danger: {
          50: '#FDECEC',
          100: '#F9CDCD',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B',
        },
        neutral: {
          50: '#F5F7FA',
          100: '#EBEEF3',
          200: '#D9DEE7',
          300: '#B7C0CD',
          400: '#8A95A6',
          500: '#64707F',
          600: '#4B5563',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      keyframes: {
        'sheet-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'toast-in': {
          from: { transform: 'translateY(-12px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        pulse_ring: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'sheet-up': 'sheet-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'toast-in': 'toast-in 0.25s ease-out',
        pulse_ring: 'pulse_ring 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};
