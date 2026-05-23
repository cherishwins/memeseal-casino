import { useEffect, useState } from 'react'
import { useEngagementStore } from '../../stores/engagementStore'

export default function ReferralCard({ userId, brandName = 'MEMESEAL' }) {
  const { ensureReferralCode, referralCount, referralChipsEarned } = useEngagementStore()
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (userId) setCode(ensureReferralCode(userId))
  }, [userId, ensureReferralCode])

  const botUsername = import.meta.env.VITE_TG_BOT_USERNAME || 'your_bot'
  const link = `https://t.me/${botUsername}?start=ref_${code}`
  const shareMessage = `🎰 Join me on ${brandName} Casino — 750 free chips with my code: ${link}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const handleShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(
      shareMessage
    )}`
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(url)
    } else {
      window.open(url, '_blank', 'noopener')
    }
  }

  return (
    <div>
      <h3 className="font-casino text-sm neon-cyan mb-3">REFER + EARN</h3>

      <div className="bg-gradient-to-br from-neon-pink/20 to-casino-gold/10 border-2 border-casino-gold/50 rounded-xl p-4 mb-3">
        <p className="text-xs text-matrix-green/70 mb-1">YOUR REFERRAL CODE</p>
        <p className="font-casino text-2xl neon-gold tracking-widest mb-3">{code || '......'}</p>

        <div className="grid grid-cols-2 gap-2 text-center mb-3">
          <div className="bg-black/40 rounded p-2">
            <p className="text-[10px] text-matrix-green/60">FRIENDS JOINED</p>
            <p className="font-casino text-lg text-frog-green tabular-nums">{referralCount}</p>
          </div>
          <div className="bg-black/40 rounded p-2">
            <p className="text-[10px] text-matrix-green/60">CHIPS EARNED</p>
            <p className="font-casino text-lg text-casino-gold tabular-nums">
              {referralChipsEarned.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 btn-casino btn-stars text-black py-2 text-sm"
            aria-label="Share referral link to Telegram"
          >
            SHARE
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 py-2 text-sm font-casino border-2 border-matrix-green rounded-lg text-matrix-green hover:bg-matrix-green/10 min-h-[44px]"
            aria-label="Copy referral link to clipboard"
            aria-live="polite"
          >
            {copied ? '✓ COPIED' : 'COPY LINK'}
          </button>
        </div>
      </div>

      <ul className="text-xs text-matrix-green/70 space-y-1 list-disc list-inside">
        <li>Friend gets <span className="text-frog-green">+750 chips</span> on signup</li>
        <li>You get <span className="text-casino-gold">+200 chips</span> when they play</li>
        <li>Plus <span className="text-casino-gold">5%</span> of their lifetime chip purchases</li>
      </ul>
    </div>
  )
}
