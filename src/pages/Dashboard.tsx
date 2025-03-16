import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardActions, Button, Badge, Progress, Notification } from '../components/common';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [readingSpeed, setReadingSpeed] = React.useState(85);
  const [bookProgress, setBookProgress] = React.useState({
    'magic-tree': 60,
    'cat-hat': 25
  });

  const handleStartReading = () => {
    navigate('/reading');
  };

  const handleContinueReading = (book: string) => {
    setToastMessage(`Continuing "${book}"...`);
    setShowToast(true);
  };

  const handleSpeedClick = () => {
    // Simulate speed improvement
    setReadingSpeed(prev => prev + 5);
    setToastMessage('Reading speed updated! +5 WPM');
    setShowToast(true);
  };

  const handleProgressClick = (book: keyof typeof bookProgress) => {
    // Simulate progress update
    setBookProgress(prev => ({
      ...prev,
      [book]: Math.min(100, prev[book] + 10)
    }));
    setToastMessage('Reading progress updated! +10%');
    setShowToast(true);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Jamie!</h1>
          <p className="text-lg text-base-content/70">Ready for today's reading adventure?</p>
        </div>
        <Button variant="primary" size="lg" onClick={handleStartReading}>
          Start Reading
        </Button>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <div className="text-center cursor-pointer" onClick={() => {
              setToastMessage('Currently at Level 3 - Keep reading to level up!');
              setShowToast(true);
            }}>
              <h3 className="font-bold mb-2">Current Level</h3>
              <div className="text-4xl font-bold text-primary">3</div>
              <p className="text-sm text-base-content/70">Intermediate Reader</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center cursor-pointer" onClick={handleSpeedClick}>
              <h3 className="font-bold mb-2">Reading Speed</h3>
              <div className="text-4xl font-bold text-secondary">{readingSpeed}</div>
              <p className="text-sm text-base-content/70">Words per Minute</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center">
              <h3 className="font-bold mb-2">Accuracy</h3>
              <div className="text-4xl font-bold text-accent">96%</div>
              <p className="text-sm text-base-content/70">Last Session</p>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Next Reading Options */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Continue Reading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="reading" hoverable>
            <CardBody>
              <Badge variant="secondary" size="sm">Level 3</Badge>
              <CardTitle className="mt-2">The Magic Tree House</CardTitle>
              <p className="text-base-content/70">Continue your adventure with Jack and Annie!</p>
              <div className="mt-4">
                <Progress
                  value={bookProgress['magic-tree']}
                  size="sm"
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleProgressClick('magic-tree')}
                />
                <p className="text-sm mt-1">{bookProgress['magic-tree']}% Complete</p>
              </div>
              <CardActions>
                <Button
                  variant="secondary"
                  onClick={() => handleContinueReading('The Magic Tree House')}
                >
                  Continue
                </Button>
              </CardActions>
            </CardBody>
          </Card>

          <Card variant="reading" hoverable>
            <CardBody>
              <Badge variant="secondary" size="sm">Level 3</Badge>
              <CardTitle className="mt-2">The Cat in the Hat</CardTitle>
              <p className="text-base-content/70">A rainy day adventure awaits!</p>
              <div className="mt-4">
                <Progress
                  value={bookProgress['cat-hat']}
                  size="sm"
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleProgressClick('cat-hat')}
                />
                <p className="text-sm mt-1">{bookProgress['cat-hat']}% Complete</p>
              </div>
              <CardActions>
                <Button
                  variant="secondary"
                  onClick={() => handleContinueReading('The Cat in the Hat')}
                >
                  Continue
                </Button>
              </CardActions>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Recent Achievements */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Recent Achievements</h2>
          <Button
            variant="ghost"
            onClick={() => {
              setToastMessage('Opening achievements page...');
              setShowToast(true);
            }}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="achievement" className="cursor-pointer" onClick={() => {
            setToastMessage('Speed Demon: Achieved on March 8th!');
            setShowToast(true);
          }}>
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌟</span>
                </div>
                <CardTitle>Speed Demon</CardTitle>
                <p className="text-sm text-base-content/70">Read 100 words per minute!</p>
              </div>
            </CardBody>
          </Card>

          <Card variant="achievement" className="cursor-pointer" onClick={() => {
            setToastMessage('Bookworm: Achieved on March 5th!');
            setShowToast(true);
          }}>
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <CardTitle>Bookworm</CardTitle>
                <p className="text-sm text-base-content/70">Completed 5 books!</p>
              </div>
            </CardBody>
          </Card>

          <Card variant="achievement" className="cursor-pointer" onClick={() => {
            setToastMessage('Perfect Score: Achieved on March 1st!');
            setShowToast(true);
          }}>
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle>Perfect Score</CardTitle>
                <p className="text-sm text-base-content/70">100% accuracy in a session!</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Notifications */}
      {showToast && (
        <Notification
          variant="success"
          position="bottom-right"
          onClose={() => setShowToast(false)}
          autoClose
          duration={2000}
        >
          {toastMessage}
        </Notification>
      )}
    </div>
  );
}
