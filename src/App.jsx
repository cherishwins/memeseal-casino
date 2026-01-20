import { useState, useEffect, lazy, Suspense, useCallback } from 'react'
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

// API base URL
const API_BASE = 'https://notaryton.com'

// Loading skeleton for games
function GameLoading() {
  return (
    <div className="game-card p-8 text-center animate-pulse">
      <div className="text-4xl mb-4">🎲</div>
      <p className="font-casino text-matrix-green">LOADING GAME...</p>
    </div>
  )
}

// Buy Chips Modal Component
function BuyChipsModal({ onClose, onPurchase, userId }) {
  const [loading, setLoading] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(100)

  const chipOptions = [
    { amount: 50, label: '50 ⭐', bonus: 0 },
    { amount: 100, label: '100 ⭐', bonus: 10, tag: '+10 FREE' },
    { amount: 500, label: '500 ⭐', bonus: 100, tag: 'BEST VALUE' },
  ]

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/casino/buy-chips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, amount: selectedAmount })
      })
      const data = await res.json()
      
      if (data.success && data.invoice_url) {
        // Open Telegram Stars payment
        if (window.Telegram?.WebApp?.openInvoice) {
          window.Telegram.WebApp.openInvoice(data.invoice_url, (status) => {
            if (status === 'paid') {
              onPurchase(selectedAmount)
              onClose()
            }
            setLoading(false)
          })
        } else {
          alert('Please open this app in Telegram to buy chips')
          setLoading(false)
        }
      } else {
        alert(data.error || 'Failed to create invoice')
        setLoading(false)
      }
    } catch (e) {
      console.error('Purchase error:', e)
      alert('Network error. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="game-card max-w-sm w-full p-6">
        <h2 className="font-casino text-2xl text-center neon-text mb-4">
          💰 BUY CHIPS
        </h2>
        
        <div className="space-y-3 mb-6">
          {chipOptions.map(opt => (
            <button
              key={opt.amount}
              onClick={() => setSelectedAmount(opt.amount)}
              className={`w-full p-4 rounded-lg border-2 transition-all flex justify-between items-center ${
                selectedAmount === opt.amount
                  ? 'border-casino-gold bg-casino-gold/20'
                  : 'border-matrix-green/30 hover:border-matrix-green'
              }`}
            >
              <span className="font-casino text-lg">{opt.label}</span>
              <div className="text-right">
                <span className="text-matrix-green">→ {opt.amount + opt.bonus} chips</span>
                {opt.tag && (
                  <span className="block text-xs text-casino-gold">{opt.tag}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full btn-casino btn-stars text-black py-4 text-xl disabled:opacity-50"
        >
          {loading ? '⏳ PROCESSING...' : `PAY ${selectedAmount} ⭐`}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-matrix-green/70 hover:text-matrix-green"
        >
          Cancel
        </button>

        <p className="text-xs text-center text-matrix-green/50 mt-4">
          1 Star = 1 Chip | 20% of bets feed lottery
        </p>
      </div>
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
  const [showBuyChips, setShowBuyChips] = useState(false)
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get Telegram user ID on mount
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      tg.setBackgroundColor('#0d0d0d')
      tg.setHeaderColor('#0d0d0d')
      
      // Get user ID from Telegram
      const user = tg.initDataUnsafe?.user
      if (user?.id) {
        setUserId(user.id)
      }
    }
    
    // Fallback: use wallet address hash or generate guest ID
    if (!userId && wallet?.account?.address) {
      // Hash wallet to consistent numeric ID
      const hash = wallet.account.address.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      setUserId(Math.abs(hash) % 1000000000)
    }
    
    // Guest fallback
    if (!userId) {
      const guestId = localStorage.getItem('casino_guest_id') || 
        Math.floor(Math.random() * 1000000000)
      localStorage.setItem('casino_guest_id', guestId)
      setUserId(parseInt(guestId))
    }
  }, [wallet])

  // Fetch user's chip balance
  const fetchBalance = useCallback(async () => {
    if (!userId) return
    
    try {
      const res = await fetch(`${API_BASE}/api/v1/casino/balance/${userId}`)
      const data = await res.json()
      if (data.success) {
        setBalance(data.chips)
      }
    } catch (e) {
      console.log('Using local balance')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchBalance()
    }
  }, [userId, fetchBalance])

  // Fetch pot size from API
  useEffect(() => {
    const fetchPot = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/lottery/pot`)
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

  // Handle real money bet
  const handleBet = async (betAmount, gameType, result, payout = 0) => {
    if (!userId) {
      alert('Please connect wallet or open in Telegram')
      return false
    }

    if (balance < betAmount) {
      setShowBuyChips(true)
      return false
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/casino/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          bet_amount: Math.floor(betAmount),
          game: gameType,
          result: result,
          payout: Math.floor(payout)
        })
      })
      const data = await res.json()
      
      if (data.success) {
        setBalance(data.chips)
        // Update pot display (20% of bet added)
        setPotSize(prev => prev + Math.floor(betAmount * 0.2))
        return true
      } else {
        if (data.error === 'Insufficient chips') {
          setShowBuyChips(true)
        }
        return false
      }
    } catch (e) {
      console.error('Bet error:', e)
      return false
    }
  }

  // Handle chip purchase callback
  const handleChipsPurchased = (amount) => {
    // Optimistic update - will be corrected on next fetch
    setBalance(prev => prev + amount)
    // Fetch real balance after a short delay
    setTimeout(fetchBalance, 2000)
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

      {/* Buy Chips Modal */}
      {showBuyChips && (
        <BuyChipsModal
          onClose={() => setShowBuyChips(false)}
          onPurchase={handleChipsPurchased}
          userId={userId}
        />
      )}

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

        {/* Balance Display - Now shows CHIPS */}
        <div className="text-center mb-6">
          <div className="inline-block game-card px-6 py-3">
            {loading ? (
              <span className="text-matrix-green/50 font-casino">LOADING...</span>
            ) : (
              <>
                <span className="text-casino-gold font-casino text-2xl">
                  {balance.toLocaleString()} CHIPS
                </span>
                {balance < 10 && (
                  <p className="text-xs text-red-400 mt-1">Low balance! Buy more chips</p>
                )}
              </>
            )}
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
                userId={userId}
              />
            </Suspense>
          </div>
        )}

        {/* Buy Chips Button */}
        <div className="mt-8 text-center">
          <button
            className="btn-casino btn-stars text-black text-lg py-3 px-8"
            onClick={() => setShowBuyChips(true)}
          >
            💰 BUY CHIPS WITH STARS
          </button>
          <p className="text-xs text-matrix-green/50 mt-2">
            20% of all bets feed the lottery pot 🐸
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
