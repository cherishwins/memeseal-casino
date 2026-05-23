import { useEffect, useMemo, useState } from 'react'
import { useEngagementStore } from '../../stores/engagementStore'

function Confetti({ count = 32 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1.4 + Math.random() * 0.8,
        rotation: Math.random() * 360,
        color: ['#00ff41', '#ffd700', '#ff00ff', '#00ffff', '#39ff14'][i % 5],
        size: 6 + Math.random() * 6,
      })),
    [count]
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 will-change-transform"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-out forwards`,
          }}
        />
      ))}
    </div>
  )
}

export default function WinCelebration({ multiplier, payout, onClose, onShare }) {
  const [phase, setPhase] = useState('intro')
  const [displayValue, setDisplayValue] = useState(0)
  const { clearBigWin } = useEngagementStore()

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('count'), 400)
    const t2 = setTimeout(() => setPhase('share'), 1800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'count') return
    const start = Date.now()
    const duration = 1100
    const id = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3)
      setDisplayValue(Math.floor(payout * eased))
      if (pct >= 1) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [phase, payout])

  const handleClose = () => {
    clearBigWin()
    onClose?.()
  }

  const handleShare = () => {
    onShare?.({ multiplier, payout })
    handleClose()
  }

  const isJackpot = multiplier >= 50

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Big win: ${multiplier.toFixed(1)} times multiplier, ${payout} chips`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
    >
      <Confetti count={isJackpot ? 56 : 32} />

      <div className="relative game-card border-casino-gold max-w-md w-full text-center overflow-hidden">
        <div
          className={`absolute inset-0 -z-10 ${
            isJackpot ? 'bg-gradient-to-br from-casino-gold/30 via-neon-pink/20 to-transparent' : 'bg-gradient-to-br from-frog-green/20 to-transparent'
          }`}
        />

        <p className="font-casino text-xs neon-pink mb-1 tracking-widest">
          {isJackpot ? 'JACKPOT' : 'BIG WIN'}
        </p>
        <p
          className={`font-casino text-5xl sm:text-6xl neon-gold leading-none mb-3 ${
            phase === 'intro' ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
          } transition-all duration-300`}
        >
          {multiplier.toFixed(2)}×
        </p>

        <p className="font-casino text-3xl text-frog-green tabular-nums mb-5">
          +{displayValue.toLocaleString()} CHIPS
        </p>

        {phase === 'share' ? (
          <div className="space-y-2">
            <button
              onClick={handleShare}
              className="w-full btn-casino btn-stars text-black py-3"
              aria-label="Share this win to Telegram"
            >
              SHARE TO TELEGRAM
            </button>
            <button
              onClick={handleClose}
              className="w-full text-matrix-green/70 hover:text-matrix-green py-2 min-h-[44px]"
            >
              Keep playing
            </button>
          </div>
        ) : (
          <div className="h-12" />
        )}
      </div>
    </div>
  )
}
