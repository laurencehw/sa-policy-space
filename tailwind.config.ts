import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // South African flag palette — used sparingly
        "sa-green": "#007A4D",
        "sa-gold": "#FFB612",
        "sa-black": "#001489",  // the blue-black of the flag
        "sa-red": "#DE3831",
        "sa-white": "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
