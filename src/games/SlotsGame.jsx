import { useState, useEffect } from 'react'

// Politician symbols for the slot machine
const SYMBOLS = [
  { id: 'trump', emoji: '🍊', name: 'TRUMP' },
  { id: 'biden', emoji: '😴', name: 'BIDEN' },
  { id: 'harris', emoji: '💜', name: 'HARRIS' },
  { id: 'obama', emoji: '🏀', name: 'OBAMA' },
  { id: 'pelosi', emoji: '🍦', name: 'PELOSI' },
  { id: 'frog', emoji: '🐸', name: 'PEPE' },
  { id: 'rocket', emoji: '🚀', name: 'MOON' },
]

const PAYOUTS = {
  'frog-frog-frog': { multiplier: 100, name: 'TRIPLE PEPE JACKPOT' },
  'rocket-rocket-rocket': { multiplier: 50, name: 'TO THE MOON' },
  'trump-trump-trump': { multiplier: 25, name: 'MAGA WINNER' },
  'three-of-kind': { multiplier: 10, name: 'THREE OF A KIND' },
  'two-of-kind': { multiplier: 2, name: 'PAIR' },
}

const SlotsGame = ({ balance, setBalance, onBet }) => {
  const [reels, setReels] = useState([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]])
  const [spinning, setSpinning] = useState(false)
  const [betAmount, setBetAmount] = useState(0.1)
  const [result, setResult] = useState(null)
  const [spinningReels, setSpinningReels] = useState([false, false, false])

  const spin = async () => {
    if (balance < betAmount) {
      setResult({ message: 'INSUFFICIENT FUNDS', win: false })
      return
    }

    setBalance(prev => prev - betAmount)
    setSpinning(true)
    setResult(null)
    onBet(betAmount, 'slots')

    // Start all reels spinning
    setSpinningReels([true, true, true])

    // Simulate spinning animation
    const spinDurations = [1000, 1500, 2000]

    // Stop reels one by one
    for (let i = 0; i < 3; i++) {
      await new Promise(r => setTimeout(r, spinDurations[i]))
      const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      setReels(prev => {
        const newReels = [...prev]
        newReels[i] = randomSymbol
        return newReels
      })
      setSpinningReels(prev => {
        const newSpinning = [...prev]
        newSpinning[i] = false
        return newSpinning
      })
    }

    setSpinning(false)
  }

  // Check for wins after spinning stops
  useEffect(() => {
    if (!spinning && reels.every(r => r)) {
      checkWin()
    }
  }, [spinning])

  const checkWin = () => {
    const ids = reels.map(r => r.id)
    const key = ids.join('-')

    // Check for jackpots
    if (PAYOUTS[key]) {
      const payout = PAYOUTS[key]
      const winAmount = betAmount * payout.multiplier
      setBalance(prev => prev + winAmount)
      setResult({
        message: `${payout.name}! +${winAmount.toFixed(2)} TON`,
        win: true,
        big: payout.multiplier >= 25
      })
      return
    }

    // Check three of a kind
    if (ids[0] === ids[1] && ids[1] === ids[2]) {
      const winAmount = betAmount * 10
      setBalance(prev => prev + winAmount)
      setResult({ message: `THREE OF A KIND! +${winAmount.toFixed(2)} TON`, win: true })
      return
    }

    // Check pairs
    if (ids[0] === ids[1] || ids[1] === ids[2] || ids[0] === ids[2]) {
      const winAmount = betAmount * 2
      setBalance(prev => prev + winAmount)
      setResult({ message: `PAIR! +${winAmount.toFixed(2)} TON`, win: true })
      return
    }

    setResult({ message: 'TRY AGAIN', win: false })
  }

  return (
    <div className="game-card">
      <h2 className="text-center font-casino text-2xl neon-text mb-4">
        🎰 POLITICIAN SLOTS
      </h2>

      {/* Slot Machine */}
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-4 border-4 border-casino-gold">
        {/* Reels */}
        <div className="flex justify-center gap-2 mb-4">
          {reels.map((symbol, i) => (
            <div
              key={i}
              className={`slot-reel ${spinningReels[i] ? 'animate-pulse' : ''}`}
            >
              <span className={`slot-symbol ${spinningReels[i] ? 'animate-spin' : ''}`}>
                {spinningReels[i] ? '❓' : symbol.emoji}
              </span>
            </div>
          ))}
        </div>

        {/* Result Display */}
        {result && (
          <div className={`text-center p-2 rounded-lg mb-4 ${
            result.win
              ? result.big
                ? 'bg-casino-gold/20 border border-casino-gold animate-pulse'
                : 'bg-frog-green/20 border border-frog-green'
              : 'bg-red-900/20 border border-red-600'
          }`}>
            <p className={`font-casino ${result.win ? 'neon-gold' : 'text-red-500'}`}>
              {result.message}
            </p>
          </div>
        )}

        {/* Bet Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setBetAmount(prev => Math.max(0.01, prev - 0.1))}
            className="btn-casino px-3 py-1 text-sm"
            disabled={spinning}
          >
            -
          </button>
          <div className="text-center">
            <p className="text-xs text-matrix-green/70">BET</p>
            <p className="font-casino text-xl">{betAmount.toFixed(2)} TON</p>
          </div>
          <button
            onClick={() => setBetAmount(prev => prev + 0.1)}
            className="btn-casino px-3 py-1 text-sm"
            disabled={spinning}
          >
            +
          </button>
        </div>

        {/* Spin Button */}
        <button
          onClick={spin}
          disabled={spinning || balance < betAmount}
          className="w-full btn-casino btn-stars text-black text-xl py-4 disabled:opacity-50"
        >
          {spinning ? 'SPINNING...' : 'SPIN'}
        </button>
      </div>

      {/* Paytable */}
      <div className="mt-4 text-xs text-matrix-green/70">
        <p className="text-center mb-2 font-casino">PAYTABLE</p>
        <div className="grid grid-cols-2 gap-1">
          <span>🐸🐸🐸 = 100x</span>
          <span>🚀🚀🚀 = 50x</span>
          <span>🍊🍊🍊 = 25x</span>
          <span>3 of kind = 10x</span>
          <span>Pair = 2x</span>
        </div>
      </div>
    </div>
  )
}

export default SlotsGame
