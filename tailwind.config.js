/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F2F6F4',
          100: '#E2ECE6',
          200: '#C7DBD0',
          300: '#9FBFA9',
          400: '#6FA07E',
          500: '#478159',
          600: '#326743',
          700: '#285236',
          800: '#1F402B',
          900: '#173121',
          950: '#0B1B12',
        },
        sand: {
          50: '#FCFBF8',
          100: '#F7F5EE',
          200: '#EFECE0',
          300: '#DFD9C6',
          400: '#C7BD9F',
          500: '#B0A37D',
        },
        tezos: {
          blue: '#2C7DF7',
          dark: '#0E1E38',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px -1px rgba(0,0,0,0.05), 0 12px 24px -4px rgba(0,0,0,0.03)',
        'elevated': '0 0 0 1px rgba(0,0,0,0.05), 0 8px 24px -4px rgba(15,41,30,0.08), 0 24px 48px -12px rgba(15,41,30,0.06)',
      }
    },
  },
  plugins: [],
}
