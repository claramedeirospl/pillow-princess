/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blush: "#F2C4CE",
        rose: "#E8829A",
        "deep-rose": "#C45C75",
        night: "#1C1018",
        "night-soft": "#2E1E26",
        cream: "#FDF6F0",
        muted: "#9E7D88",
        "muted-light": "#D4B8C0",
        surface: "#FFF8F5",
        border: "#EDD8DF",
        gold: "#C9A96E",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Trebuchet MS", "sans-serif"],
      },
    },
  },
  plugins: [],
};
