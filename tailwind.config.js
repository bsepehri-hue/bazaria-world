// tailwind.config.js
module.exports = {
  darkMode: 'class', 
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // ✅ This remains the crucial line
  ],
  theme: {
    extend: {
      colors: {
        bazaria: {
          dark: "#00251a",   // The active/darkest teal
          teal: "#004d40",   // Your main brand teal
          light: "#00695c",  // The hover teal
        },
        teal: {
          600: "#0d9488",
        },
        amber: {
          500: "#f59e0b",
        },
        emerald: {
          900: "#024c05", 
        },
        burgundy: {
          600: "#800020",
        },
      },
    },
  },
  plugins: [],
};
