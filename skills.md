# memeseal-casino Skills

## /dev
Start the Vite dev server: `npm run dev` → http://localhost:5173

## /build
Production build: `npm run build` → outputs to `dist/`

## /deploy
Deploy to Vercel: `npm run build && npx vercel --prod`
Then set the Web App URL in @BotFather.

## /lint
Run ESLint: `npm run lint`

## /theme <name>
Switch theme: set `VITE_THEME=<name>` in `.env` (memeseal | vegas | cyber)
Then restart dev server.

## /add-theme <name>
Add a new theme entry to `src/themes.js` following the existing pattern.

## /reset-demo
Clear localStorage in browser dev tools to reset demo chip balance to starting amount.
