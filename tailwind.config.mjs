/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        cf: {
          navy: "#002A45",
          yellow: "#F6B800",
          red: "#DE0037",
          cream: "#FCFAF5",
          ink: "#002A45",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 24px 80px rgb(0 42 69 / 0.14)",
      },
    },
  },
  plugins: [],
};
