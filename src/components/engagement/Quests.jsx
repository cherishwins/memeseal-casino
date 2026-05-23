import { useEffect } from 'react'
import { useEngagementStore } from '../../stores/engagementStore'

function QuestRow({ quest, progress, claimed, onClaim }) {
  const pct = Math.min(100, Math.round((progress / quest.target) * 100))
  const complete = progress >= quest.target

  return (
    <div className="bg-black/60 border border-matrix-green/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-casino text-sm text-matrix-green">{quest.label}</p>
          <p className="text-[11px] text-matrix-green/60">
            {Math.min(progress, quest.target).toLocaleString()} / {quest.target.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-casino-gold font-casino text-sm">+{quest.reward}</p>
          <p className="text-[10px] text-matrix-green/50">chips</p>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${quest.label} progress`}
        className="h-2 bg-matrix-green/10 rounded-full overflow-hidden mb-2"
      >
        <div
          className={`h-full transition-all duration-300 ${
            complete ? 'bg-frog-green' : 'bg-matrix-green/70'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {claimed ? (
        <p className="text-center text-xs text-frog-green">✓ CLAIMED</p>
      ) : (
        <button
          onClick={onClaim}
          disabled={!complete}
          className={`w-full text-xs font-casino py-2 rounded min-h-[36px] transition-all ${
            complete
              ? 'bg-casino-gold/20 border border-casino-gold text-casino-gold hover:bg-casino-gold/30'
              : 'bg-matrix-green/5 border border-matrix-green/20 text-matrix-green/40 cursor-not-allowed'
          }`}
          aria-label={complete ? `Claim ${quest.reward} chips for ${quest.label}` : `${quest.label} not yet complete`}
        >
          {complete ? 'CLAIM REWARD' : 'IN PROGRESS'}
        </button>
      )}
    </div>
  )
}

export default function Quests({ onClaim }) {
  const {
    rollQuestsIfStale,
    getQuests,
    questProgress,
    questsClaimed,
    claimQuestReward,
  } = useEngagementStore()

  useEffect(() => {
    rollQuestsIfStale()
  }, [rollQuestsIfStale])

  const quests = getQuests()

  const handleClaim = (tier, questId) => {
    const reward = claimQuestReward(tier, questId)
    if (reward > 0) {
      onClaim?.(reward)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
      }
    }
  }

  return (
    <div className="space-y-5">
      <section aria-labelledby="daily-quests-heading">
        <h3
          id="daily-quests-heading"
          className="font-casino text-sm neon-cyan mb-2 flex items-center justify-between"
        >
          <span>DAILY QUESTS</span>
          <span className="text-[10px] text-matrix-green/50">resets at midnight</span>
        </h3>
        <div className="space-y-2">
          {quests.daily.map((q) => (
            <QuestRow
              key={q.id}
              quest={q}
              progress={questProgress[q.id] || 0}
              claimed={questsClaimed.daily.includes(q.id)}
              onClaim={() => handleClaim('daily', q.id)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="weekly-quests-heading">
        <h3
          id="weekly-quests-heading"
          className="font-casino text-sm neon-pink mb-2 flex items-center justify-between"
        >
          <span>WEEKLY QUESTS</span>
          <span className="text-[10px] text-matrix-green/50">resets monday</span>
        </h3>
        <div className="space-y-2">
          {quests.weekly.map((q) => (
            <QuestRow
              key={q.id}
              quest={q}
              progress={questProgress[q.id] || 0}
              claimed={questsClaimed.weekly.includes(q.id)}
              onClaim={() => handleClaim('weekly', q.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
