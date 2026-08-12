/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base:    "#070B18",
        panel:   "#0D1117",
        card:    "#12172a",
        surface: "#1a1f35",
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
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disables resets to avoid overriding custom portfolio CSS
  }
}
