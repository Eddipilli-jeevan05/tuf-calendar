import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "elevation-1": "0 1px 3px rgba(0,0,0,0.08)",
        "elevation-2": "0 4px 12px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        panel: "12px",
        day: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
