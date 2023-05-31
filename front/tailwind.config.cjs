module.exports = {
  darkMode: 'media', // or 'media' or 'class'
  content: {
    preserveHtmlElements: false,
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  },
  theme: {
    extend: {
      fontFamily: {
        Dance: "'Dancing Script', serif",
        Bungee: "'Bungee Shade', serif",
      },
    },
  },
  plugins: [],
};