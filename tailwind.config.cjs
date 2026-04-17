/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#3B82F6',
        'bg-card': '#FFFFFF',
        'text-main': '#1A1C1E',
        'text-muted': '#64748B',
        border: '#E2E8F0',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
