/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "readine-green": "rgb(177,202,178)", //#b1cab2
        "readine-brown": "rgb(119,107,83)",

        "yt-bg": "#0F0F0F",
        "yt-component": "#282828",
        "yt-atom": "#606060",
        "yt-atom-hover": "#8F8F8F",
        "yt-text-gray": "#AAAAAA",
        "yt-white": "rgb(241,241,241)",
        "react-md-editor-dark": "rgb(13,17,23)", //#0d1117
        motivation: "rgb(55,48,163,0.1)",
      },
    },
  },
  plugins: [],
};
