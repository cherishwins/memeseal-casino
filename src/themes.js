// Theme presets — swap by setting VITE_THEME in your .env (memeseal | vegas | cyber)
// Each theme defines symbols, payouts, jackpot names, and roulette bet labels.
// Add your own theme by adding another entry below and wiring it via env.

const THEMES = {
  memeseal: {
    brand: { name: 'MEMESEAL', tagline: 'CASINO', footer: 'POWERED BY MEMESEAL x TON' },
    slotsSymbols: [
      { id: 'frog', emoji: '🐸', name: 'PEPE' },
      { id: 'rocket', emoji: '🚀', name: 'MOON' },
      { id: 'diamond', emoji: '💎', name: 'DIAMOND' },
      { id: 'fire', emoji: '🔥', name: 'FIRE' },
      { id: 'lightning', emoji: '⚡', name: 'BOLT' },
      { id: 'crown', emoji: '👑', name: 'KING' },
      { id: 'gem', emoji: '💰', name: 'BAG' },
    ],
    slotsJackpots: {
      'frog-frog-frog': { multiplier: 100, name: 'TRIPLE PEPE JACKPOT' },
      'rocket-rocket-rocket': { multiplier: 50, name: 'TO THE MOON' },
      'diamond-diamond-diamond': { multiplier: 25, name: 'DIAMOND HANDS' },
    },
    rouletteBets: [
      { id: 'red', label: 'RED', emoji: '🔴', color: 'bg-red-600', multiplier: 2, weight: 0.45 },
      { id: 'blue', label: 'BLUE', emoji: '🔵', color: 'bg-blue-600', multiplier: 2, weight: 0.45 },
      { id: 'frog', label: 'PEPE', emoji: '🐸', color: 'bg-green-600', multiplier: 14, weight: 0.10 },
    ],
  },

  vegas: {
    brand: { name: 'NEON VEGAS', tagline: 'HIGH ROLLER LOUNGE', footer: 'WHAT HAPPENS HERE, STAYS HERE' },
    slotsSymbols: [
      { id: 'seven', emoji: '7️⃣', name: 'LUCKY 7' },
      { id: 'cherry', emoji: '🍒', name: 'CHERRY' },
      { id: 'bell', emoji: '🔔', name: 'BELL' },
      { id: 'bar', emoji: '🅱️', name: 'BAR' },
      { id: 'lemon', emoji: '🍋', name: 'LEMON' },
      { id: 'diamond', emoji: '💎', name: 'DIAMOND' },
      { id: 'horse', emoji: '🐴', name: 'HORSE' },
    ],
    slotsJackpots: {
      'seven-seven-seven': { multiplier: 100, name: 'TRIPLE 7s JACKPOT' },
      'diamond-diamond-diamond': { multiplier: 50, name: 'DIAMOND TRIO' },
      'bell-bell-bell': { multiplier: 25, name: 'BELL RINGER' },
    },
    rouletteBets: [
      { id: 'red', label: 'RED', emoji: '🟥', color: 'bg-red-700', multiplier: 2, weight: 0.48 },
      { id: 'black', label: 'BLACK', emoji: '⬛', color: 'bg-gray-900', multiplier: 2, weight: 0.48 },
      { id: 'green', label: 'GREEN 0', emoji: '🟢', color: 'bg-green-700', multiplier: 35, weight: 0.04 },
    ],
  },

  cyber: {
    brand: { name: 'CHROMECITY', tagline: 'NEURAL CASINO', footer: 'CHROMED OUT // JACK IN' },
    slotsSymbols: [
      { id: 'chip', emoji: '🧠', name: 'BRAIN CHIP' },
      { id: 'eye', emoji: '👁️', name: 'OPTIC' },
      { id: 'circuit', emoji: '🔌', name: 'CIRCUIT' },
      { id: 'robot', emoji: '🤖', name: 'NETRUNNER' },
      { id: 'skull', emoji: '💀', name: 'GHOST' },
      { id: 'rocket', emoji: '🚀', name: 'LAUNCH' },
      { id: 'lightning', emoji: '⚡', name: 'JOLT' },
    ],
    slotsJackpots: {
      'chip-chip-chip': { multiplier: 100, name: 'BRAINBURN JACKPOT' },
      'skull-skull-skull': { multiplier: 50, name: 'GHOST IN THE WIRE' },
      'rocket-rocket-rocket': { multiplier: 25, name: 'LAUNCH SEQUENCE' },
    },
    rouletteBets: [
      { id: 'corpo', label: 'CORPO', emoji: '🏢', color: 'bg-cyan-700', multiplier: 2, weight: 0.45 },
      { id: 'edge', label: 'EDGE', emoji: '🗡️', color: 'bg-purple-700', multiplier: 2, weight: 0.45 },
      { id: 'ghost', label: 'GHOST', emoji: '💀', color: 'bg-pink-700', multiplier: 14, weight: 0.10 },
    ],
  },
};

// Shown in the header of every theme (src/components/PlayMoneyNotice.jsx).
// Game outcomes are decided in the browser, so this kit is play money only.
// Keep it unless outcomes, balances and auth are server-side and you hold a
// gambling license (README, "Demo / play-money only").
export const PLAY_MONEY_NOTICE = {
  headline: 'Play money — demo only, no real-value prizes',
  detail: 'Chips have no cash value and nothing here can be cashed out.',
};

const themeName = import.meta.env.VITE_THEME || 'memeseal';
export const THEME = THEMES[themeName] || THEMES.memeseal;
export const AVAILABLE_THEMES = Object.keys(THEMES);
