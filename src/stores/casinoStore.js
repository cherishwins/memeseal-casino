import { create } from 'zustand';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://notaryton-bot.onrender.com';

export const useCasinoStore = create((set, get) => ({
  balance: 0,
  isLoading: false,
  error: null,

  fetchBalance: async (userId) => {
    if (!userId) return;
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/casino/balance/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.error || 'Failed to fetch balance');
      }
      set({ balance: data.chips || 0, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch casino balance:", error);
      set({ error: error.message, isLoading: false, balance: 0 });
    }
  },

  buyChips: async (userId, amountChips = 100) => {
    if (!userId) {
      alert('Please connect your wallet or open in Telegram to buy chips.');
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/casino/buy-chips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, amount_chips: amountChips }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.error || 'Failed to create invoice');
      }
      
      // Open Telegram Stars invoice
      if (window.Telegram?.WebApp?.openInvoice) {
        window.Telegram.WebApp.openInvoice(data.invoice_url, (status) => {
          if (status === 'paid') {
            // Refresh balance after successful payment
            setTimeout(() => get().fetchBalance(userId), 1000);
          }
        });
      } else {
        // Fallback: open invoice link in new tab
        window.open(data.invoice_url, '_blank');
        alert('Complete the payment in Telegram, then refresh to see your chips!');
      }
      set({ isLoading: false });
    } catch (error) {
      console.error("Failed to buy chips:", error);
      set({ error: error.message, isLoading: false });
      alert('Failed to create invoice: ' + error.message);
    }
  },

  placeBet: async (userId, betAmount, gameType, winAmount = 0) => {
    if (!userId) return { success: false, error: 'No user ID' };
    
    // Optimistically update balance
    const currentBalance = get().balance;
    const netChange = winAmount - betAmount;
    set({ balance: Math.max(0, currentBalance + netChange) });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/casino/bet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          bet_amount: betAmount,
          win_amount: winAmount,
          game: gameType,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success === false) {
        // Revert optimistic update
        set({ balance: currentBalance });
        throw new Error(data.error || 'Failed to place bet');
      }
      
      // Refresh actual balance from server
      setTimeout(() => get().fetchBalance(userId), 500);
      return data;
    } catch (error) {
      console.error("Failed to place bet:", error);
      // Revert optimistic update
      set({ balance: currentBalance });
      return { success: false, error: error.message };
    }
  },

  // Add chips locally (for testing/demo mode)
  addChipsLocal: (amount) => {
    set((state) => ({ balance: state.balance + amount }));
  },

  // Reset store
  reset: () => {
    set({ balance: 0, isLoading: false, error: null });
  },
}));
