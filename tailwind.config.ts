import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Warm near-black surfaces.
        ink: {
          DEFAULT: "#0b0709",
          900: "#150d11",
          800: "#1d1217",
        },
        // The accent: a vivid red that leans slightly towards coral.
        brand: {
          300: "#ffa3ad",
          400: "#ff6b7d",
          500: "#f43f5e",
          600: "#e11d48",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      keyframes: {
        drift: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "100%": { transform: "translate3d(60px,40px,0) scale(1.15)" },
        },
        shimmer: { to: { backgroundPosition: "200% center" } },
        rise: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        drift: "drift 24s ease-in-out infinite alternate",
        shimmer: "shimmer 10s linear infinite",
        rise: "rise 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
