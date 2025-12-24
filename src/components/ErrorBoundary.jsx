import { Component } from 'react'

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })

    // Log to console in development
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)

    // In production, you'd send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.handleRetry
        })
      }

      // Default fallback
      return (
        <div className="p-6 rounded-lg border-2 border-red-600/50 bg-red-900/20 text-center">
          <div className="text-4xl mb-4">💥</div>
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Oops! Something crashed
          </h2>
          <p className="text-sm text-red-300/70 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-matrix-green/20 border border-matrix-green rounded-lg text-matrix-green hover:bg-matrix-green/30 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Game-specific Error Boundary with themed fallback
 */
export function GameErrorBoundary({ children, gameName = 'Game' }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="game-card text-center">
          <div className="text-6xl mb-4 animate-bounce">🐸💀</div>
          <h2 className="font-casino text-2xl text-red-500 mb-2">
            {gameName} CRASHED!
          </h2>
          <p className="text-sm text-matrix-green/50 mb-4">
            (Ironic, we know)
          </p>
          <p className="text-xs text-red-400/70 mb-4 font-mono">
            {error?.message?.slice(0, 100)}
          </p>
          <button
            onClick={resetError}
            className="btn-casino btn-stars text-black"
          >
            RESTART GAME
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * App-level Error Boundary
 */
export function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallback={({ resetError }) => (
        <div className="min-h-screen bg-matrix-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-xl border-2 border-red-600 bg-black/80 text-center">
            <div className="text-8xl mb-6">🔥</div>
            <h1 className="font-casino text-3xl text-red-500 mb-4">
              FATAL ERROR
            </h1>
            <p className="text-matrix-green/70 mb-6">
              The casino encountered a critical error.
              Your funds are safe - this is just a UI crash.
            </p>
            <div className="space-y-3">
              <button
                onClick={resetError}
                className="w-full py-3 bg-matrix-green/20 border border-matrix-green rounded-lg text-matrix-green hover:bg-matrix-green/30 transition-colors"
              >
                TRY AGAIN
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                FULL RELOAD
              </button>
              <a
                href="https://t.me/MemeSealTON"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-400 hover:bg-blue-900/50 transition-colors"
              >
                REPORT BUG
              </a>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
