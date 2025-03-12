/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        greyscale: {
          500: "rgb(var(--greyscale-500))",
        },
      },
      fontFamily: {
        Spline: ["Spline Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
