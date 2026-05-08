/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0714",
        plum: "#3E1F6F",
        violet: "#6F3CC3",
        lilac: "#A687E8",
        gold: "#D2B26A",
        cream: "#FBF8F1",
        mist: "#F5F1FB"
      },
      boxShadow: {
        luxe: "0 20px 60px rgba(39, 18, 78, 0.14)",
        panel: "0 10px 35px rgba(12, 7, 20, 0.08)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(111, 60, 195, 0.16), transparent 38%), radial-gradient(circle at 85% 15%, rgba(210, 178, 106, 0.18), transparent 25%), linear-gradient(180deg, #ffffff 0%, #f8f4fc 55%, #fbf8f1 100%)",
        footer: "linear-gradient(135deg, #2A124D 0%, #4F268A 55%, #1F0C37 100%)"
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};
