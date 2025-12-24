import { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Trail, Float, Text, useTexture, Html } from '@react-three/drei'
import * as THREE from 'three'

// Frog Rocket Component
function FrogRocket({ multiplier, crashed, position }) {
  const rocketRef = useRef()
  const flameRef = useRef()

  // Animate rocket wobble
  useFrame((state) => {
    if (rocketRef.current && !crashed) {
      rocketRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.05
      rocketRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 8) * 0.03
    }
  })

  // Animate flame
  useFrame((state) => {
    if (flameRef.current && !crashed) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.3
      flameRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.2
    }
  })

  if (crashed) return null

  return (
    <group ref={rocketRef} position={position}>
      {/* Rocket Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial
          color="#00ff41"
          emissive="#00ff41"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Frog Face */}
      <mesh position={[0, 0.3, 0.25]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#00aa30" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 0.4, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.08, 0.4, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.08, 0.42, 0.36]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.08, 0.42, 0.36]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Rocket Fins */}
      <mesh position={[-0.3, -0.4, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.3, -0.4, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.2} />
      </mesh>

      {/* Flame */}
      <group ref={flameRef} position={[0, -0.7, 0]}>
        <mesh>
          <coneGeometry args={[0.25, 0.8, 8]} />
          <meshStandardMaterial
            color="#ff8800"
            emissive="#ff4400"
            emissiveIntensity={2}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <coneGeometry args={[0.15, 0.5, 8]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffaa00"
            emissiveIntensity={3}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </group>
  )
}

// Explosion Effect
function Explosion({ position }) {
  const groupRef = useRef()
  const [particles] = useState(() =>
    Array.from({ length: 30 }, () => ({
      position: [0, 0, 0],
      velocity: [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ],
      scale: Math.random() * 0.3 + 0.1,
      color: Math.random() > 0.5 ? '#ff4444' : '#ff8800'
    }))
  )

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const p = particles[i]
        child.position.x += p.velocity[0] * delta * 3
        child.position.y += p.velocity[1] * delta * 3
        child.position.z += p.velocity[2] * delta * 3
        child.scale.multiplyScalar(0.97)
      })
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {particles.map((p, i) => (
        <mesh key={i} scale={p.scale}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  )
}

// Trail of Particles
function RocketTrail({ multiplier, crashed }) {
  const trailRef = useRef()

  useFrame(() => {
    if (trailRef.current && !crashed) {
      trailRef.current.rotation.y += 0.01
    }
  })

  if (crashed || multiplier < 1.1) return null

  const height = Math.min(multiplier * 0.5, 10)

  return (
    <group ref={trailRef}>
      {/* Glow trail */}
      <mesh position={[0, -height/2, 0]}>
        <cylinderGeometry args={[0.02, 0.1, height, 8]} />
        <meshStandardMaterial
          color="#00ff41"
          emissive="#00ff41"
          emissiveIntensity={1}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}

// Multiplier Text
function MultiplierDisplay({ multiplier, crashed }) {
  return (
    <Text
      position={[0, 3, 0]}
      fontSize={1}
      color={crashed ? '#ff4444' : '#00ff41'}
      anchorX="center"
      anchorY="middle"
      font="/fonts/Inter-Bold.woff"
    >
      {multiplier.toFixed(2)}x
    </Text>
  )
}

// Main 3D Scene
function CrashScene({ multiplier, gameState, crashed }) {
  const rocketY = useMemo(() => {
    return Math.min(Math.log(multiplier + 1) * 2, 8)
  }, [multiplier])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff41" />

      {/* Stars Background */}
      <Stars
        radius={50}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={crashed ? 0 : 2}
      />

      {/* Grid Floor */}
      <gridHelper
        args={[50, 50, '#00ff4130', '#00ff4110']}
        position={[0, -3, 0]}
      />

      {/* Rocket with Trail */}
      {gameState !== 'waiting' && (
        <Trail
          width={2}
          length={8}
          color={crashed ? '#ff4444' : '#00ff41'}
          attenuation={(t) => t * t}
        >
          <Float
            speed={crashed ? 0 : 3}
            rotationIntensity={crashed ? 0 : 0.5}
            floatIntensity={crashed ? 0 : 0.5}
          >
            <FrogRocket
              multiplier={multiplier}
              crashed={crashed}
              position={[0, rocketY, 0]}
            />
          </Float>
        </Trail>
      )}

      {/* Explosion */}
      {crashed && (
        <Explosion position={[0, rocketY, 0]} />
      )}

      {/* Trail particles */}
      <RocketTrail multiplier={multiplier} crashed={crashed} />
    </>
  )
}

// Loading Fallback
function LoadingFallback() {
  return (
    <Html center>
      <div className="text-matrix-green font-mono">Loading 3D...</div>
    </Html>
  )
}

// Main Component
const CrashGame3D = ({ balance, setBalance, onBet }) => {
  const [betAmount, setBetAmount] = useState(0.1)
  const [multiplier, setMultiplier] = useState(1.0)
  const [gameState, setGameState] = useState('waiting')
  const [betPlaced, setBetPlaced] = useState(false)
  const [crashPoint, setCrashPoint] = useState(null)
  const [history, setHistory] = useState([2.34, 1.12, 5.67, 1.89, 3.45])
  const [result, setResult] = useState(null)
  const animationRef = useRef(null)

  const crashed = gameState === 'crashed'

  // Generate crash point
  const generateCrashPoint = () => {
    const r = Math.random()
    return Math.max(1.0, (1 / (1 - r * 0.97)))
  }

  // Start game
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

    let currentMultiplier = 1.0
    const startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      currentMultiplier = Math.pow(Math.E, elapsed * 0.5)

      if (currentMultiplier >= crash) {
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Auto-restart
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
        FROG ROCKET 3D
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

      {/* 3D Canvas */}
      <div className="w-full h-[250px] rounded-lg overflow-hidden mb-4 bg-black">
        <Canvas
          camera={{ position: [0, 2, 10], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <CrashScene
              multiplier={multiplier}
              gameState={gameState}
              crashed={crashed}
            />
          </Suspense>
        </Canvas>
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
      <div className="flex justify-center gap-2 mb-4" role="list" aria-label="Recent crash history">
        {history.map((h, i) => (
          <span
            key={i}
            role="listitem"
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
          aria-label="Decrease bet"
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
          aria-label="Increase bet"
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
            aria-pressed={betPlaced}
          >
            {betPlaced ? 'BET PLACED' : 'PLACE BET'}
          </button>
        </div>
      )}

      {/* Action Buttons */}
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
        Cash out before the frog crashes! Higher multiplier = bigger risk
      </p>
    </div>
  )
}

export default CrashGame3D
