/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        danger: {
          100: "#fee2e2",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
        },
        warning: {
          100: "#fef3c7",
          800: "#92400e",
        },
        success: {
          100: "#dcfce7",
          800: "#166534",
        },
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
