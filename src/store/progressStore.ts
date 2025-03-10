import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProgressTracker } from '../services/ProgressTracker';

interface ProgressState {
  progressTracker: ProgressTracker;
  addReadingSession: (session: {
    date: string;
    wpm: number;
    accuracy: number;
    fluency: number;
    duration: number;
    bookId: string;
    completed: boolean;
  }) => void;
  getReadingHistory: () => any[];
  getAchievements: () => any[];
  getCurrentLevel: () => number;
  getNextLevelProgress: () => number;
  getTotalMinutesRead: () => number;
  getBooksCompleted: () => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progressTracker: new ProgressTracker(),
      addReadingSession: (session) => {
        const { progressTracker } = get();
        progressTracker.addReadingSession(session);
        set({ progressTracker });
      },
      getReadingHistory: () => {
        const { progressTracker } = get();
        return progressTracker.getReadingHistory();
      },
      getAchievements: () => {
        const { progressTracker } = get();
        return progressTracker.getAchievements();
      },
      getCurrentLevel: () => {
        const { progressTracker } = get();
        return progressTracker.getCurrentLevel();
      },
      getNextLevelProgress: () => {
        const { progressTracker } = get();
        return progressTracker.getNextLevelProgress();
      },
      getTotalMinutesRead: () => {
        const { progressTracker } = get();
        return progressTracker.getTotalMinutesRead();
      },
      getBooksCompleted: () => {
        const { progressTracker } = get();
        return progressTracker.getBooksCompleted();
      },
    }),
    {
      name: 'reading-progress',
    }
  )
);
