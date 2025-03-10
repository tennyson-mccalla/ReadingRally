import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to ReadingRally</h1>
        <p className="text-xl text-gray-600">Track your reading progress and unlock achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          to="/reading"
          className="p-8 rounded-lg bg-primary text-primary-content hover:bg-primary-focus transition-colors"
        >
          <h2 className="text-2xl font-bold mb-4">Start Reading</h2>
          <p>Begin a new reading session and track your progress</p>
        </Link>

        <Link
          to="/progress"
          className="p-8 rounded-lg bg-secondary text-secondary-content hover:bg-secondary-focus transition-colors"
        >
          <h2 className="text-2xl font-bold mb-4">View Progress</h2>
          <p>Check your reading stats and achievements</p>
        </Link>
      </div>
    </div>
  );
}
