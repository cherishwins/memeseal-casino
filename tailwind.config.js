/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matrix-green': '#00ff41',
        'matrix-dark': '#0d0d0d',
        'neon-pink': '#ff00ff',
        'neon-cyan': '#00ffff',
        'frog-green': '#39ff14',
        'casino-gold': '#ffd700',
        'trump-red': '#ff4444',
        'harris-blue': '#4444ff',
      },
      fontFamily: {
        'matrix': ['Share Tech Mono', 'monospace'],
        'casino': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'matrix-rain': 'matrix 20s linear infinite',
        'neon-pulse': 'neon 1.5s ease-in-out infinite alternate',
        'slot-spin': 'spin 0.1s linear infinite',
        'rocket-fly': 'rocket 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        neon: {
          'from': { textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41' },
          'to': { textShadow: '0 0 20px #00ff41, 0 0 30px #00ff41, 0 0 40px #00ff41' }
        },
        glow: {
          'from': { boxShadow: '0 0 20px #00ff41, 0 0 30px #00ff41' },
          'to': { boxShadow: '0 0 30px #39ff14, 0 0 50px #39ff14' }
        },
        rocket: {
          '0%, 100%': { transform: 'translateY(0) rotate(45deg)' },
          '50%': { transform: 'translateY(-20px) rotate(45deg)' }
        }
      }
    },
  },
  plugins: [],
}
