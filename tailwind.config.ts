import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#070a14",
          900: "#0c1020",
          800: "#12172b",
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
