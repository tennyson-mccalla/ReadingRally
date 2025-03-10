import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  dateEarned?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: 'points' | 'books' | 'streak' | 'wpm';
  reward: {
    points: number;
    badge?: Badge;
  };
  completed: boolean;
  progress: number;
}

interface RewardsState {
  points: number;
  badges: Badge[];
  milestones: Milestone[];
  streak: number;
  lastReadDate: string | null;
  addPoints: (amount: number, reason: string) => void;
  awardBadge: (badge: Badge) => void;
  updateMilestoneProgress: (type: Milestone['type'], value: number) => void;
  updateStreak: () => void;
}

const BADGES = {
  SPEED_READER: {
    id: 'speed-reader',
    name: 'Speed Reader',
    description: 'Read at 150+ WPM',
    icon: '⚡',
    rarity: 'rare',
    points: 500,
  },
  BOOKWORM: {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Complete 10 books',
    icon: '📚',
    rarity: 'epic',
    points: 1000,
  },
  PERFECT_STREAK: {
    id: 'perfect-streak',
    name: 'Perfect Streak',
    description: 'Read for 7 days in a row',
    icon: '🔥',
    rarity: 'rare',
    points: 500,
  },
  MASTER_READER: {
    id: 'master-reader',
    name: 'Master Reader',
    description: 'Reach 1000 points',
    icon: '👑',
    rarity: 'legendary',
    points: 1500,
  },
} as const;

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'first-book',
    name: 'First Book',
    description: 'Complete your first book',
    requirement: 1,
    type: 'books',
    reward: {
      points: 100,
    },
    completed: false,
    progress: 0,
  },
  {
    id: 'reading-streak',
    name: 'Reading Streak',
    description: 'Read for 7 days in a row',
    requirement: 7,
    type: 'streak',
    reward: {
      points: 500,
      badge: BADGES.PERFECT_STREAK as Badge,
    },
    completed: false,
    progress: 0,
  },
  {
    id: 'speed-milestone',
    name: 'Speed Demon',
    description: 'Reach 150 WPM',
    requirement: 150,
    type: 'wpm',
    reward: {
      points: 500,
      badge: BADGES.SPEED_READER as Badge,
    },
    completed: false,
    progress: 0,
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Complete 10 books',
    requirement: 10,
    type: 'books',
    reward: {
      points: 1000,
      badge: BADGES.BOOKWORM as Badge,
    },
    completed: false,
    progress: 0,
  },
  {
    id: 'points-master',
    name: 'Points Master',
    description: 'Earn 1000 points',
    requirement: 1000,
    type: 'points',
    reward: {
      points: 1500,
      badge: BADGES.MASTER_READER as Badge,
    },
    completed: false,
    progress: 0,
  },
];

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      points: 0,
      badges: [],
      milestones: INITIAL_MILESTONES,
      streak: 0,
      lastReadDate: null,

      addPoints: (amount, reason) => {
        set(state => {
          const newPoints = state.points + amount;
          // Check points milestone
          const pointsMilestones = state.milestones.map(m => {
            if (m.type === 'points' && !m.completed) {
              const progress = Math.min(newPoints, m.requirement);
              if (progress >= m.requirement) {
                // Award badge if exists
                if (m.reward.badge) {
                  get().awardBadge(m.reward.badge);
                }
                return { ...m, completed: true, progress };
              }
              return { ...m, progress };
            }
            return m;
          });
          return { points: newPoints, milestones: pointsMilestones };
        });
      },

      awardBadge: (badge) => {
        set(state => {
          if (state.badges.some(b => b.id === badge.id)) {
            return state;
          }
          const newBadge = {
            ...badge,
            dateEarned: new Date().toISOString(),
          };
          return { badges: [...state.badges, newBadge] };
        });
      },

      updateMilestoneProgress: (type, value) => {
        set(state => ({
          milestones: state.milestones.map(m => {
            if (m.type === type && !m.completed) {
              const progress = Math.min(value, m.requirement);
              if (progress >= m.requirement) {
                // Award points and badge
                get().addPoints(m.reward.points, `Completed milestone: ${m.name}`);
                if (m.reward.badge) {
                  get().awardBadge(m.reward.badge);
                }
                return { ...m, completed: true, progress };
              }
              return { ...m, progress };
            }
            return m;
          }),
        }));
      },

      updateStreak: () => {
        set(state => {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split('T')[0];

          let newStreak = state.streak;
          if (state.lastReadDate === yesterday) {
            newStreak += 1;
          } else if (state.lastReadDate !== today) {
            newStreak = 1;
          }

          // Update streak milestone
          const updatedMilestones = state.milestones.map(m => {
            if (m.type === 'streak' && !m.completed) {
              const progress = Math.min(newStreak, m.requirement);
              if (progress >= m.requirement) {
                // Award points and badge
                get().addPoints(m.reward.points, `Completed milestone: ${m.name}`);
                if (m.reward.badge) {
                  get().awardBadge(m.reward.badge);
                }
                return { ...m, completed: true, progress };
              }
              return { ...m, progress };
            }
            return m;
          });

          return {
            streak: newStreak,
            lastReadDate: today,
            milestones: updatedMilestones,
          };
        });
      },
    }),
    {
      name: 'reading-rewards',
    }
  )
);
