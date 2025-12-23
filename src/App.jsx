import { useState, useEffect, lazy, Suspense } from 'react'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import MatrixRain from './components/MatrixRain'
import FrogDealer from './components/FrogDealer'
import LotteryCountdown from './components/LotteryCountdown'
import PotDisplay from './components/PotDisplay'
import LoyaltyCard from './components/LoyaltyCard'

// Lazy load games - only loaded when user selects them
const SlotsGame = lazy(() => import('./games/SlotsGame'))
const RouletteGame = lazy(() => import('./games/RouletteGame'))
const CrashGame = lazy(() => import('./games/CrashGame'))

// Loading skeleton for games
function GameLoading() {
  return (
    <div className="game-card p-8 text-center animate-pulse">
      <div className="text-4xl mb-4">🎲</div>
      <p className="font-casino text-matrix-green">LOADING GAME...</p>
    </div>
  )
}

function App() {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const [activeGame, setActiveGame] = useState(null)
  const [balance, setBalance] = useState(0)
  const [potSize, setPotSize] = useState(1337)
  const [showLoyalty, setShowLoyalty] = useState(false)

  // Telegram WebApp integration
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      tg.setBackgroundColor('#0d0d0d')
      tg.setHeaderColor('#0d0d0d')
    }
  }, [])

  // Fetch pot size from API
  useEffect(() => {
    const fetchPot = async () => {
      try {
        const res = await fetch('https://notaryton-bot.onrender.com/api/v1/lottery/pot')
        const data = await res.json()
        if (data.pot_stars) setPotSize(data.pot_stars)
      } catch (e) {
        console.log('Using mock pot size')
      }
    }
    fetchPot()
    const interval = setInterval(fetchPot, 30000)
    return () => clearInterval(interval)
  }, [])

  const connectWallet = async () => {
    try {
      await tonConnectUI.openModal()
    } catch (e) {
      console.error('Wallet connect error:', e)
    }
  }

  const handleBet = async (amount, gameType) => {
    // Add to global lottery pot
    setPotSize(prev => prev + Math.floor(amount * 0.2))

    // In production, call your backend
    try {
      await fetch('https://notaryton-bot.onrender.com/api/v1/casino/bet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: wallet?.account?.address || 'guest',
          amount,
          game: gameType
        })
      })
    } catch (e) {
      console.log('Bet logged locally')
    }
  }

  const games = [
    { id: 'slots', name: 'POLITICIAN SLOTS', icon: '🎰', component: SlotsGame },
    { id: 'roulette', name: 'ELECTION ROULETTE', icon: '🎯', component: RouletteGame },
    { id: 'crash', name: 'FROG ROCKET', icon: '🚀', component: CrashGame },
  ]

  const ActiveGameComponent = activeGame ? games.find(g => g.id === activeGame)?.component : null

  return (
    <div className="min-h-screen bg-matrix-dark relative overflow-hidden">
      <MatrixRain />

      {/* Main Content */}
      <div className="relative z-10 p-4 max-w-lg mx-auto">

        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="font-casino text-3xl font-black neon-text tracking-wider">
            MEMESEAL
          </h1>
          <p className="text-lg neon-pink font-casino">CASINO</p>
          <FrogDealer />
        </header>

        {/* Lottery Pot & Countdown */}
        <div className="mb-6 space-y-4">
          <PotDisplay potSize={potSize} />
          <LotteryCountdown />
        </div>

        {/* Wallet Connection */}
        <div className="mb-6 flex gap-2 justify-center">
          {wallet ? (
            <div className="game-card text-center px-4 py-2">
              <span className="text-xs text-matrix-green/70">CONNECTED</span>
              <p className="font-mono text-sm truncate max-w-[150px]">
                {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}
              </p>
            </div>
          ) : (
            <button onClick={connectWallet} className="btn-casino btn-ton">
              CONNECT TON WALLET
            </button>
          )}
          <button
            onClick={() => setShowLoyalty(!showLoyalty)}
            className="btn-casino btn-stars"
          >
            LOYALTY CARD
          </button>
        </div>

        {/* Loyalty Card Modal */}
        {showLoyalty && (
          <LoyaltyCard
            onClose={() => setShowLoyalty(false)}
            onCredit={(amount) => setBalance(prev => prev + amount)}
          />
        )}

        {/* Balance Display */}
        <div className="text-center mb-6">
          <div className="inline-block game-card px-6 py-2">
            <span className="text-casino-gold font-casino text-xl">
              BALANCE: {balance.toFixed(2)} TON
            </span>
          </div>
        </div>

        {/* Game Selection or Active Game */}
        {!activeGame ? (
          <div className="space-y-4">
            <h2 className="text-center font-casino text-xl neon-cyan mb-4">
              SELECT YOUR GAME
            </h2>
            {games.map(game => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="w-full game-card flex items-center justify-between p-4 hover:scale-102 transition-transform"
              >
                <span className="text-4xl">{game.icon}</span>
                <span className="font-casino text-lg">{game.name}</span>
                <span className="text-2xl">{'>'}</span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveGame(null)}
              className="mb-4 text-matrix-green hover:text-white transition-colors"
            >
              {'<'} BACK TO LOBBY
            </button>
            <Suspense fallback={<GameLoading />}>
              <ActiveGameComponent
                balance={balance}
                setBalance={setBalance}
                onBet={handleBet}
                wallet={wallet}
              />
            </Suspense>
          </div>
        )}

        {/* Pay with Stars */}
        <div className="mt-8 text-center">
          <button
            className="btn-casino btn-stars text-black"
            onClick={() => {
              // Telegram Stars payment - opens invoice
              if (window.Telegram?.WebApp?.openInvoice) {
                // In production, fetch invoice URL from backend
                // For now, show coming soon
                alert('Telegram Stars integration coming soon! Use TON wallet for now.')
              } else {
                alert('Please open this app in Telegram to buy chips with Stars')
              }
            }}
          >
            BUY CHIPS WITH STARS
          </button>
          <p className="text-xs text-matrix-green/50 mt-2">
            20% of all bets feed the lottery pot
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-matrix-green/30">
          <p>POWERED BY MEMESEAL x TON</p>
          <p>gamble responsibly you degen</p>
        </footer>
      </div>
    </div>
  )
}

export default App
