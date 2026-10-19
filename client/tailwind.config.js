/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sea: {
          DEFAULT: "#0A1F26",
          900: "#0D262E",
          800: "#10303A",
          700: "#1D4652",
        },
        sand: {
          DEFAULT: "#F1E7D6",
          muted: "#9FB3B0",
          faint: "#7A928F",
        },
        sunset: {
          DEFAULT: "#F2994A",
          soft: "#F7BE87",
        },
        lagoon: "#3CC6C0",
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        hand: ["Caveat", "cursive"],
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};
