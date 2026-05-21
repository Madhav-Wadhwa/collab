/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,迎え,html,css}",
    "./src/*.{js,ts,jsx,css}",
    "./src/**/*.jsx"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#c6c6c6",
        "inverse-primary": "#5e5e5e",
        "tertiary-container": "#000000",
        background: "#131313",
        "surface-container-high": "#2a2a2a",
        "on-secondary-fixed": "#1c1b1c",
        "on-surface": "#e2e2e2",
        "primary-fixed-dim": "#c6c6c6",
        "on-secondary-fixed-variant": "#474647",
        surface: "#131313",
        "on-primary-fixed-variant": "#474747",
        "primary-container": "#000000",
        "on-tertiary": "#303030",
        "outline-variant": "#4c4546",
        "tertiary-fixed-dim": "#c6c6c6",
        "on-tertiary-fixed": "#1b1b1b",
        "inverse-surface": "#e2e2e2",
        "on-primary": "#303030",
        "on-primary-fixed": "#1b1b1b",
        "on-error-container": "#ffdad6",
        "error-container": "#93000a",
        tertiary: "#c6c6c6",
        "surface-bright": "#393939",
        "secondary-container": "#4a494a",
        "tertiary-fixed": "#e2e2e2",
        "on-tertiary-fixed-variant": "#474747",
        "surface-container": "#1f1f1f",
        "inverse-on-surface": "#303030",
        "on-tertiary-container": "#757575",
        "on-background": "#e2e2e2",
        "surface-container-low": "#1b1b1b",
        error: "#ffb4ab",
        "surface-dim": "#131313",
        "secondary-fixed": "#e5e2e3",
        "surface-container-lowest": "#0e0e0e",
        "on-error": "#690005",
        "on-secondary-container": "#bab8b9",
        outline: "#988e90",
        "on-surface-variant": "#cfc4c5",
        "on-primary-container": "#757575",
        "surface-tint": "#c6c6c6",
        "secondary-fixed-dim": "#c8c6c7",
        "on-secondary": "#313031",
        "primary-fixed": "#e2e2e2",
        "surface-variant": "#353535",
        secondary: "#c8c6c7",
        "surface-container-highest": "#353535",
        "accent-lime": "#CCFF00",
        "accent-fuchsia": "#FF00FF"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "bento-gap": "12px",
        gutter: "16px",
        "grid-margin": "24px",
        unit: "4px",
        "card-padding": "24px"
      },
      fontFamily: {
        body: ["Hanken Grotesk", "sans-serif"],
        label: ["JetBrains Mono", "monospace"],
        display: ["Anton", "sans-serif"]
      }
    }
  },
  plugins: []
}
