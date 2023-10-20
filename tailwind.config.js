module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
        body:['IBM Plex Sans','sans-serif'],
        display:'Space Grotesk'
    },
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
