const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "media", // or 'media' or 'class'
  content: {
    preserveHtmlElements: false,
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  },
  theme: {
    extend: {
      fontFamily: {
        Dance: "'Dancing Script', serif",
        Bungee: "'Bungee Shade', serif",
      },
      boxShadow: {
        custom:
          "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      },
      scrollbar: theme => ({
        DEFAULT: {
          'track': '#00000',
          'thumb': '#888',
          'thumb-rounded': 'rounded-md'
        }
      }),
    },
  },
<<<<<<< HEAD
=======
  plugins: [],
>>>>>>> main
};
