module.exports = {
  // content:["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  purge: {
    preserveHtmlElements: false,
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
  },
  theme: {
    extend: {
      fontFamily: {
        Dance: "'Dancing Script', serif",
        Bungee: "'Bungee Shade', serif",
      }
    }
    },
  plugins: [],
}