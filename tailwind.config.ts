import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#E8E4DD",
        signal: "#E63B2E",
        offwhite: "#F5F3EE",
        black: "#111111",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        drama: ["var(--font-dm-serif)", "serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(320px)' },
        },
      },
      animation: {
        scan: 'scan 4s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
