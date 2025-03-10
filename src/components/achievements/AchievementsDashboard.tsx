import React from 'react';
import { Card } from '../common/Card';
import { CardBody } from '../common/Card';
import { CardTitle } from '../common/Card';
import { Badge } from '../common/Badge';
import { Progress } from '../common/Progress';

interface Achievement {
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

interface AchievementsDashboardProps {
  achievements: Achievement[];
  totalPoints: number;
  currentRank: string;
  nextRankProgress: number;
}

export const AchievementsDashboard: React.FC<AchievementsDashboardProps> = ({
  achievements,
  totalPoints,
  currentRank,
  nextRankProgress,
}) => {
  const categories = {
    speed: 'Speed Achievements',
    accuracy: 'Accuracy Achievements',
    completion: 'Completion Achievements',
    streak: 'Streak Achievements',
  };

  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="space-y-8">
      {/* Rank Overview */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{currentRank}</h2>
              <p className="text-base-content/70">Total Points: {totalPoints}</p>
            </div>
            <div className="w-64">
              <Progress
                value={nextRankProgress}
                max={100}
                variant="accent"
                size="md"
                showLabel
                labelFormat={(value, max) => `${value}/${max} to next rank`}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardBody>
          <CardTitle>Recently Earned</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {achievements
              .filter(a => a.achieved)
              .slice(-3)
              .map(achievement => (
                <Card key={achievement.id} variant="achievement">
                  <CardBody>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-2xl">{achievement.icon}</span>
                      </div>
                      <CardTitle>{achievement.name}</CardTitle>
                      <p className="text-sm text-base-content/70">{achievement.description}</p>
                      <p className="text-xs mt-2 text-base-content/50">
                        Earned on {achievement.dateAchieved}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              ))}
          </div>
        </CardBody>
      </Card>

      {/* Achievement Categories */}
      {Object.entries(categories).map(([category, title]) => (
        <Card key={category}>
          <CardBody>
            <CardTitle>{title}</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {achievementsByCategory[category]?.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.achieved ? 'bg-base-200' : 'bg-base-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{achievement.name}</h3>
                        {achievement.achieved && (
                          <Badge variant="success" size="sm">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-base-content/70">{achievement.description}</p>
                      {!achievement.achieved && (
                        <Progress
                          value={achievement.progress}
                          max={achievement.maxProgress}
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          showLabel
                          labelFormat={(value, max) => `${value}/${max}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
