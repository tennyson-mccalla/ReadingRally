export interface Student {
  id: string;
  name: string;
  grade: 'K' | '1' | '2' | '3' | '4' | '5';
  readingLevel: number;
}

export interface ReadingSession {
  id: string;
  studentId: string;
  textId: string;
  date: Date;
  wcpm: number[];
  errors: ReadingError[];
}

export interface ReadingError {
  word: string;
  actualRead: string;
  position: number;
}

export interface ReadingText {
  id: string;
  title: string;
  content: string;
  gradeLevel: number;
  difficultyLevel: number;
  wordCount: number;
  category: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  achieved: boolean;
  dateAchieved?: string;
  category: 'speed' | 'accuracy' | 'completion' | 'streak';
}
