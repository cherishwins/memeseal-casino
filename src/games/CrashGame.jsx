import { useState, useEffect, useRef } from 'react'

const CrashGame = ({ balance, setBalance, onBet }) => {
  const [betAmount, setBetAmount] = useState(0.1)
  const [multiplier, setMultiplier] = useState(1.0)
  const [gameState, setGameState] = useState('waiting') // waiting, flying, crashed, cashed
  const [betPlaced, setBetPlaced] = useState(false)
  const [crashPoint, setCrashPoint] = useState(null)
  const [history, setHistory] = useState([2.34, 1.12, 5.67, 1.89, 3.45])
  const [result, setResult] = useState(null)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  // Generate crash point (house edge ~3%)
  const generateCrashPoint = () => {
    const r = Math.random()
    // Formula gives exponential distribution with house edge
    return Math.max(1.0, (1 / (1 - r * 0.97)))
  }

  // Start the game
  const startGame = () => {
    if (betPlaced && balance < betAmount) {
      setResult({ message: 'INSUFFICIENT FUNDS', win: false })
      return
    }

    if (betPlaced) {
      setBalance(prev => prev - betAmount)
      onBet(betAmount, 'crash')
    }

    const crash = generateCrashPoint()
    setCrashPoint(crash)
    setMultiplier(1.0)
    setGameState('flying')
    setResult(null)

    // Animate multiplier
    let currentMultiplier = 1.0
    const startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      currentMultiplier = Math.pow(Math.E, elapsed * 0.5) // Exponential growth

      if (currentMultiplier >= crash) {
        // Crashed!
        setMultiplier(crash)
        setGameState('crashed')
        setHistory(prev => [crash, ...prev.slice(0, 4)])
        if (betPlaced) {
          setResult({ message: `CRASHED AT ${crash.toFixed(2)}x`, win: false })
        }
        setBetPlaced(false)
        return
      }

      setMultiplier(currentMultiplier)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Cash out
  const cashOut = () => {
    if (gameState !== 'flying' || !betPlaced) return

    cancelAnimationFrame(animationRef.current)
    const winAmount = betAmount * multiplier
    setBalance(prev => prev + winAmount)
    setGameState('cashed')
    setResult({
      message: `CASHED OUT AT ${multiplier.toFixed(2)}x! +${winAmount.toFixed(2)} TON`,
      win: true
    })
    setBetPlaced(false)
  }

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear
    ctx.fillStyle = '#0d0d0d'
    ctx.fillRect(0, 0, width, height)

    // Grid lines
    ctx.strokeStyle = '#00ff4130'
    ctx.lineWidth = 1
    for (let i = 0; i < 10; i++) {
      ctx.beginPath()
      ctx.moveTo(0, (height / 10) * i)
      ctx.lineTo(width, (height / 10) * i)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo((width / 10) * i, 0)
      ctx.lineTo((width / 10) * i, height)
      ctx.stroke()
    }

    // Draw curve
    if (gameState === 'flying' || gameState === 'crashed' || gameState === 'cashed') {
      ctx.beginPath()
      ctx.strokeStyle = gameState === 'crashed' ? '#ff4444' : '#00ff41'
      ctx.lineWidth = 3

      const maxX = Math.min(multiplier / 10, 1) * width
      const startY = height - 20

      ctx.moveTo(0, startY)

      for (let x = 0; x <= maxX; x += 2) {
        const progress = x / width
        const y = startY - (Math.pow(progress * 10, 1.5) / 10) * (height - 40)
        ctx.lineTo(x, Math.max(20, y))
      }

      ctx.stroke()

      // Draw rocket at end
      if (gameState !== 'crashed') {
        const rocketX = maxX
        const rocketY = startY - (Math.pow((maxX / width) * 10, 1.5) / 10) * (height - 40)
        ctx.font = '24px Arial'
        ctx.fillText('🚀', rocketX - 12, Math.max(30, rocketY))
      } else {
        // Explosion
        ctx.font = '30px Arial'
        ctx.fillText('💥', maxX - 15, height / 2)
      }
    }
  }, [multiplier, gameState])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Auto-restart game after crash
  useEffect(() => {
    if (gameState === 'crashed' || gameState === 'cashed') {
      const timeout = setTimeout(() => {
        setGameState('waiting')
        setMultiplier(1.0)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [gameState])

  return (
    <div className="game-card">
      <h2 className="text-center font-casino text-2xl neon-text mb-4">
        🚀 FROG ROCKET
      </h2>

      {/* Multiplier Display */}
      <div className={`text-center mb-4 p-4 rounded-lg ${
        gameState === 'crashed'
          ? 'bg-red-900/30 border border-red-600'
          : gameState === 'cashed'
          ? 'bg-frog-green/30 border border-frog-green'
          : 'bg-black/50 border border-matrix-green'
      }`}>
        <p className={`font-casino text-5xl ${
          gameState === 'crashed' ? 'text-red-500' : 'neon-text'
        }`}>
          {multiplier.toFixed(2)}x
        </p>
        <p className="text-sm text-matrix-green/70">
          {gameState === 'waiting' && 'PLACE YOUR BET'}
          {gameState === 'flying' && 'FLYING...'}
          {gameState === 'crashed' && 'CRASHED!'}
          {gameState === 'cashed' && 'CASHED OUT!'}
        </p>
      </div>

      {/* Graph */}
      <div className="crash-graph mb-4 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={320}
          height={200}
          className="w-full"
        />
      </div>

      {/* Result */}
      {result && (
        <div className={`text-center p-2 rounded-lg mb-4 ${
          result.win
            ? 'bg-frog-green/20 border border-frog-green'
            : 'bg-red-900/20 border border-red-600'
        }`}>
          <p className={`font-casino ${result.win ? 'neon-gold' : 'text-red-500'}`}>
            {result.message}
          </p>
        </div>
      )}

      {/* History */}
      <div className="flex justify-center gap-2 mb-4">
        {history.map((h, i) => (
          <span
            key={i}
            className={`text-xs px-2 py-1 rounded ${
              h >= 2 ? 'bg-frog-green/30 text-frog-green' : 'bg-red-900/30 text-red-500'
            }`}
          >
            {h.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* Bet Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => setBetAmount(prev => Math.max(0.01, prev - 0.1))}
          className="btn-casino px-3 py-1 text-sm"
          disabled={gameState === 'flying'}
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
          disabled={gameState === 'flying'}
        >
          +
        </button>
      </div>

      {/* Bet Toggle */}
      {gameState === 'waiting' && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setBetPlaced(!betPlaced)}
            className={`flex-1 py-2 rounded-lg border-2 transition-all ${
              betPlaced
                ? 'bg-frog-green/30 border-frog-green'
                : 'bg-black/50 border-matrix-green/30'
            }`}
          >
            {betPlaced ? 'BET PLACED ✓' : 'PLACE BET'}
          </button>
        </div>
      )}

      {/* Action Button */}
      {gameState === 'waiting' && (
        <button
          onClick={startGame}
          className="w-full btn-casino btn-stars text-black text-xl py-4"
        >
          START ROUND
        </button>
      )}

      {gameState === 'flying' && betPlaced && (
        <button
          onClick={cashOut}
          className="w-full btn-casino bg-gradient-to-r from-green-500 to-green-300 text-black text-xl py-4 animate-pulse"
        >
          CASH OUT ({(betAmount * multiplier).toFixed(2)} TON)
        </button>
      )}

      {gameState === 'flying' && !betPlaced && (
        <div className="text-center text-matrix-green/50 py-4">
          Watching round...
        </div>
      )}

      {(gameState === 'crashed' || gameState === 'cashed') && (
        <div className="text-center text-matrix-green/50 py-4">
          Next round starting...
        </div>
      )}

      {/* Info */}
      <p className="text-center text-xs text-matrix-green/50 mt-4">
        Cash out before the frog crashes! Higher multiplier = bigger risk 🐸🚀
      </p>
    </div>
  )
}

export default CrashGame
