import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Progress from './pages/Progress';
import ReadingSession from './pages/ReadingSession';
import Dashboard from './pages/Dashboard';
import Rewards from './pages/Rewards';
import { MainLayout } from './components/layout';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reading" element={<ReadingSession />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
