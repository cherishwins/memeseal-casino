import { useMemo, useState } from 'react'
import { useEngagementStore } from '../../stores/engagementStore'

// Sample data only: names and scores are generated here, not read from a
// backend. The UI labels the board "SAMPLE DATA" so nobody mistakes it for real
// players. Keep the label until this reads real rankings from a server.
const MOCK_NAMES = [
  'PEPE_KING', 'ROCKETMAN', 'DIAMOND4', 'FROG_GOD',
  'WAGMI_42', 'CHAD_77', 'NEONOPS', 'CYBR_PUNK',
  'TG_WHALE', 'STARLORD', 'CHIPLORD', 'SCALPER',
  'KEKMASTER', 'NGMI_LOL', 'SIGMA_99', 'TONLORD',
]

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateBoard(tab) {
  const today = new Date().toISOString().slice(0, 10)
  const seed = tab === 'today' ? Date.parse(today) / 86400000 : tab === 'streaks' ? 7 : 42
  return MOCK_NAMES.slice(0, 10).map((name, i) => {
    const base = seededRandom(seed + i)
    let value
    if (tab === 'today') value = Math.floor(5000 + base * 45000) - i * 800
    else if (tab === 'lifetime') value = Math.floor(80000 + base * 900000) - i * 12000
    else value = Math.floor(50 - base * 5) - i
    return { name, value: Math.max(value, tab === 'streaks' ? 7 : 1000) }
  })
}

export default function Leaderboard() {
  const [tab, setTab] = useState('today')
  const { streak } = useEngagementStore()

  const board = useMemo(() => generateBoard(tab), [tab])
  const labelMap = {
    today: { unit: 'chips won', formatter: (v) => v.toLocaleString() },
    lifetime: { unit: 'lifetime chips', formatter: (v) => v.toLocaleString() },
    streaks: { unit: 'days', formatter: (v) => `${v}d` },
  }
  const { unit, formatter } = labelMap[tab]

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3 className="font-casino text-sm neon-cyan">LEADERBOARD</h3>
        <span className="font-casino text-[10px] font-bold uppercase tracking-wide text-casino-gold border border-casino-gold/60 rounded px-1.5 py-0.5">
          Sample data
        </span>
      </div>
      <p className="text-[10px] text-matrix-green/50 mb-3">
        Generated names and scores, not real players. No prizes are awarded.
      </p>

      <div role="tablist" aria-label="Leaderboard categories" className="flex gap-1 mb-3">
        {[
          { id: 'today', label: 'TODAY' },
          { id: 'lifetime', label: 'ALL-TIME' },
          { id: 'streaks', label: 'STREAKS' },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 text-xs font-casino rounded transition-all min-h-[36px] ${
              tab === t.id
                ? 'bg-matrix-green/20 border border-matrix-green text-matrix-green'
                : 'border border-matrix-green/20 text-matrix-green/50 hover:text-matrix-green'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ol className="space-y-1" aria-label={`Sample top 10 by ${unit}, not real players`}>
        {board.map((row, i) => {
          const isPodium = i < 3
          const medal = ['🥇', '🥈', '🥉'][i]
          return (
            <li
              key={row.name}
              className={`flex items-center justify-between p-2 rounded ${
                isPodium ? 'bg-casino-gold/5 border border-casino-gold/30' : 'bg-black/40'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-casino text-xs text-matrix-green/60 w-6 text-center">
                  {medal || `#${i + 1}`}
                </span>
                <span className="font-mono text-xs text-matrix-green truncate">{row.name}</span>
              </div>
              <span
                className={`font-casino text-xs tabular-nums ${
                  isPodium ? 'text-casino-gold' : 'text-frog-green'
                }`}
              >
                {formatter(row.value)}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="mt-3 pt-3 border-t border-matrix-green/20 flex items-center justify-between gap-2">
        <span className="font-casino text-xs text-matrix-green/60">
          Your streak: {streak} day{streak === 1 ? '' : 's'}
        </span>
        <span className="text-[10px] text-matrix-green/40 text-right">
          Sample board. Wire to your backend.
        </span>
      </div>
    </div>
  )
}
