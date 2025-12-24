import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Main Game Store using Zustand
 * Manages global game state without prop drilling
 */

export const useGameStore = create(
  persist(
    (set, get) => ({
      // User State
      balance: 0,
      userId: null,
      walletAddress: null,
      isConnected: false,

      // Lottery State
      potSize: 1337,
      nextDrawTime: null,
      ticketCount: 0,

      // Game State
      activeGame: null,
      gameHistory: [],

      // UI State
      showLoyalty: false,
      showSettings: false,
      soundEnabled: true,
      hapticEnabled: true,

      // Actions - User
      setBalance: (balance) => set({ balance }),
      addBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
      subtractBalance: (amount) => set((state) => ({
        balance: Math.max(0, state.balance - amount)
      })),

      setWallet: (address) => set({
        walletAddress: address,
        isConnected: !!address
      }),

      disconnectWallet: () => set({
        walletAddress: null,
        isConnected: false
      }),

      // Actions - Lottery
      setPotSize: (size) => set({ potSize: size }),
      incrementPot: (amount) => set((state) => ({
        potSize: state.potSize + amount
      })),
      addTicket: () => set((state) => ({
        ticketCount: state.ticketCount + 1
      })),

      // Actions - Game
      setActiveGame: (game) => set({ activeGame: game }),
      clearActiveGame: () => set({ activeGame: null }),

      addGameResult: (result) => set((state) => ({
        gameHistory: [result, ...state.gameHistory.slice(0, 49)]
      })),

      // Actions - UI
      toggleLoyalty: () => set((state) => ({ showLoyalty: !state.showLoyalty })),
      toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleHaptic: () => set((state) => ({ hapticEnabled: !state.hapticEnabled })),

      // Computed - Get recent results for specific game
      getGameHistory: (gameType) => {
        const { gameHistory } = get()
        return gameHistory.filter((r) => r.game === gameType).slice(0, 10)
      },

      // Reset
      reset: () => set({
        balance: 0,
        activeGame: null,
        gameHistory: [],
        ticketCount: 0
      }),
    }),
    {
      name: 'memeseal-casino-storage',
      partialize: (state) => ({
        // Only persist these fields
        userId: state.userId,
        soundEnabled: state.soundEnabled,
        hapticEnabled: state.hapticEnabled,
        gameHistory: state.gameHistory.slice(0, 20), // Limit persisted history
      }),
    }
  )
)

/**
 * Betting Store - Separate store for bet-related state
 * Keeps betting logic isolated
 */
export const useBetStore = create((set, get) => ({
  currentBet: 0.1,
  minBet: 0.01,
  maxBet: 100,

  setBet: (amount) => set((state) => ({
    currentBet: Math.max(state.minBet, Math.min(state.maxBet, amount))
  })),

  incrementBet: (step = 0.1) => set((state) => ({
    currentBet: Math.min(state.maxBet, state.currentBet + step)
  })),

  decrementBet: (step = 0.1) => set((state) => ({
    currentBet: Math.max(state.minBet, state.currentBet - step)
  })),

  doubleBet: () => set((state) => ({
    currentBet: Math.min(state.maxBet, state.currentBet * 2)
  })),

  halveBet: () => set((state) => ({
    currentBet: Math.max(state.minBet, state.currentBet / 2)
  })),

  maxBetAction: () => {
    const { maxBet } = get()
    const balance = useGameStore.getState().balance
    set({ currentBet: Math.min(maxBet, balance) })
  },
}))

/**
 * UI Store - For transient UI state
 */
export const useUIStore = create((set) => ({
  isLoading: false,
  error: null,
  notification: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  showNotification: (message, type = 'info') => {
    set({ notification: { message, type, id: Date.now() } })
    // Auto-clear after 3 seconds
    setTimeout(() => set({ notification: null }), 3000)
  },
  clearNotification: () => set({ notification: null }),
}))

// Selectors for optimized re-renders
export const selectBalance = (state) => state.balance
export const selectIsConnected = (state) => state.isConnected
export const selectActiveGame = (state) => state.activeGame
export const selectPotSize = (state) => state.potSize
