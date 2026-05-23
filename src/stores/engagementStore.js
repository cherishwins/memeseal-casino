import { create } from 'zustand';

const LS_KEY = 'casino_engagement_v1';

const DAILY_LADDER = [100, 150, 250, 400, 600, 900, 2000];

const DEFAULT_QUESTS = {
  daily: [
    { id: 'play5', label: 'Play 5 rounds', target: 5, reward: 50, kind: 'plays' },
    { id: 'winstreak3', label: 'Win 3 in a row', target: 3, reward: 100, kind: 'winStreak' },
    { id: 'bet500', label: 'Bet 500 chips total', target: 500, reward: 75, kind: 'wagered' },
  ],
  weekly: [
    { id: 'allgames', label: 'Play all 3 games', target: 3, reward: 500, kind: 'uniqueGames' },
    { id: 'crash5x', label: 'Hit a 5x+ on Crash', target: 1, reward: 250, kind: 'crash5x' },
    { id: 'slots3kind', label: 'Get 3-of-a-kind on Slots', target: 1, reward: 1000, kind: 'slotsJackpot' },
  ],
};

const ACHIEVEMENTS = [
  { id: 'firstBlood', label: 'First Blood', desc: 'Win your first round', emoji: '🩸' },
  { id: 'frogGod', label: 'Frog God', desc: 'Hit the triple-PEPE jackpot', emoji: '🐸' },
  { id: 'diamondHands', label: 'Diamond Hands', desc: 'Cash out 10x+ on Crash', emoji: '💎' },
  { id: 'whale', label: 'Whale', desc: 'Place a single bet of 1,000+', emoji: '🐋' },
  { id: 'streak7', label: 'Week One', desc: '7-day login streak', emoji: '🔥' },
  { id: 'streak30', label: 'OG', desc: '30-day login streak', emoji: '👑' },
  { id: 'sharer', label: 'Evangelist', desc: 'Refer your first player', emoji: '📣' },
];

function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function weekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dayKey(d);
}

function daysBetween(a, b) {
  const ms = 1000 * 60 * 60 * 24;
  return Math.round((Date.parse(b) - Date.parse(a)) / ms);
}

