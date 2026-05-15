/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        admin:   '#3b82f6',
        mkt:     '#f97316',
        ceo:     '#22c55e',
        surface: '#13161f',
        surface2:'#1a1e2a',
        card:    '#161923',
        bdr:     '#252a38',
        neon: {
          orange: '#ff9d00',
          blue:   '#00f2ff',
          green:  '#39ff14',
          purple: '#bc13fe',
        }
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 242, 255, 0.4), inset 0 0 10px rgba(0, 242, 255, 0.2)',
        'neon-orange': '0 0 20px rgba(255, 157, 0, 0.4), inset 0 0 10px rgba(255, 157, 0, 0.2)',
        'neon-green': '0 0 20px rgba(57, 255, 20, 0.4), inset 0 0 10px rgba(57, 255, 20, 0.2)',
        'neon-purple': '0 0 20px rgba(188, 19, 254, 0.4), inset 0 0 10px rgba(188, 19, 254, 0.2)',
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      }
    }
  },
  plugins: []
}
