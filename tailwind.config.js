/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        base: "#0a0a0f",
        panel: "#12172a",
      },
      colors: {
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "bg-color": "var(--bg-color)",
        "bg-card": "var(--bg-card)",
        "bg-card-hover": "var(--bg-card-hover)",
        "text-white": "var(--text-white)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
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
