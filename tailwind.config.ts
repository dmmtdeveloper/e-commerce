import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f97316",
      },
      maxWidth: {
        "lg": "50rem",
      },
      height: {
        '128': '32rem',
      },
      minHeight: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
};
export default config;
