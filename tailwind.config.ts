import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // Enforce strict minimum 16px standard across all text
        xs: ["16px", { lineHeight: "24px" }],
        sm: ["16px", { lineHeight: "24px" }],
        base: ["18px", { lineHeight: "28px" }],
        lg: ["20px", { lineHeight: "28px" }],
        xl: ["24px", { lineHeight: "32px" }],
        "2xl": ["28px", { lineHeight: "36px" }],
        "3xl": ["36px", { lineHeight: "44px" }],
        "4xl": ["44px", { lineHeight: "52px" }],
      },
      boxShadow: {
        // Complete ban on shadows as per radical flat design
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "none",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        accent: "var(--accent)",
        muted: "var(--muted)",
      },
      animation: {
        "fade-appear": "fadeAppear 0.25s ease-out forwards",
      },
      keyframes: {
        fadeAppear: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
