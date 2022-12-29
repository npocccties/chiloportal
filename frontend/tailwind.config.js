const { stone } = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["{pages,templates,components}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fcf9f9",
          100: "#fbf3f2",
          200: "#f7eaea",
          300: "#edd5d4",
          400: "#dcaba9",
          500: "#ca807f",
          600: "#b95654",
          700: "#a72c29",
          800: "#7d211f",
          900: "#541615",
        },
        gray: stone,
        ...require("@jumpu-ui/tailwindcss/colors"),
      },
    },
  },
  plugins: [
    ...require("@jumpu-ui/tailwindcss"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};
