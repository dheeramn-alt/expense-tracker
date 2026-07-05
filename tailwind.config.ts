import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18211d",
        cream: "#f7f7f2",
        forest: "#216e4e",
        mint: "#dff4e8",
        coral: "#e06d52",
      },
      boxShadow: {
        card: "0 8px 30px rgba(22, 48, 36, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
