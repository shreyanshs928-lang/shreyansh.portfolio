/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF9",
        surface: "#FFFFFF",
        "surface-subtle": "#F4F4F5",
        brand: {
          indigo: "#4F46E5",
          violet: "#6366F1",
          amber: "#F97316",
          coral: "#FB7185",
          mint: "#10B981"
        },
        base: "#070B18",
        panel: "#0D1117",
        card: "#12172a",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "bg-color": "var(--bg-color)",
        "bg-card": "var(--bg-card)",
        "bg-card-hover": "var(--bg-card-hover)",
        "text-white": "var(--text-white)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
      },
      minHeight: {
        screen: ["100vh", "100dvh"],
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        heading: ["'Plus Jakarta Sans'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
