/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        universe: {
          // Layer 1: Deep dark backgrounds
          bg:        "#05070f",
          "bg-end":  "#0a0f1f",
          // Layer 2: Surfaces (cards, panels)
          surface:   "rgba(255,255,255,0.05)",
          "surface-hover": "rgba(255,255,255,0.10)",
          "surface-active": "rgba(255,255,255,0.14)",
          // Layer 3: Primary interactive — Neon Cyan
          primary:       "#00e5ff",
          "primary-dim": "#00b8d4",
          "primary-deep":"#006064",
          // Layer 3b: Secondary interactive — Electric Violet
          secondary:       "#b388ff",
          "secondary-dim": "#7c4dff",
          "secondary-deep":"#311b92",
          // Layer 4: Accent — Hot Pink
          accent:       "#ff4081",
          "accent-dim": "#c51162",
          // Borders
          border:       "rgba(255,255,255,0.08)",
          "border-hover":"rgba(255,255,255,0.16)",
          // Text hierarchy
          text:          "#f0f4ff",           // Primary: near-white blue tint
          "text-sub":    "rgba(255,255,255,0.70)", // Secondary
          "text-muted":  "rgba(255,255,255,0.45)", // Labels / captions
          "text-subtle": "rgba(255,255,255,0.20)", // Decorative
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "universe-gradient": "linear-gradient(180deg, #05070f 0%, #0a0f1f 100%)",
        "glow-cyan":   "radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 65%)",
        "glow-violet": "radial-gradient(circle, rgba(179,136,255,0.14) 0%, transparent 65%)",
        "glow-pink":   "radial-gradient(circle, rgba(255,64,129,0.12) 0%, transparent 65%)",
        "glass-card":  "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        "glow-sm":     "0 0 20px rgba(0,229,255,0.20)",
        "glow-md":     "0 0 40px rgba(0,229,255,0.25)",
        "glow-lg":     "0 0 80px rgba(0,229,255,0.30)",
        "glow-violet": "0 0 40px rgba(179,136,255,0.22)",
        "glow-pink":   "0 0 30px rgba(255,64,129,0.22)",
        "glass":       "0 8px 32px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)",
        "island":      "0 8px 40px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.10)",
        "card":        "0 4px 20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)",
        "card-hover":  "0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,229,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.12)",
        "player":      "0 30px 100px rgba(0,0,0,0.95), 0 0 120px rgba(0,229,255,0.08)",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "orbit-spin": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5",  transform: "scale(1)" },
          "50%":      { opacity: "0.85", transform: "scale(1.08)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        equalizer: {
          "0%, 100%": { height: "25%" },
          "50%":      { height: "100%" },
        },
      },
      animation: {
        shimmer:       "shimmer 1.8s ease-in-out infinite",
        "orbit-slow":  "orbit-spin 30s linear infinite",
        "orbit-fast":  "orbit-spin 8s linear infinite",
        "float":       "float-y 4s ease-in-out infinite",
        "pulse-glow":  "pulse-glow 3s ease-in-out infinite",
        "fade-up":     "fade-up 0.5s ease-out forwards",
        "eq":          "equalizer 0.8s ease-in-out infinite",
        "eq-2":        "equalizer 0.8s ease-in-out 0.2s infinite",
        "eq-3":        "equalizer 0.8s ease-in-out 0.4s infinite",
        "eq-4":        "equalizer 0.8s ease-in-out 0.6s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
