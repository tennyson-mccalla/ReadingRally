import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Progress, TimerProgress, Notification, Alert, Spinner } from '../components/common';
import { AudioRecorder } from '../services/AudioRecorder';
import { AIAnalysisService } from '../services/AIAnalysis';
import { useProgressStore } from '../store/progressStore';
import { useRewardsStore } from '../store/rewardsStore';
import { RewardAnimation } from '../components/rewards/RewardAnimation';
import { useNavigate } from 'react-router-dom';

// Mock text for demo
const SAMPLE_TEXT = `Once upon a time, in a cozy little house at the end of a winding road, there lived a curious cat named Whiskers. Whiskers loved to watch the birds that visited the garden outside his window. Every morning, he would sit on the windowsill, his tail swishing back and forth, as he dreamed of making friends with the cheerful birds.`;

// Add grade level configuration
const GRADE_LEVEL_CONFIG = {
  1: { maxTime: 90, expectedWpm: 60 },
  3: { maxTime: 60, expectedWpm: 100 },
  5: { maxTime: 45, expectedWpm: 140 },
  8: { maxTime: 30, expectedWpm: 200 },
};

interface ReadingSessionState {
  wpm: number;
  accuracy: number;
  fluency: number;
  duration: number;
  bookId: string;
  completed: boolean;
}

// Split text into words and add timing information
const WORDS = (() => {
  let currentTime = 0;
  return SAMPLE_TEXT.split(/\s+/).map((word, index) => {
    // Base time is 300ms
    let duration = 300;

    // Adjust for word length (scaled proportionally)
    duration += Math.max(0, (word.length - 4) * 25);

    // Add pauses for punctuation
    if (word.includes('.')) {
      duration += 400; // 0.4 second pause at end of sentences
    } else if (word.includes(',')) {
      duration += 200; // 0.2 second pause for commas
    }

    // Keep the same tiny random variation (±2.5%)
    const variation = (Math.random() * 0.05 - 0.025) * duration;
    duration += variation;

    // Store the timestamp when this word should be highlighted
    const startTime = currentTime;
    currentTime += Math.round(duration);

    return {
      word,
      index,
      startTime,
      duration: Math.round(duration)
    };
  });
})();

