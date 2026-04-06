import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          start: "var(--bg-start)",
          end: "var(--bg-end)",
        },
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        glass: {
          border: "var(--glass-border)",
          bg: "var(--glass-bg)",
          bgHover: "var(--glass-bg-hover)",
        },
        accent: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          pink: "#ec4899",
          cyan: "#06b6d4",
          orange: "#f97316",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme("colors.primary"),
            lineHeight: "1.75",
            a: {
              color: theme("colors.accent.blue"),
              "&:hover": {
                color: theme("colors.accent.cyan"),
              },
            },
            h1: { color: theme("colors.primary") },
            h2: { color: theme("colors.primary") },
            h3: { color: theme("colors.primary") },
            h4: { color: theme("colors.primary") },
            strong: { color: theme("colors.primary") },
            blockquote: {
              borderLeftColor: theme("colors.accent.purple"),
              color: theme("colors.secondary"),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
