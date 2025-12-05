import { useState, useEffect } from 'react'

const LotteryCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const getNextSunday = () => {
      const now = new Date()
      const daysUntilSunday = (7 - now.getDay()) % 7 || 7
      const nextSunday = new Date(now)
      nextSunday.setDate(now.getDate() + daysUntilSunday)
      nextSunday.setUTCHours(20, 0, 0, 0) // 20:00 UTC (8pm)
      return nextSunday
    }

    const updateCountdown = () => {
      const now = new Date()
      const target = getNextSunday()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-black border-2 border-neon-pink rounded-lg px-3 py-2 min-w-[60px]">
        <span className="font-casino text-2xl text-neon-pink">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-neon-pink/70 mt-1">{label}</span>
    </div>
  )

  return (
    <div className="game-card border-neon-pink">
      <h3 className="text-center font-casino text-sm neon-pink mb-3">
        NEXT LOTTERY DRAW
      </h3>
      <div className="flex justify-center gap-2">
        <TimeBlock value={timeLeft.days} label="DAYS" />
        <span className="text-neon-pink text-2xl self-start mt-2">:</span>
        <TimeBlock value={timeLeft.hours} label="HRS" />
        <span className="text-neon-pink text-2xl self-start mt-2">:</span>
        <TimeBlock value={timeLeft.minutes} label="MIN" />
        <span className="text-neon-pink text-2xl self-start mt-2">:</span>
        <TimeBlock value={timeLeft.seconds} label="SEC" />
      </div>
      <p className="text-center text-xs text-matrix-green/50 mt-3">
        Every Sunday 20:00 UTC
      </p>
    </div>
  )
}

export default LotteryCountdown
