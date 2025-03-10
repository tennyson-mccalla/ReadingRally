import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { RewardsDashboard } from '../components/rewards/RewardsDashboard';

export default function Rewards() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Rewards</h1>
        <RewardsDashboard />
      </div>
    </MainLayout>
  );
}
