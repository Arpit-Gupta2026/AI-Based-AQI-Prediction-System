/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aqi-good': '#22c55e',
        'aqi-satisfactory': '#84cc16',
        'aqi-moderate': '#eab308',
        'aqi-poor': '#f97316',
        'aqi-verypoor': '#ef4444',
        'aqi-severe': '#991b1b',
      }
    },
  },
  plugins: [],
}
