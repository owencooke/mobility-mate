/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        "dark-teal": "#022B3A",
        "light-teal": "#1F7A8C",
        "baby-blue": "#BFDBF7",
        "smooth-gray": "#E1E5F2",
        red: "#FF1C1C",
      },
      spacing: {
        "1/2": "50%",
        "1/4": "25%",
        "1/8": "12.5%",
        "3/4": "75%",
        "2/3": "66.666667%",
        "1/3": "33.333333%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        full: "100%",
      },
    },
  },
  plugins: [require("daisyui")],
};
