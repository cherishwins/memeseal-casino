import { useEffect, useState } from 'react'
import { useEngagementStore } from '../../stores/engagementStore'

export default function DailyReward({ onClose, onClaim }) {
  const { streak, lastClaimDay, canClaimDaily, claimDailyReward, DAILY_LADDER } =
    useEngagementStore()
  const [animatingChips, setAnimatingChips] = useState(null)

  const todaySlotIndex = streak % DAILY_LADDER.length

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleClaim = () => {
    const result = claimDailyReward()
    if (!result.claimed) return
    setAnimatingChips(result.chips)
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
    }
    onClaim?.(result.chips)
    setTimeout(() => onClose?.(), 1400)
  }

  const claimable = canClaimDaily()

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-reward-title"
    >
      <div className="game-card border-casino-gold max-w-md w-full">
        <div className="flex items-start justify-between mb-2">
          <h2 id="daily-reward-title" className="font-casino text-2xl neon-gold">
            DAILY REWARD
          </h2>
          <button
            onClick={onClose}
            aria-label="Close daily reward"
            className="text-matrix-green/70 hover:text-matrix-green text-2xl leading-none w-11 h-11 -mr-2 -mt-2"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-matrix-green/70 mb-4">
          Streak:{' '}
          <span className="font-casino text-frog-green">{streak} day{streak === 1 ? '' : 's'}</span>
          {streak >= 7 && <span className="text-casino-gold ml-2">🔥 +10%/week</span>}
        </p>

        <div className="grid grid-cols-7 gap-2 mb-5">
          {DAILY_LADDER.map((amount, i) => {
            const claimed = i < todaySlotIndex
            const isToday = i === todaySlotIndex && claimable
            const isJackpot = i === DAILY_LADDER.length - 1
            return (
              <div
                key={i}
                className={`
                  relative rounded-lg border-2 p-2 text-center
                  transition-all duration-200
                  ${claimed ? 'border-matrix-green/30 bg-matrix-green/10 opacity-60' : ''}
                  ${isToday ? 'border-casino-gold bg-casino-gold/15 animate-pulse' : ''}
                  ${!claimed && !isToday ? 'border-matrix-green/20 bg-black/40' : ''}
                  ${isJackpot && !claimed ? 'border-neon-pink/60' : ''}
                `}
              >
                <div className="text-[10px] text-matrix-green/60 font-casino">D{i + 1}</div>
                <div className={`text-xs mt-1 font-bold ${isJackpot ? 'text-neon-pink' : 'text-casino-gold'}`}>
                  {amount >= 1000 ? `${amount / 1000}k` : amount}
                </div>
                {claimed && (
                  <div className="absolute inset-0 flex items-center justify-center text-frog-green text-xl">
                    ✓
                  </div>
                )}
                {isJackpot && !claimed && (
                  <div className="text-[9px] text-neon-pink mt-0.5">+🎟</div>
                )}
              </div>
            )
          })}
        </div>

        {animatingChips !== null ? (
          <div className="text-center py-4">
            <p className="font-casino text-3xl neon-gold animate-bounce">
              +{animatingChips.toLocaleString()} CHIPS
            </p>
            <p className="text-sm text-frog-green mt-2">claimed — see you tomorrow 🐸</p>
          </div>
        ) : claimable ? (
          <button
            onClick={handleClaim}
            className="w-full btn-casino btn-stars text-black text-lg py-3"
            aria-label={`Claim day ${todaySlotIndex + 1} reward of ${DAILY_LADDER[todaySlotIndex]} chips`}
          >
            CLAIM DAY {todaySlotIndex + 1} → +{DAILY_LADDER[todaySlotIndex].toLocaleString()} CHIPS
          </button>
        ) : (
          <div className="text-center py-3">
            <p className="text-matrix-green/70 text-sm">
              Already claimed today.
            </p>
            <p className="text-xs text-matrix-green/50 mt-1">
              Come back tomorrow — day {(todaySlotIndex % DAILY_LADDER.length) + 1} unlocks{' '}
              {DAILY_LADDER[todaySlotIndex % DAILY_LADDER.length].toLocaleString()} chips.
            </p>
          </div>
        )}

        <p className="text-[10px] text-matrix-green/40 text-center mt-4">
          Streak resets if you skip a day. Day 7 includes a free lottery ticket.
        </p>
      </div>
    </div>
  )
}
