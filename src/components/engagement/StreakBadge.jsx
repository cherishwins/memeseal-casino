import { useEngagementStore } from '../../stores/engagementStore'

export default function StreakBadge({ onClick }) {
  const { streak, canClaimDaily } = useEngagementStore()
  const claimable = canClaimDaily()

  return (
    <button
      onClick={onClick}
      aria-label={
        claimable
          ? `Claim today's daily reward. Current streak ${streak} days.`
          : `Login streak ${streak} days.`
      }
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 min-h-[44px]
        font-casino text-sm transition-all duration-200
        ${claimable
          ? 'border-casino-gold bg-casino-gold/20 text-casino-gold animate-pulse hover:scale-105'
          : 'border-matrix-green/40 bg-black/60 text-matrix-green hover:border-matrix-green'}
      `}
    >
      <span className="text-lg" aria-hidden="true">{streak >= 7 ? '🔥' : '📅'}</span>
      <span>
        {streak > 0 ? `${streak}d` : 'DAY 1'}
        {claimable && <span className="ml-1 text-casino-gold">●</span>}
      </span>
    </button>
  )
}
