const { blue } = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["{pages,templates,components}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: blue,
        ...require("@jumpu-ui/tailwindcss/colors"),
      },
    },
    container: {
      center: true,
      screens: {
        xl: "1024px",
        "2xl": "1024px",
      },
    },
  },
  plugins: [
    ...require("@jumpu-ui/tailwindcss"),
    require("@tailwindcss/typography"),
  ],
};
