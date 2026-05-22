// Casino configuration - edit these to customize your build
//
// DEMO_MODE: when true, the app runs entirely client-side with localStorage.
// No backend required. Perfect for showcasing, testing, and selling.
// Set VITE_DEMO_MODE=false in your .env to connect to a real backend.

export const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === undefined
    ? true
    : import.meta.env.VITE_DEMO_MODE !== 'false';

export const API_BASE =
  import.meta.env.VITE_API_URL || 'https://your-backend.example.com';

export const STARTING_CHIPS = Number(import.meta.env.VITE_STARTING_CHIPS) || 500;

export const HOUSE_EDGE = 0.03;

export const LOTTERY_CUT = 0.20;

import { THEME } from './themes';

export const BRAND = {
  name: import.meta.env.VITE_BRAND_NAME || THEME.brand.name,
  tagline: import.meta.env.VITE_BRAND_TAGLINE || THEME.brand.tagline,
  footer: import.meta.env.VITE_BRAND_FOOTER || THEME.brand.footer,
};

const LS_BALANCE_KEY = 'casino_demo_balance';
const LS_POT_KEY = 'casino_demo_pot';

export const demoStorage = {
  getBalance() {
    const raw = localStorage.getItem(LS_BALANCE_KEY);
    if (raw === null) {
      localStorage.setItem(LS_BALANCE_KEY, String(STARTING_CHIPS));
      return STARTING_CHIPS;
    }
    return Number(raw) || 0;
  },
  setBalance(value) {
    localStorage.setItem(LS_BALANCE_KEY, String(Math.max(0, Math.floor(value))));
  },
  addBalance(delta) {
    const next = Math.max(0, this.getBalance() + delta);
    this.setBalance(next);
    return next;
  },
  getPot() {
    const raw = localStorage.getItem(LS_POT_KEY);
    return raw === null ? 1337 : Number(raw) || 0;
  },
  addPot(delta) {
    const next = Math.max(0, this.getPot() + delta);
    localStorage.setItem(LS_POT_KEY, String(next));
    return next;
  },
  reset() {
    localStorage.removeItem(LS_BALANCE_KEY);
    localStorage.removeItem(LS_POT_KEY);
  },
};
