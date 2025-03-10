import { Achievement } from '../types';

interface ReadingSession {
  date: string;
  wpm: number;
  accuracy: number;
  fluency: number;
  duration: number;
  bookId: string;
  completed: boolean;
}

interface LevelRequirement {
  minWPM: number;
  minAccuracy: number;
  booksRequired: number;
}

export class ProgressTracker {
  private static readonly LEVEL_REQUIREMENTS: Record<number, LevelRequirement> = {
    1: { minWPM: 0, minAccuracy: 0, booksRequired: 0 },
    2: { minWPM: 60, minAccuracy: 85, booksRequired: 2 },
    3: { minWPM: 80, minAccuracy: 90, booksRequired: 5 },
    4: { minWPM: 100, minAccuracy: 92, booksRequired: 8 },
    5: { minWPM: 120, minAccuracy: 95, booksRequired: 12 },
  };

  private static readonly ACHIEVEMENTS = {
    SPEED_DEMON: {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Read faster than 120 words per minute',
      icon: '🚀',
      category: 'speed',
      requirement: 120,
    },
    ACCURACY_MASTER: {
      id: 'accuracy-master',
      name: 'Accuracy Master',
      description: 'Achieve 98% accuracy in a reading session',
      icon: '🎯',
      category: 'accuracy',
      requirement: 98,
    },
    BOOKWORM: {
      id: 'bookworm',
      name: 'Bookworm',
      description: 'Complete 5 books',
      icon: '📚',
      category: 'completion',
      requirement: 5,
    },
    CONSISTENT_READER: {
      id: 'consistent-reader',
      name: 'Consistent Reader',
      description: 'Read for 7 days in a row',
      icon: '📅',
      category: 'streak',
      requirement: 7,
    },
  } as const;

  private readingSessions: ReadingSession[] = [];
  private achievements: Achievement[] = [];
  private currentLevel = 1;
  private booksCompleted: string[] = [];
  private streakDays = 0;
  private lastReadDate: string | null = null;

  constructor() {
    this.initializeAchievements();
  }

  private initializeAchievements() {
    this.achievements = Object.values(ProgressTracker.ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      progress: 0,
      maxProgress: achievement.requirement,
      achieved: false,
    }));
  }

  public addReadingSession(session: ReadingSession) {
    this.readingSessions.push(session);

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    if (this.lastReadDate !== today) {
      if (this.lastReadDate === this.getPreviousDay(today)) {
        this.streakDays++;
      } else {
        this.streakDays = 1;
      }
      this.lastReadDate = today;
    }

    // Update completed books
    if (session.completed && !this.booksCompleted.includes(session.bookId)) {
      this.booksCompleted.push(session.bookId);
    }

    this.updateAchievements(session);
    this.checkLevelUp();
  }

  private getPreviousDay(date: string): string {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  private updateAchievements(session: ReadingSession) {
    // Speed achievement
    const speedAchievement = this.achievements.find(a => a.id === 'speed-demon');
    if (speedAchievement && !speedAchievement.achieved) {
      speedAchievement.progress = Math.max(speedAchievement.progress, session.wpm);
      if (session.wpm >= speedAchievement.maxProgress) {
        speedAchievement.achieved = true;
        speedAchievement.dateAchieved = new Date().toISOString();
      }
    }

    // Accuracy achievement
    const accuracyAchievement = this.achievements.find(a => a.id === 'accuracy-master');
    if (accuracyAchievement && !accuracyAchievement.achieved) {
      accuracyAchievement.progress = Math.max(accuracyAchievement.progress, session.accuracy);
      if (session.accuracy >= accuracyAchievement.maxProgress) {
        accuracyAchievement.achieved = true;
        accuracyAchievement.dateAchieved = new Date().toISOString();
      }
    }

    // Books completion achievement
    const bookwormAchievement = this.achievements.find(a => a.id === 'bookworm');
    if (bookwormAchievement && !bookwormAchievement.achieved) {
      bookwormAchievement.progress = this.booksCompleted.length;
      if (this.booksCompleted.length >= bookwormAchievement.maxProgress) {
        bookwormAchievement.achieved = true;
        bookwormAchievement.dateAchieved = new Date().toISOString();
      }
    }

    // Streak achievement
    const streakAchievement = this.achievements.find(a => a.id === 'consistent-reader');
    if (streakAchievement && !streakAchievement.achieved) {
      streakAchievement.progress = this.streakDays;
      if (this.streakDays >= streakAchievement.maxProgress) {
        streakAchievement.achieved = true;
        streakAchievement.dateAchieved = new Date().toISOString();
      }
    }
  }

  private checkLevelUp() {
    const currentReq = ProgressTracker.LEVEL_REQUIREMENTS[this.currentLevel + 1];
    if (!currentReq) return;

    const recentSessions = this.readingSessions.slice(-5);
    const avgWPM = recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length;
    const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;

    if (
      avgWPM >= currentReq.minWPM &&
      avgAccuracy >= currentReq.minAccuracy &&
      this.booksCompleted.length >= currentReq.booksRequired
    ) {
      this.currentLevel++;
    }
  }

  public getReadingHistory() {
    return this.readingSessions;
  }

  public getAchievements() {
    return this.achievements;
  }

  public getCurrentLevel() {
    return this.currentLevel;
  }

  public getNextLevelProgress(): number {
    const currentReq = ProgressTracker.LEVEL_REQUIREMENTS[this.currentLevel + 1];
    if (!currentReq) return 100;

    const recentSessions = this.readingSessions.slice(-5);
    const avgWPM = recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length;
    const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;

    const wpmProgress = Math.min(100, (avgWPM / currentReq.minWPM) * 100);
    const accuracyProgress = Math.min(100, (avgAccuracy / currentReq.minAccuracy) * 100);
    const booksProgress = Math.min(100, (this.booksCompleted.length / currentReq.booksRequired) * 100);

    return Math.floor((wpmProgress + accuracyProgress + booksProgress) / 3);
  }

  public getTotalMinutesRead(): number {
    return Math.floor(
      this.readingSessions.reduce((sum, session) => sum + session.duration, 0) / 60
    );
  }

  public getBooksCompleted(): number {
    return this.booksCompleted.length;
  }
}
