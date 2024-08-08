/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        laptop: "url(/laptop.jpg)",
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
