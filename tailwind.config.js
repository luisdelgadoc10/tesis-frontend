/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",             // 👈 importante
    "./src/**/*.{js,ts,jsx,tsx}" // 👈 busca en todo src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
