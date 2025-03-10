import React from 'react';
import { MainLayout } from '../components/layout';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardActions,
  Badge,
  Alert,
  Toast,
  Progress,
  TimerProgress
} from '../components/common';

export default function ComponentDemo() {
  const [showToast, setShowToast] = React.useState(false);

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold mb-8">ReadingRally Component Demo</h1>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button isLoading>Loading</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="achievement">
              <CardBody>
                <CardTitle>Achievement Card</CardTitle>
                <p>You've earned a new badge!</p>
                <CardActions>
                  <Button variant="accent">View</Button>
                </CardActions>
              </CardBody>
            </Card>

            <Card variant="reading">
              <CardBody>
                <CardTitle>Reading Card</CardTitle>
                <p>Ready for your next reading session?</p>
                <CardActions>
                  <Button variant="secondary">Start</Button>
                </CardActions>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent" size="lg">Large Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </section>

        {/* Alerts Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Alerts</h2>
          <div className="space-y-4">
            <Alert variant="info" title="Info Alert">
              This is an informational message.
            </Alert>
            <Alert variant="success" title="Success!">
              You've completed the reading session!
            </Alert>
            <Alert variant="warning" title="Warning" onClose={() => console.log('closed')}>
              You're running out of time!
            </Alert>
            <Alert variant="error" title="Error">
              Something went wrong.
            </Alert>
          </div>
        </section>

        {/* Progress Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Progress</h2>
          <div className="space-y-4">
            <Progress value={75} showLabel />
            <Progress value={50} variant="secondary" size="lg" showLabel />
            <TimerProgress
              duration={60}
              variant="accent"
              onComplete={() => console.log('Timer complete')}
            />
          </div>
        </section>

        {/* Toast Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Toast</h2>
          <Button onClick={() => setShowToast(true)}>Show Toast</Button>
          {showToast && (
            <Toast
              variant="success"
              title="Success!"
              onClose={() => setShowToast(false)}
              position="top-right"
            >
              Action completed successfully
            </Toast>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
