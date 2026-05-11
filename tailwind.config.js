/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
        slideIn: "slideIn 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        heartFill: "heartFill 0.6s ease-out forwards",
        heartEmpty: "heartEmpty 0.6s ease-out forwards",
        heartBeat: "heartBeat 0.8s ease-in-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        heartFill: {
          "0%": { opacity: 0, transform: "scale(0)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        heartEmpty: {
          "0%": { opacity: 1, transform: "scale(1)" },
          "50%": { transform: "scale(0.7)" },
          "100%": { opacity: 0, transform: "scale(0)" },
        },
        heartBeat: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" },
          "50%": { transform: "scale(1)" },
        },
      },
      colors: {
        wedsy: {
          ivory: "#FBF7F2",
          "ivory-2": "#F5EFE6",
          rose: {
            50: "#FAEEEA",
            100: "#F2D9D1",
            200: "#E8B8A8",
            400: "#C97A65",
            600: "#9C4A38",
          },
          burgundy: {
            DEFAULT: "#5B1F1A",
            soft: "#7A2E26",
          },
          ink: {
            DEFAULT: "#1F1A17",
            2: "#4A4038",
            3: "#8B7E72",
          },
          gold: "#B08A4A",
          green: "#4A7A4F",
          amber: "#B07A2A",
          danger: "#9C3A3A",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
