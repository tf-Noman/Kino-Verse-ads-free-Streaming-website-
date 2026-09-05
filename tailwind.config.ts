import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: {
          50: "#27272a",
          100: "#1f1f23",
          200: "#18181b",
          300: "#121215",
          400: "#0d0d10",
        },
        brand: {
          red: "#E50914",
          crimson: "#DC2626",
          darkred: "#991B1B",
          amber: "#F59E0B",
          gold: "#FBBF24",
          violet: "#8B5CF6",
          cyan: "#06B6D4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cinema-gradient": "linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.8) 40%, rgba(9,9,11,0.2) 75%, rgba(9,9,11,0) 100%)",
        "cinema-card-gradient": "linear-gradient(180deg, rgba(24,24,27,0.4) 0%, rgba(18,18,21,0.9) 100%)",
        "glow-radial": "radial-gradient(circle at 50% -20%, rgba(229, 9, 20, 0.15), transparent 70%)",
      },
      boxShadow: {
        "cinema-glow": "0 0 50px -10px rgba(229, 9, 20, 0.35)",
        "amber-glow": "0 0 35px -5px rgba(245, 158, 11, 0.3)",
        "card-hover": "0 20px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px -2px rgba(229, 9, 20, 0.2)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
