/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        mint: '#0f766e',
        coral: '#ef6f61',
        cloud: '#f6f8fb'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(23, 32, 51, 0.10)'
      }
    }
  },
  plugins: []
};
