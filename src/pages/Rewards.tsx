import React from 'react';
import { RewardsDashboard } from '../components/rewards/RewardsDashboard';

export default function Rewards() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Rewards</h1>
      <RewardsDashboard />
    </div>
  );
}
