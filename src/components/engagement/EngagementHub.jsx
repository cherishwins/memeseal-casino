import { useEffect, useState } from 'react'
import Quests from './Quests'
import Achievements from './Achievements'
import Leaderboard from './Leaderboard'
import ReferralCard from './ReferralCard'

const TABS = [
  { id: 'quests', label: 'QUESTS', emoji: '🎯' },
  { id: 'achievements', label: 'BADGES', emoji: '🏆' },
  { id: 'leaderboard', label: 'TOP 10', emoji: '👑' },
  { id: 'referral', label: 'INVITE', emoji: '📣' },
]

export default function EngagementHub({ onClose, onClaim, userId, brandName }) {
  const [tab, setTab] = useState('quests')

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-40 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="engagement-hub-title"
    >
      <div className="game-card w-full max-w-md max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-xl">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h2 id="engagement-hub-title" className="font-casino text-xl neon-text">
            REWARDS HUB
          </h2>
          <button
            onClick={onClose}
            aria-label="Close rewards hub"
            className="text-matrix-green/70 hover:text-matrix-green text-2xl leading-none w-11 h-11 -mr-2"
          >
            ×
          </button>
        </div>

        <div role="tablist" aria-label="Engagement sections" className="grid grid-cols-4 gap-1 mb-4 flex-shrink-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`py-2 px-1 rounded text-[10px] font-casino min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-all ${
                tab === t.id
                  ? 'bg-matrix-green/20 border border-matrix-green text-matrix-green'
                  : 'border border-matrix-green/20 text-matrix-green/50 hover:text-matrix-green'
              }`}
            >
              <span className="text-base" aria-hidden="true">{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="overflow-y-auto pr-1 flex-1">
          {tab === 'quests' && <Quests onClaim={onClaim} />}
          {tab === 'achievements' && <Achievements />}
          {tab === 'leaderboard' && <Leaderboard />}
          {tab === 'referral' && <ReferralCard userId={userId} brandName={brandName} />}
        </div>
      </div>
    </div>
  )
}
