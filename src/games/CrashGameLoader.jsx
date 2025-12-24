import { lazy, Suspense, useState, useEffect } from 'react'

// Lazy load both versions
const CrashGame2D = lazy(() => import('./CrashGame'))
const CrashGame3D = lazy(() => import('./CrashGame3D'))

/**
 * Detects GPU capabilities to determine if 3D should be enabled
 */
function shouldUse3D() {
  // SSR safety
  if (typeof window === 'undefined') return false

  try {
    // Check for WebGL2 support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return false

    // Check device memory (if available)
    const memory = navigator.deviceMemory || 4
    if (memory < 4) return false

    // Check CPU cores
    const cores = navigator.hardwareConcurrency || 4
    if (cores < 4) return false

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return false

    // Check GPU renderer for low-end detection
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      // Exclude known low-end GPUs
      if (/swiftshader|llvmpipe|softpipe/i.test(renderer)) return false
    }

    // Check max texture size as quality indicator
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
    if (maxTextureSize < 4096) return false

    return true
  } catch (e) {
    console.warn('[CrashGame] GPU detection failed:', e)
    return false
  }
}

// Loading skeleton
function CrashGameSkeleton() {
  return (
    <div className="game-card animate-pulse">
      <div className="h-8 bg-matrix-green/20 rounded mb-4 mx-auto w-48"></div>
      <div className="h-24 bg-matrix-green/10 rounded mb-4"></div>
      <div className="h-48 bg-black/50 rounded mb-4"></div>
      <div className="h-10 bg-matrix-green/20 rounded"></div>
    </div>
  )
}

/**
 * Smart Crash Game Loader
 * Automatically loads 2D or 3D version based on device capabilities
 */
export default function CrashGameLoader(props) {
  const [use3D, setUse3D] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Detect on client side
    const canUse3D = shouldUse3D()
    setUse3D(canUse3D)
    setIsLoading(false)

    // Log for debugging
    console.log(`[CrashGame] Using ${canUse3D ? '3D' : '2D'} mode`)
  }, [])

  // Error boundary fallback
  if (error) {
    return (
      <div className="game-card text-center">
        <p className="text-red-500 mb-4">Game failed to load</p>
        <button
          onClick={() => {
            setError(null)
            setUse3D(false) // Fall back to 2D
          }}
          className="btn-casino"
        >
          Try 2D Mode
        </button>
      </div>
    )
  }

  if (isLoading) {
    return <CrashGameSkeleton />
  }

  const GameComponent = use3D ? CrashGame3D : CrashGame2D

  return (
    <Suspense fallback={<CrashGameSkeleton />}>
      <GameComponent
        {...props}
        onError={(e) => setError(e)}
      />
    </Suspense>
  )
}

// Export detection function for use elsewhere
export { shouldUse3D }
