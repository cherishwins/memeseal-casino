import { useState, useEffect } from 'react'

const FrogDealer = () => {
  const [message, setMessage] = useState('')

  const messages = [
    "ribbit... place your bets",
    "the house always wins... jk we're frogs",
    "WAGMI or we croak trying",
    "feeling lucky, anon?",
    "20% goes to the pot, 100% goes to vibes",
    "ngmi if you don't spin",
    "ser, this is a casino",
  ]

  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)])
    const interval = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center my-4">
      {/* Frog ASCII Art */}
      <div className="frog-dealer text-2xl mb-2 animate-bounce">
        <pre className="text-frog-green text-xs leading-none">
{`    @..@
   (----)
  ( >__< )
  ^^ ~~ ^^`}
        </pre>
      </div>

      {/* Speech Bubble */}
      <div className="relative bg-black/80 border border-matrix-green rounded-lg px-4 py-2 max-w-xs">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-matrix-green" />
        <p className="text-sm text-center text-matrix-green italic">
          "{message}"
        </p>
      </div>
    </div>
  )
}

export default FrogDealer
