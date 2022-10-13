/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["{pages,templates,components}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [...require("@jumpu-ui/tailwindcss"), require("@tailwindcss/typography")],
};
