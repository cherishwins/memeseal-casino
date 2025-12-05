import { useState } from 'react'

const LoyaltyCard = ({ onClose, onCredit }) => {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (code.length !== 7) {
      setStatus('Code must be 7 digits')
      return
    }

    setLoading(true)
    setStatus('Validating...')

    // Simulate API call - always gives 5 TON testnet for now
    await new Promise(r => setTimeout(r, 1500))

    // In production, validate against backend
    setStatus('SUCCESS! +5 TON credited!')
    onCredit(5)
    setLoading(false)

    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 7)
    setCode(value)
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="game-card border-casino-gold max-w-sm w-full">
        <div className="text-center">
          <h2 className="font-casino text-xl neon-gold mb-4">
            LOYALTY CARD
          </h2>

          {/* Card Visual */}
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-900 rounded-xl p-4 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 right-2 text-6xl">🐸</div>
            </div>
            <div className="relative">
              <p className="text-xs text-yellow-200/70 text-left">MEMESEAL VIP</p>
              <div className="mt-4">
                <input
                  type="text"
                  value={code}
                  onChange={handleChange}
                  placeholder="0000000"
                  className="loyalty-input w-full"
                  maxLength={7}
                />
              </div>
              <p className="text-xs text-yellow-200/50 mt-2 text-right">
                {code.length}/7 digits
              </p>
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <p className={`mb-4 text-sm ${status.includes('SUCCESS') ? 'text-frog-green' : 'text-neon-pink'}`}>
              {status}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 btn-casino bg-gray-800 border-gray-600"
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || code.length !== 7}
              className="flex-1 btn-casino btn-stars disabled:opacity-50"
            >
              {loading ? 'CHECKING...' : 'REDEEM'}
            </button>
          </div>

          <p className="text-xs text-matrix-green/30 mt-4">
            Enter your 7-digit loyalty code to claim rewards
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoyaltyCard
