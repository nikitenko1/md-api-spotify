/** @type {import('tailwindcss').Config} */
import plugin from "tailwind-scrollbar";

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["Open Sans", "sans-serif"],
      },
      screens: {
        sm: "540px",
        xs: "375px",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    plugin({ nocompatible: true }),
    // This will add utilities such as scrollbar-thumb-rounded or scrollbar-thumb-rounded-md
  ],
  variants: {
    scrollbar: ["rounded"],
  },
};
