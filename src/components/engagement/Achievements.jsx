import { useEngagementStore } from '../../stores/engagementStore'

export default function Achievements() {
  const { achievements, ACHIEVEMENTS } = useEngagementStore()

  const unlocked = achievements.length
  const total = ACHIEVEMENTS.length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-casino text-sm neon-cyan">ACHIEVEMENTS</h3>
        <span className="text-xs text-matrix-green/60 font-casino">
          {unlocked}/{total}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = achievements.includes(a.id)
          return (
            <div
              key={a.id}
              className={`
                aspect-square rounded-lg border-2 p-2 flex flex-col items-center justify-center
                text-center transition-all duration-200
                ${isUnlocked
                  ? 'border-casino-gold bg-casino-gold/10 hover:scale-105'
                  : 'border-matrix-green/20 bg-black/40 opacity-50 grayscale'}
              `}
              role="img"
              aria-label={
                isUnlocked
                  ? `${a.label}: ${a.desc} — unlocked`
                  : `${a.label}: ${a.desc} — locked`
              }
              title={`${a.label} — ${a.desc}`}
            >
              <span className="text-2xl" aria-hidden="true">
                {isUnlocked ? a.emoji : '🔒'}
              </span>
              <span
                className={`text-[10px] font-casino mt-1 leading-tight ${
                  isUnlocked ? 'text-casino-gold' : 'text-matrix-green/40'
                }`}
              >
                {a.label}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-[10px] text-matrix-green/40 text-center mt-3">
        Tap and hold a badge for details.
      </p>
    </div>
  )
}
