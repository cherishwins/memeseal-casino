import { useState, useEffect } from 'react'

const PotDisplay = ({ potSize }) => {
  const [displayValue, setDisplayValue] = useState(0)

  // Animated counter effect
  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = (potSize - displayValue) / steps
    let current = displayValue

    const timer = setInterval(() => {
      current += increment
      if ((increment > 0 && current >= potSize) || (increment < 0 && current <= potSize)) {
        setDisplayValue(potSize)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [potSize])

  const tonValue = (displayValue * 0.001).toFixed(4)

  return (
    <div className="game-card border-casino-gold bg-gradient-to-b from-black to-yellow-900/20">
      <div className="text-center">
        <h3 className="font-casino text-sm text-casino-gold/70 mb-1">
          GLOBAL LOTTERY POT
        </h3>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">🏆</span>
          <div>
            <p className="font-casino text-3xl neon-gold animate-pulse">
              {displayValue.toLocaleString()}
            </p>
            <p className="text-casino-gold/70 text-sm">STARS</p>
          </div>
          <span className="text-3xl">🏆</span>
        </div>
        <p className="text-lg text-neon-cyan mt-2">
          ~{tonValue} TON
        </p>
        <div className="mt-3 flex justify-center gap-4 text-xs text-matrix-green/50">
          <span>🎰 Every bet = entry</span>
          <span>🐸 20% feeds pot</span>
        </div>
      </div>
    </div>
  )
}

export default PotDisplay