export default function ReadingSession() {
  const [gradeLevel] = React.useState(3);
  const maxTime = GRADE_LEVEL_CONFIG[gradeLevel].maxTime;
  const expectedWpm = GRADE_LEVEL_CONFIG[gradeLevel].expectedWpm;

  const [sessionState, setSessionState] = useState<ReadingSessionState>({
    wpm: 0,
    accuracy: 0,
    fluency: 0,
    duration: 0,
    bookId: 'book-1',
    completed: false,
  });

  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [analysis, setAnalysis] = React.useState<ReadingAnalysis | null>(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  const [reward, setReward] = useState<{
    points?: number;
    badge?: any;
  } | null>(null);

  // References for services
  const recorderRef = React.useRef<AudioRecorder | null>(null);
  const aiServiceRef = React.useRef<AIAnalysisService | null>(null);

  const { addReadingSession } = useProgressStore();
  const { addPoints, updateMilestoneProgress, updateStreak } = useRewardsStore();

  const [sessionStep, setSessionStep] = useState<'instructions' | 'ready' | 'reading' | 'analyzing' | 'completed'>('instructions');

  const navigate = useNavigate();

  // Initialize services
  React.useEffect(() => {
    recorderRef.current = new AudioRecorder();
    aiServiceRef.current = new AIAnalysisService(import.meta.env.VITE_OPENAI_API_KEY || '');
  }, []);

  // Simulate reading progress
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSimulating && !sessionState.completed) {
      interval = setInterval(() => {
        setSessionState(prev => {
          if (prev.completed) return prev;

          const wpm = Math.min(prev.wpm + 5, 150);
          const accuracy = Math.min(prev.accuracy + 2, 98);
          const fluency = Math.min(prev.fluency + 3, 95);
          const duration = prev.duration + 10;

          return {
            wpm,
            accuracy,
            fluency,
            duration,
            bookId: 'book-1',
            completed: false, // Never auto-complete
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Update animation effect when reading
  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsedTime = timestamp - startTimestamp;

      // Find the word that should be highlighted at this time
      const currentWord = WORDS.find(word =>
        word.startTime <= elapsedTime &&
        word.startTime + word.duration > elapsedTime
      );

      if (currentWord) {
        setCurrentWordIndex(currentWord.index);
        animationFrameId = requestAnimationFrame(animate);
      } else if (elapsedTime < WORDS[WORDS.length - 1].startTime + WORDS[WORDS.length - 1].duration) {
        // Keep going if we haven't reached the end
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (sessionStep === 'reading' && !sessionState.completed) {
      setCurrentWordIndex(0);
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [sessionStep, sessionState.completed]);

  const handleStartReading = async () => {
    try {
      await recorderRef.current?.start();
      setStartTime(Date.now());
      setElapsedTime(0);
      setIsSimulating(true);
      setSessionStep('reading');
      setToastMessage('Reading session started! Read the text aloud.');
      setShowToast(true);
    } catch (err) {
      console.error('Start reading error:', err);
      setToastMessage('Failed to start reading session. Please try again.');
      setShowToast(true);
    }
  };

  const handleReadyClick = () => {
    setSessionStep('ready');
  };

  const handleCompleteSession = async () => {
    if (!recorderRef.current || !aiServiceRef.current) return;

    // Clear simulation and timer states first
    setIsSimulating(false);
    setStartTime(null);
    setElapsedTime(0);

    setShowSpinner(true);
    setSessionStep('analyzing'); // Add new state for analyzing

    try {
      const audioBlob = await recorderRef.current.stop();
      const finalTime = Math.floor((Date.now() - (startTime || 0)) / 1000);

      const result = await aiServiceRef.current.analyzeReading(
        audioBlob,
        SAMPLE_TEXT,
        finalTime
      );

      // Get final stats
      const { wpm, accuracy, fluency, duration } = sessionState;

      // Calculate rewards
      const basePoints = 100;
      const accuracyBonus = Math.floor((accuracy - 80) / 5) * 10;
      const wpmBonus = Math.floor((wpm - 60) / 10) * 15;
      const totalPoints = basePoints + accuracyBonus + wpmBonus;

      // Update all states in sequence
      setSessionState(prev => ({ ...prev, completed: true }));
      setAnalysis(result);
      setSessionStep('completed');

      // Update rewards and progress after state updates
      setTimeout(() => {
        updateMilestoneProgress('wpm', wpm);
        addPoints(totalPoints, 'Reading session completed');
        updateStreak();

        addReadingSession({
          date: new Date().toISOString(),
          wpm,
          accuracy,
          fluency,
          duration,
          bookId: 'book-1',
          completed: true,
        });

        setReward({
          points: totalPoints,
        });
      }, 0);

      setToastMessage("Great job! Here's your analysis.");
    } catch (err) {
      console.error('Analysis error:', err);
      setToastMessage('Failed to analyze reading. Please try again.');
      setSessionState(prev => ({ ...prev, completed: false }));
      setSessionStep('reading');
    } finally {
      setShowSpinner(false);
      setShowToast(true);
    }
  };

  const handleTryAgain = () => {
    // Reset all states
    setSessionState({
      wpm: 0,
      accuracy: 0,
      fluency: 0,
      duration: 0,
      bookId: 'book-1',
      completed: false,
    });
    setStartTime(null);
    setElapsedTime(0);
    setIsSimulating(false);
    setAnalysis(null);
    setShowSpinner(false);
    setSessionStep('instructions');
    setReward(null);
    setCurrentWordIndex(-1);

    // Reinitialize services
    recorderRef.current = new AudioRecorder();
    aiServiceRef.current = new AIAnalysisService(import.meta.env.VITE_OPENAI_API_KEY || '');
  };

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!sessionState.completed && startTime && sessionStep === 'reading') {
      interval = setInterval(() => {
        const newElapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(newElapsedTime);

        // Auto-complete when max time is reached
        if (newElapsedTime >= maxTime) {
          handleCompleteSession();
        }
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [sessionState.completed, startTime, maxTime, sessionStep]);

  // Helper function to render words with highlighting
  const renderWords = () => {
    return WORDS.map(({ word, index }) => (
      <React.Fragment key={index}>
        <span
          className={`inline transition-all duration-300 ${
            index === currentWordIndex
              ? 'text-primary font-bold scale-110'
              : index < currentWordIndex
              ? 'text-base-content/50'
              : 'text-base-content'
          }`}
        >
          {word}
        </span>
        {' '}
      </React.Fragment>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Instructions State */}
      {sessionStep === 'instructions' && !sessionState.completed && (
        <Card>
          <CardBody>
            <div className="space-y-6 text-center">
              <h1 className="text-3xl font-bold text-primary">Let's Start Reading!</h1>
              <div className="space-y-4">
                <p className="text-lg">Here's what you need to do:</p>
                <ol className="text-left space-y-2 max-w-md mx-auto">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                    <span>Find a quiet place where you can read aloud</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
                    <span>Click "I'm Ready" when you're set to begin</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">3</span>
                    <span>Read the text aloud clearly and at your own pace</span>
                  </li>
                </ol>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleReadyClick}
              >
                I'm Ready
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Ready State */}
      {sessionStep === 'ready' && !sessionState.completed && (
        <Card>
          <CardBody>
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold text-primary">Ready to Begin</h2>
              <p className="text-lg">The timer will start when you click "Start Reading"</p>
              <div className="max-w-2xl mx-auto p-6 bg-base-200 rounded-lg">
                <p className="text-lg font-reading">{SAMPLE_TEXT}</p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartReading}
              >
                Start Reading
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Reading State */}
      {sessionStep === 'reading' && !showSpinner && !sessionState.completed && (
        <div className="space-y-6">
          <Card>
            <CardBody>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Reading in Progress</h2>
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-mono">
                      Time remaining: {Math.max(0, maxTime - elapsedTime)}s
                    </div>
                    <Progress
                      value={(elapsedTime / maxTime) * 100}
                      max={100}
                      className="w-32"
                      variant={elapsedTime > maxTime * 0.8 ? "warning" : "primary"}
                    />
                  </div>
                </div>
                <div className="p-6 bg-base-200 rounded-lg">
                  <p className="text-lg font-reading leading-relaxed">
                    {renderWords()}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-base-content/70">
                    Target: {expectedWpm} words per minute
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleCompleteSession}
                  >
                    Complete Reading
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Analyzing State */}
      {sessionStep === 'analyzing' && showSpinner && (
        <Card>
          <CardBody>
            <div className="flex flex-col items-center gap-4 p-8">
              <Spinner size="lg" />
              <p className="text-lg">Analyzing your reading...</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Complete State */}
      {sessionStep === 'completed' && analysis && (
        <Card>
          <CardBody>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-success text-center">Reading Complete!</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{analysis.wpm}</div>
                  <div className="text-sm text-base-content/70">
                    Words per Minute
                    <div className="text-xs">Target: {expectedWpm}</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary">{analysis.accuracy}%</div>
                  <div className="text-sm text-base-content/70">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent">{analysis.fluency}</div>
                  <div className="text-sm text-base-content/70">Fluency Score</div>
                </div>
              </div>

              <div className="p-4 bg-base-200 rounded-lg">
                <h3 className="font-bold mb-2">Feedback:</h3>
                <p className="text-base-content/70">{analysis.feedback}</p>
              </div>

              {analysis.pronunciationNotes && (
                <div className="space-y-4">
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h3 className="font-bold mb-2">Pronunciation Strengths:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.pronunciationNotes.strengths.map((strength, index) => (
                        <li key={index} className="text-base-content/70">{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-base-200 rounded-lg">
                    <h3 className="font-bold mb-2">Areas to Practice:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.pronunciationNotes.potentialIssues.map((issue, index) => (
                        <li key={index} className="text-base-content/70">{issue}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-base-200 rounded-lg">
                    <h3 className="font-bold mb-2">Practice Words:</h3>
                    <div className="flex gap-4">
                      {analysis.pronunciationNotes.practiceWords.map((word, index) => (
                        <div key={index} className="badge badge-lg badge-primary">{word}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-base-200 rounded-lg">
                <h3 className="font-bold mb-2">Your Reading:</h3>
                <p className="text-base-content/70">{analysis.transcript}</p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="primary"
                  onClick={handleTryAgain}
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Toast Notifications */}
      {showToast && (
        <Notification
          variant="info"
          position="bottom-right"
          onClose={() => setShowToast(false)}
          autoClose
          duration={3000}
        >
          {toastMessage}
        </Notification>
      )}

      {/* Reward Animation */}
      {reward && (
        <RewardAnimation
          points={reward.points}
          badge={reward.badge}
          onComplete={() => setReward(null)}
        />
      )}
    </div>
  );
}
