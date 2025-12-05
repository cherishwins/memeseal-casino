import { useState } from 'react'

const RouletteGame = ({ balance, setBalance, onBet }) => {
  const [selectedBet, setSelectedBet] = useState(null)
  const [betAmount, setBetAmount] = useState(0.1)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [wheelRotation, setWheelRotation] = useState(0)

  const betOptions = [
    { id: 'trump', label: 'TRUMP', emoji: '🍊', color: 'bg-trump-red', multiplier: 2 },
    { id: 'harris', label: 'HARRIS', emoji: '💜', color: 'bg-harris-blue', multiplier: 2 },
    { id: 'pepe', label: 'PEPE', emoji: '🐸', color: 'bg-frog-green', multiplier: 14 },
  ]

  const spin = async () => {
    if (!selectedBet) {
      setResult({ message: 'SELECT A BET FIRST', win: false })
      return
    }
    if (balance < betAmount) {
      setResult({ message: 'INSUFFICIENT FUNDS', win: false })
      return
    }

    setBalance(prev => prev - betAmount)
    setSpinning(true)
    setResult(null)
    onBet(betAmount, 'roulette')

    // Spin animation
    const spins = 5 + Math.random() * 3
    const finalRotation = wheelRotation + (spins * 360)
    setWheelRotation(finalRotation)

    await new Promise(r => setTimeout(r, 3000))

    // Determine result (weighted: 45% Trump, 45% Harris, 10% Pepe)
    const rand = Math.random()
    let winner
    if (rand < 0.45) winner = 'trump'
    else if (rand < 0.90) winner = 'harris'
    else winner = 'pepe'

    setSpinning(false)

    // Check win
    if (winner === selectedBet) {
      const bet = betOptions.find(b => b.id === selectedBet)
      const winAmount = betAmount * bet.multiplier
      setBalance(prev => prev + winAmount)
      setResult({
        message: `${bet.emoji} ${bet.label} WINS! +${winAmount.toFixed(2)} TON`,
        win: true,
        winner
      })
    } else {
      const winnerBet = betOptions.find(b => b.id === winner)
      setResult({
        message: `${winnerBet.emoji} ${winnerBet.label} wins. You lose.`,
        win: false,
        winner
      })
    }
  }

  return (
    <div className="game-card">
      <h2 className="text-center font-casino text-2xl neon-text mb-4">
        🎯 ELECTION ROULETTE
      </h2>

      {/* Roulette Wheel */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Wheel */}
          <div
            className="w-48 h-48 rounded-full border-4 border-casino-gold relative overflow-hidden transition-transform duration-3000 ease-out"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              background: 'conic-gradient(from 0deg, #ff4444 0deg 120deg, #4444ff 120deg 240deg, #39ff14 240deg 360deg)'
            }}
          >
            {/* Wheel segments labels */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black border-2 border-casino-gold flex items-center justify-center">
                <span className="text-2xl">{spinning ? '?' : result?.winner ? betOptions.find(b => b.id === result.winner)?.emoji : '🎯'}</span>
              </div>
            </div>
          </div>

          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl">
            ▼
          </div>
        </div>
      </div>

      {/* Bet Options */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {betOptions.map(bet => (
          <button
            key={bet.id}
            onClick={() => !spinning && setSelectedBet(bet.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedBet === bet.id
                ? 'border-casino-gold scale-105 shadow-lg'
                : 'border-matrix-green/30 hover:border-matrix-green'
            } ${bet.color}`}
            disabled={spinning}
          >
            <div className="text-2xl mb-1">{bet.emoji}</div>
            <div className="text-xs font-casino">{bet.label}</div>
            <div className="text-xs opacity-70">{bet.multiplier}x</div>
          </button>
        ))}
      </div>

      {/* Result Display */}
      {result && (
        <div className={`text-center p-3 rounded-lg mb-4 ${
          result.win
            ? 'bg-frog-green/20 border border-frog-green'
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
        disabled={spinning || !selectedBet || balance < betAmount}
        className="w-full btn-casino btn-stars text-black text-xl py-4 disabled:opacity-50"
      >
        {spinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
      </button>

      {/* Info */}
      <p className="text-center text-xs text-matrix-green/50 mt-4">
        Pick your candidate. 🍊 Trump or 💜 Harris = 2x | 🐸 Pepe = 14x (rare!)
      </p>
    </div>
  )
}

export default RouletteGame
