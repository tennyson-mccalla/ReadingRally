import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Card } from '../common/Card';
import { CardBody } from '../common/Card';
import { CardTitle } from '../common/Card';
import { Progress } from '../common/Progress';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ReadingMetrics {
  date: string;
  wpm: number;
  accuracy: number;
  fluency: number;
}

interface ProgressDashboardProps {
  readingHistory: ReadingMetrics[];
  booksCompleted: number;
  totalMinutesRead: number;
  currentLevel: number;
  nextLevelProgress: number;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  readingHistory,
  booksCompleted,
  totalMinutesRead,
  currentLevel,
  nextLevelProgress,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Prepare data for the reading speed chart
  const speedChartData: ChartData<'line'> = {
    labels: readingHistory.map(entry => formatDate(entry.date)),
    datasets: [
      {
        label: 'Words per Minute',
        data: readingHistory.map(entry => entry.wpm),
        borderColor: 'rgb(14, 165, 233)', // primary color
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Accuracy %',
        data: readingHistory.map(entry => entry.accuracy),
        borderColor: 'rgb(217, 70, 239)', // secondary color
        backgroundColor: 'rgba(217, 70, 239, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Reading Progress Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="text-center">
              <h3 className="font-bold mb-2">Current Level</h3>
              <div className="text-4xl font-bold text-primary">{currentLevel}</div>
              <Progress
                value={nextLevelProgress}
                max={100}
                variant="primary"
                size="sm"
                showLabel
                className="mt-2"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center">
              <h3 className="font-bold mb-2">Books Completed</h3>
              <div className="text-4xl font-bold text-secondary">{booksCompleted}</div>
              <p className="text-sm text-base-content/70">Great progress!</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center">
              <h3 className="font-bold mb-2">Minutes Read</h3>
              <div className="text-4xl font-bold text-accent">{totalMinutesRead}</div>
              <p className="text-sm text-base-content/70">Total reading time</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center">
              <h3 className="font-bold mb-2">Latest Speed</h3>
              <div className="text-4xl font-bold text-success">
                {readingHistory[readingHistory.length - 1]?.wpm || 0}
              </div>
              <p className="text-sm text-base-content/70">Words per minute</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardBody>
          <CardTitle>Reading Progress</CardTitle>
          <div className="w-full aspect-[2/1] min-h-[300px]">
            <Line options={chartOptions} data={speedChartData} />
          </div>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardBody>
          <CardTitle>Recent Activity</CardTitle>
          <div className="space-y-4">
            {readingHistory.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-base-200 rounded-lg">
                <div>
                  <p className="font-semibold">{formatDate(entry.date)}</p>
                  <p className="text-sm text-base-content/70">
                    {entry.wpm} WPM with {entry.accuracy}% accuracy
                  </p>
                </div>
                <div className="text-right">
                  <div className="badge badge-primary">{entry.fluency} Fluency</div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
