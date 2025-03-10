import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProgressTracker } from '../services/ProgressTracker';

interface ReadingSession {
  date: string;
  wpm: number;
  accuracy: number;
  fluency: number;
  duration: number;
  bookId: string;
  completed: boolean;
}

interface ProgressState {
  readingSessions: ReadingSession[];
  achievements: any[];
  currentLevel: number;
  booksCompleted: string[];
  streakDays: number;
  lastReadDate: string | null;
  addReadingSession: (session: ReadingSession) => void;
  getReadingHistory: () => ReadingSession[];
  getAchievements: () => any[];
  getCurrentLevel: () => number;
  getNextLevelProgress: () => number;
  getTotalMinutesRead: () => number;
  getBooksCompleted: () => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      readingSessions: [],
      achievements: [],
      currentLevel: 1,
      booksCompleted: [],
      streakDays: 0,
      lastReadDate: null,

      addReadingSession: (session) => {
        set(state => ({
          readingSessions: [...state.readingSessions, session],
          lastReadDate: new Date().toISOString().split('T')[0],
          streakDays: state.streakDays + 1,
          booksCompleted: session.completed
            ? [...new Set([...state.booksCompleted, session.bookId])]
            : state.booksCompleted
        }));
      },

      getReadingHistory: () => {
        return get().readingSessions;
      },

      getAchievements: () => {
        return get().achievements;
      },

      getCurrentLevel: () => {
        return get().currentLevel;
      },

      getNextLevelProgress: () => {
        const state = get();
        const recentSessions = state.readingSessions.slice(-5);
        if (recentSessions.length === 0) return 0;

        const avgWPM = recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length;
        const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
        const booksCompleted = state.booksCompleted.length;

        // Simple progress calculation based on WPM and accuracy
        const wpmProgress = Math.min(100, (avgWPM / 120) * 100); // Target 120 WPM
        const accuracyProgress = Math.min(100, (avgAccuracy / 95) * 100); // Target 95% accuracy
        const booksProgress = Math.min(100, (booksCompleted / 5) * 100); // Target 5 books

        return Math.floor((wpmProgress + accuracyProgress + booksProgress) / 3);
      },

      getTotalMinutesRead: () => {
        return Math.floor(
          get().readingSessions.reduce((sum, session) => sum + session.duration, 0) / 60
        );
      },

      getBooksCompleted: () => {
        return get().booksCompleted.length;
      },
    }),
    {
      name: 'reading-progress',
    }
  )
);
