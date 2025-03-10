import React from 'react';
import { Card, CardBody, CardTitle, Progress } from '../common';
import { useRewardsStore } from '../../store/rewardsStore';

export const RewardsDashboard: React.FC = () => {
  const { points, badges, milestones, streak } = useRewardsStore();

  const rarityColors = {
    common: 'bg-neutral text-neutral-content',
    rare: 'bg-primary text-primary-content',
    epic: 'bg-secondary text-secondary-content',
    legendary: 'bg-accent text-accent-content',
  };

  return (
    <div className="space-y-8">
      {/* Points Overview */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Total Points</h2>
              <div className="text-4xl font-bold text-primary">{points}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">Current Streak</div>
              <div className="text-2xl text-accent">🔥 {streak} days</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recent Badges */}
      <Card>
        <CardBody>
          <CardTitle>Recent Badges</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {badges.slice(-3).map(badge => (
              <Card key={badge.id} className={rarityColors[badge.rarity]}>
                <CardBody>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-100/10 flex items-center justify-center">
                      <span className="text-3xl">{badge.icon}</span>
                    </div>
                    <h3 className="font-bold text-lg">{badge.name}</h3>
                    <p className="text-sm opacity-90">{badge.description}</p>
                    <div className="mt-2 text-xs opacity-75">
                      Earned on {new Date(badge.dateEarned!).toLocaleDateString()}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Active Milestones */}
      <Card>
        <CardBody>
          <CardTitle>Active Milestones</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {milestones
              .filter(m => !m.completed)
              .map(milestone => (
                <Card key={milestone.id}>
                  <CardBody>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold">{milestone.name}</h3>
                        <p className="text-sm text-base-content/70">
                          {milestone.description}
                        </p>
                        <div className="mt-2">
                          <Progress
                            value={milestone.progress}
                            max={milestone.requirement}
                            size="sm"
                            variant="secondary"
                            showLabel
                            labelFormat={(value, max) => `${value}/${max}`}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="badge badge-primary">+{milestone.reward.points}p</div>
                        {milestone.reward.badge && (
                          <div className="mt-2">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <span className="text-lg">{milestone.reward.badge.icon}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
          </div>
        </CardBody>
      </Card>

      {/* Badge Collection */}
      {badges.length > 0 && (
        <Card>
          <CardBody>
            <CardTitle>Badge Collection</CardTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg ${rarityColors[badge.rarity]} text-center`}
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-base-100/10 flex items-center justify-center">
                    <span className="text-2xl">{badge.icon}</span>
                  </div>
                  <div className="font-bold">{badge.name}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
