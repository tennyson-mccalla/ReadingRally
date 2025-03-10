import React from 'react';
import { MainLayout } from '../components/layout';
import { ProgressDashboard } from '../components/progress/ProgressDashboard';
import { AchievementsDashboard } from '../components/achievements/AchievementsDashboard';
import { Button } from '../components/common';

// This would normally come from your state management solution
import { ProgressTracker } from '../services/ProgressTracker';

export default function Progress() {
  const [activeTab, setActiveTab] = React.useState<'progress' | 'achievements'>('progress');
  const progressTracker = React.useRef(new ProgressTracker());

  // Demo data - in production, this would be loaded from your backend
  React.useEffect(() => {
    // Simulate some reading sessions
    const demoSessions = [
      {
        date: '2024-03-01',
        wpm: 85,
        accuracy: 92,
        fluency: 88,
        duration: 180,
        bookId: 'book-1',
        completed: true,
      },
      {
        date: '2024-03-02',
        wpm: 88,
        accuracy: 94,
        fluency: 90,
        duration: 180,
        bookId: 'book-2',
        completed: true,
      },
      {
        date: '2024-03-03',
        wpm: 92,
        accuracy: 95,
        fluency: 92,
        duration: 180,
        bookId: 'book-3',
        completed: true,
      },
      {
        date: '2024-03-04',
        wpm: 95,
        accuracy: 96,
        fluency: 94,
        duration: 180,
        bookId: 'book-4',
        completed: true,
      },
      {
        date: '2024-03-05',
        wpm: 98,
        accuracy: 97,
        fluency: 96,
        duration: 180,
        bookId: 'book-5',
        completed: true,
      },
    ];

    demoSessions.forEach(session => {
      progressTracker.current.addReadingSession(session);
    });
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Progress</h1>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'progress' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('progress')}
            >
              Progress
            </Button>
            <Button
              variant={activeTab === 'achievements' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </Button>
          </div>
        </div>

        {activeTab === 'progress' ? (
          <ProgressDashboard
            readingHistory={progressTracker.current.getReadingHistory()}
            booksCompleted={progressTracker.current.getBooksCompleted()}
            totalMinutesRead={progressTracker.current.getTotalMinutesRead()}
            currentLevel={progressTracker.current.getCurrentLevel()}
            nextLevelProgress={progressTracker.current.getNextLevelProgress()}
          />
        ) : (
          <AchievementsDashboard
            achievements={progressTracker.current.getAchievements()}
            totalPoints={progressTracker.current.getBooksCompleted() * 100}
            currentRank={`Level ${progressTracker.current.getCurrentLevel()} Reader`}
            nextRankProgress={progressTracker.current.getNextLevelProgress()}
          />
        )}
      </div>
    </MainLayout>
  );
}
