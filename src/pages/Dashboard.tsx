import React from 'react';
import { MainLayout } from '../components/layout';
import { Card, CardBody, CardTitle, CardActions, Button, Badge, Progress } from '../components/common';

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Jamie!</h1>
            <p className="text-lg text-base-content/70">Ready for today's reading adventure?</p>
          </div>
          <Button variant="primary" size="lg">Start Reading</Button>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <div className="text-center">
                <h3 className="font-bold mb-2">Current Level</h3>
                <div className="text-4xl font-bold text-primary">3</div>
                <p className="text-sm text-base-content/70">Intermediate Reader</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <h3 className="font-bold mb-2">Reading Speed</h3>
                <div className="text-4xl font-bold text-secondary">85</div>
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
                  <Progress value={60} size="sm" variant="secondary" />
                  <p className="text-sm mt-1">60% Complete</p>
                </div>
                <CardActions>
                  <Button variant="secondary">Continue</Button>
                </CardActions>
              </CardBody>
            </Card>

            <Card variant="reading" hoverable>
              <CardBody>
                <Badge variant="secondary" size="sm">Level 3</Badge>
                <CardTitle className="mt-2">The Cat in the Hat</CardTitle>
                <p className="text-base-content/70">A rainy day adventure awaits!</p>
                <div className="mt-4">
                  <Progress value={25} size="sm" variant="secondary" />
                  <p className="text-sm mt-1">25% Complete</p>
                </div>
                <CardActions>
                  <Button variant="secondary">Continue</Button>
                </CardActions>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Recent Achievements */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Achievements</h2>
            <Button variant="ghost">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="achievement">
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

            <Card variant="achievement">
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

            <Card variant="achievement">
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
      </div>
    </MainLayout>
  );
}
