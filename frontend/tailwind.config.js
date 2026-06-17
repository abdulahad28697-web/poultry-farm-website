/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './main.jsx',
    './App.jsx',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
    './context/**/*.{js,jsx}',
    './services/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          orange: '#F97316',
          'orange-soft': '#FFEDD5',
          beige: '#FFF8F3',
          'beige-dark': '#FCE7D4',
          brown: '#7C2D12',
          'brown-dark': '#3F1D14',
          green: '#16A34A',
          'green-dark': '#166534'
        }
      },
      boxShadow: {
        'soft-card': '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
