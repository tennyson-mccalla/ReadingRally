import React from 'react';
import { MainLayout } from '../components/layout';
import { Button, Card, CardBody, Progress, TimerProgress, Notification, Alert, Spinner } from '../components/common';
import { AudioRecorder } from '../services/AudioRecorder';
import { AIAnalysisService } from '../services/AIAnalysis';

// Mock text for demo
const SAMPLE_TEXT = `Once upon a time, in a cozy little house at the end of a winding road, there lived a curious cat named Whiskers. Whiskers loved to watch the birds that visited the garden outside his window. Every morning, he would sit on the windowsill, his tail swishing back and forth, as he dreamed of making friends with the cheerful birds.`;

// Add grade level configuration
const GRADE_LEVEL_CONFIG = {
  1: { maxTime: 90, expectedWpm: 60 },
  3: { maxTime: 60, expectedWpm: 100 },
  5: { maxTime: 45, expectedWpm: 140 },
  8: { maxTime: 30, expectedWpm: 200 },
};

type SessionState = 'instructions' | 'ready' | 'reading' | 'analyzing' | 'complete';

interface ReadingAnalysis {
  transcript: string;
  wpm: number;
  accuracy: number;
  fluency: number;
  feedback: string;
}

export default function ReadingSession() {
  const [gradeLevel] = React.useState(3);
  const maxTime = GRADE_LEVEL_CONFIG[gradeLevel].maxTime;
  const expectedWpm = GRADE_LEVEL_CONFIG[gradeLevel].expectedWpm;

  const [sessionState, setSessionState] = React.useState<SessionState>('instructions');
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [analysis, setAnalysis] = React.useState<ReadingAnalysis | null>(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  // References for services
  const recorderRef = React.useRef<AudioRecorder | null>(null);
  const aiServiceRef = React.useRef<AIAnalysisService | null>(null);

  // Initialize services
  React.useEffect(() => {
    recorderRef.current = new AudioRecorder();
    aiServiceRef.current = new AIAnalysisService(import.meta.env.VITE_OPENAI_API_KEY || '');
  }, []);

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionState === 'reading' && startTime) {
      interval = setInterval(() => {
        const newElapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(newElapsedTime);

        // Auto-complete when max time is reached
        if (newElapsedTime >= maxTime) {
          handleCompleteSession();
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [sessionState, startTime, maxTime]);

  const handleStartReading = async () => {
    try {
      await recorderRef.current?.start();
      setSessionState('reading');
      setStartTime(Date.now());
      setElapsedTime(0);
      setToastMessage('Reading session started! Read the text aloud.');
      setShowToast(true);
    } catch (err) {
      console.error('Start reading error:', err);
      setToastMessage('Failed to start reading session. Please try again.');
      setShowToast(true);
    }
  };

  const handleCompleteSession = async () => {
    if (!recorderRef.current || !aiServiceRef.current) return;

    setSessionState('analyzing');
    const spinnerTimeout = setTimeout(() => setShowSpinner(true), 500);

    try {
      const audioBlob = await recorderRef.current.stop();
      const finalTime = Math.floor((Date.now() - (startTime || 0)) / 1000);

      const result = await aiServiceRef.current.analyzeReading(
        audioBlob,
        SAMPLE_TEXT,
        finalTime
      );

      setAnalysis(result);
      setSessionState('complete');
      setToastMessage("Great job! Here's your analysis.");
    } catch (err) {
      console.error('Analysis error:', err);
      setToastMessage('Failed to analyze reading. Please try again.');
      setSessionState('ready');
    } finally {
      clearTimeout(spinnerTimeout);
      setShowSpinner(false);
      setShowToast(true);
    }
  };

  const handleTryAgain = () => {
    setSessionState('ready');
    setAnalysis(null);
    setStartTime(null);
    setElapsedTime(0);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Instructions State */}
        {sessionState === 'instructions' && (
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
                  onClick={() => setSessionState('ready')}
                >
                  I'm Ready
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Ready State */}
        {sessionState === 'ready' && (
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
        {sessionState === 'reading' && (
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
                      {SAMPLE_TEXT}
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
        {sessionState === 'analyzing' && showSpinner && (
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
        {sessionState === 'complete' && analysis && (
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
                    onClick={() => window.history.back()}
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
      </div>
    </MainLayout>
  );
}
