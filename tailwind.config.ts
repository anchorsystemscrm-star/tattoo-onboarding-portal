import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        night: "#0c1628",
        steel: "#94a3b8",
        line: "rgba(148, 163, 184, 0.18)",
        accent: "#d7b46a",
        accentSoft: "rgba(215, 180, 106, 0.18)",
      },
      boxShadow: {
        panel: "0 18px 50px rgba(5, 12, 24, 0.4)",
        glow: "0 0 0 1px rgba(215, 180, 106, 0.24), 0 18px 50px rgba(5, 12, 24, 0.4)",
      },
      backgroundImage: {
        "hero-fade":
          "radial-gradient(circle at top, rgba(26, 42, 72, 0.55), transparent 42%), linear-gradient(180deg, #08111f 0%, #0c1628 50%, #09111d 100%)",
      },
      fontFamily: {
        sans: ["Avenir Next", "Segoe UI", "Helvetica Neue", "sans-serif"],
        display: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