function defaultState() {
  return {
    streak: 0,
    lastClaimDay: null,
    freezesAvailable: 1,
    freezesUsedAt: null,
    questProgress: {},
    questsClaimed: { daily: [], weekly: [] },
    questsDayKey: dayKey(),
    questsWeekKey: weekKey(),
    achievements: [],
    referralCode: null,
    referralCount: 0,
    referralChipsEarned: 0,
    referredBy: null,
    winStreakCounter: 0,
    uniqueGamesPlayed: [],
    lastBigWin: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function persist(state) {
  const serializable = {
    streak: state.streak,
    lastClaimDay: state.lastClaimDay,
    freezesAvailable: state.freezesAvailable,
    freezesUsedAt: state.freezesUsedAt,
    questProgress: state.questProgress,
    questsClaimed: state.questsClaimed,
    questsDayKey: state.questsDayKey,
    questsWeekKey: state.questsWeekKey,
    achievements: state.achievements,
    referralCode: state.referralCode,
    referralCount: state.referralCount,
    referralChipsEarned: state.referralChipsEarned,
    referredBy: state.referredBy,
    winStreakCounter: state.winStreakCounter,
    uniqueGamesPlayed: state.uniqueGamesPlayed,
    lastBigWin: state.lastBigWin,
  };
  localStorage.setItem(LS_KEY, JSON.stringify(serializable));
}

export const useEngagementStore = create((set, get) => ({
  ...loadState(),

  ACHIEVEMENTS,
  DAILY_LADDER,

  rollQuestsIfStale: () => {
    const today = dayKey();
    const thisWeek = weekKey();
    const s = get();
    let mutated = false;
    let questProgress = { ...s.questProgress };
    let questsClaimed = { ...s.questsClaimed };
    let uniqueGamesPlayed = s.uniqueGamesPlayed;

    if (s.questsDayKey !== today) {
      DEFAULT_QUESTS.daily.forEach((q) => {
        questProgress[q.id] = 0;
      });
      questsClaimed.daily = [];
      mutated = true;
    }
    if (s.questsWeekKey !== thisWeek) {
      DEFAULT_QUESTS.weekly.forEach((q) => {
        questProgress[q.id] = 0;
      });
      questsClaimed.weekly = [];
      uniqueGamesPlayed = [];
      mutated = true;
    }
    if (mutated) {
      const next = {
        ...s,
        questProgress,
        questsClaimed,
        questsDayKey: today,
        questsWeekKey: thisWeek,
        uniqueGamesPlayed,
      };
      persist(next);
      set(next);
    }
  },

  canClaimDaily: () => {
    const s = get();
    return s.lastClaimDay !== dayKey();
  },

  claimDailyReward: () => {
    const s = get();
    const today = dayKey();
    if (s.lastClaimDay === today) return { claimed: false, chips: 0 };

    let nextStreak = 1;
    if (s.lastClaimDay) {
      const gap = daysBetween(s.lastClaimDay, today);
      if (gap === 1) nextStreak = s.streak + 1;
      else if (gap > 1) nextStreak = 1;
    }

    const ladderIndex = (nextStreak - 1) % DAILY_LADDER.length;
    const weeksCompleted = Math.floor((nextStreak - 1) / DAILY_LADDER.length);
    const multiplier = 1 + Math.min(weeksCompleted * 0.1, 0.5);
    const baseReward = DAILY_LADDER[ladderIndex];
    const chips = Math.floor(baseReward * multiplier);

    const next = {
      ...s,
      streak: nextStreak,
      lastClaimDay: today,
    };

    if (nextStreak === 7 && !s.achievements.includes('streak7')) {
      next.achievements = [...s.achievements, 'streak7'];
    }
    if (nextStreak === 30 && !s.achievements.includes('streak30')) {
      next.achievements = [...next.achievements, 'streak30'];
    }

    persist(next);
    set(next);
    return { claimed: true, chips, day: ladderIndex + 1, streak: nextStreak };
  },

  trackBet: ({ betAmount, gameId, didWin, payout }) => {
    const s = get();
    get().rollQuestsIfStale();
    const fresh = get();
    const questProgress = { ...fresh.questProgress };

    questProgress.play5 = (questProgress.play5 || 0) + 1;
    questProgress.bet500 = (questProgress.bet500 || 0) + betAmount;

    let winStreakCounter = didWin ? fresh.winStreakCounter + 1 : 0;
    if (didWin) {
      questProgress.winstreak3 = Math.max(questProgress.winstreak3 || 0, winStreakCounter);
    } else {
      questProgress.winstreak3 = questProgress.winstreak3 || 0;
    }

    let uniqueGamesPlayed = fresh.uniqueGamesPlayed;
    if (gameId && !uniqueGamesPlayed.includes(gameId)) {
      uniqueGamesPlayed = [...uniqueGamesPlayed, gameId];
      questProgress.allgames = uniqueGamesPlayed.length;
    }

    let achievements = [...fresh.achievements];
    if (didWin && !achievements.includes('firstBlood')) achievements.push('firstBlood');
    if (betAmount >= 1000 && !achievements.includes('whale')) achievements.push('whale');

    const multiplier = didWin ? payout / Math.max(betAmount, 1) : 0;

    if (gameId === 'crash' && multiplier >= 5) questProgress.crash5x = 1;
    if (gameId === 'crash' && multiplier >= 10 && !achievements.includes('diamondHands')) {
      achievements.push('diamondHands');
    }
    if (gameId === 'slots' && multiplier >= 25) {
      questProgress.slotsJackpot = 1;
      if (multiplier >= 100 && !achievements.includes('frogGod')) achievements.push('frogGod');
    }

    let lastBigWin = fresh.lastBigWin;
    if (didWin && multiplier >= 5) {
      lastBigWin = { multiplier, payout, at: Date.now(), gameId };
    }

    const next = {
      ...fresh,
      questProgress,
      winStreakCounter,
      uniqueGamesPlayed,
      achievements,
      lastBigWin,
    };
    persist(next);
    set(next);
  },

  markCrashCashout: (multiplier) => {
    const s = get();
    get().rollQuestsIfStale();
    const fresh = get();
    const questProgress = { ...fresh.questProgress };
    let achievements = [...fresh.achievements];

    if (multiplier >= 5) questProgress.crash5x = 1;
    if (multiplier >= 10 && !achievements.includes('diamondHands')) achievements.push('diamondHands');

    const next = { ...fresh, questProgress, achievements };
    persist(next);
    set(next);
  },

  markSlotsJackpot: () => {
    const s = get();
    get().rollQuestsIfStale();
    const fresh = get();
    const questProgress = { ...fresh.questProgress, slotsJackpot: 1 };
    let achievements = [...fresh.achievements];
    if (!achievements.includes('frogGod')) achievements.push('frogGod');
    const next = { ...fresh, questProgress, achievements };
    persist(next);
    set(next);
  },

  claimQuestReward: (tier, questId) => {
    const s = get();
    const list = tier === 'daily' ? DEFAULT_QUESTS.daily : DEFAULT_QUESTS.weekly;
    const quest = list.find((q) => q.id === questId);
    if (!quest) return 0;
    if (s.questsClaimed[tier].includes(questId)) return 0;
    const progress = s.questProgress[questId] || 0;
    if (progress < quest.target) return 0;

    const next = {
      ...s,
      questsClaimed: {
        ...s.questsClaimed,
        [tier]: [...s.questsClaimed[tier], questId],
      },
    };
    persist(next);
    set(next);
    return quest.reward;
  },

  getQuests: () => DEFAULT_QUESTS,

  ensureReferralCode: (userId) => {
    const s = get();
    if (s.referralCode) return s.referralCode;
    const code = String(userId || Math.floor(Math.random() * 1e9))
      .padStart(7, '0')
      .slice(-7)
      .toUpperCase();
    const next = { ...s, referralCode: code };
    persist(next);
    set(next);
    return code;
  },

  registerReferralUse: () => {
    const s = get();
    const next = {
      ...s,
      referralCount: s.referralCount + 1,
      referralChipsEarned: s.referralChipsEarned + 200,
    };
    let achievements = [...next.achievements];
    if (!achievements.includes('sharer')) achievements.push('sharer');
    next.achievements = achievements;
    persist(next);
    set(next);
  },

  clearBigWin: () => {
    const s = get();
    if (!s.lastBigWin) return;
    const next = { ...s, lastBigWin: null };
    persist(next);
    set(next);
  },

  reset: () => {
    localStorage.removeItem(LS_KEY);
    set(defaultState());
  },
}));
