/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F5E6CA',
          DEFAULT: '#D4AF37',
          dark: '#B38B1B',
          glow: 'rgba(212, 175, 55, 0.35)',
        },
        dark: {
          950: '#070709',
          900: '#0C0C10',
          850: '#111116',
          800: '#16161F',
          750: '#1E1E2A',
          700: '#282836',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.22)',
        'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.35)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5E6CA 0%, #D4AF37 50%, #AA7C11 100%)',
        'dark-gradient': 'linear-gradient(180deg, #111116 0%, #070709 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(28,28,38,0.7) 0%, rgba(14,14,19,0.9) 100%)',
      }
    },
  },
  plugins: [],
}
