/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional dashboard color scheme
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        seat: {
          available: '#10b981',  // emerald-500
          reserved: '#6b7280',   // gray-500
          sold: '#ef4444',       // red-500
          held: '#f59e0b',       // amber-500
          selected: '#3b82f6',   // blue-500
          focused: '#2563eb',    // blue-600
        },
        heatmap: {
          tier1: '#dc2626',      // red-600
          tier2: '#ea580c',      // orange-600
          tier3: '#ca8a04',      // yellow-600
          tier4: '#16a34a',      // green-600
        },
      },
    },
  },
  plugins: [],
}