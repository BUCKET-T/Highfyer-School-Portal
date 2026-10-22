/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#132238",      // Deep navy used for footers, headers, and dark sections[cite: 2, 3, 6]
          blue: "#3B82F6",      // Primary accent blue for buttons, badges, and text highlights[cite: 3, 4, 7]
          sky: "#E0F2FE",       // Light card background or subtle icon containers[cite: 7]
          coral: "#E25875",     // Accent pink/coral used for the admissions badge[cite: 3]
          slate: "#64748B",     // Secondary body text color[cite: 3, 5]
          light: "#F8FAFC",     // Page background off-white
        }
      },
      borderRadius: {
        'xl': '1rem',         // 16px for cards and containers
        '2xl': '1.5rem',      // 24px for larger feature boxes and modals
        'pill': '9999px',     // Fully rounded pills/buttons
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(19, 34, 56, 0.06)',       // Soft, clean shadow for curriculum cards
        'dropdown': '0 10px 25px -5px rgba(19, 34, 56, 0.1)',    // Elevated shadow for active menus or contact forms
        'button': '0 4px 12px rgba(59, 130, 246, 0.25)',         // Subtle colored glow for primary buttons
      }
    },
  },
  plugins: [],
}