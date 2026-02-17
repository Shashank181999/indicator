/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // TradingView-inspired color palette
        background: "#131722",
        foreground: "#d1d4dc",
        card: "#1e222d",
        "card-hover": "#252a37",
        accent: "#2962ff",
        "accent-hover": "#3d72ff",
        success: "#26a69a",
        danger: "#ef5350",
        muted: "#787b86",
        border: "#2a2e39",
        "border-light": "#363a45",
        // TradingView specific colors
        tv: {
          bg: "#131722",
          "bg-secondary": "#1e222d",
          "bg-tertiary": "#252a37",
          blue: "#2962ff",
          green: "#26a69a",
          red: "#ef5350",
          text: "#d1d4dc",
          "text-muted": "#787b86",
          border: "#2a2e39",
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Trebuchet MS', 'Roboto', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
