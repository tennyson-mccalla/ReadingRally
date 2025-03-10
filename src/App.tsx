import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Progress from './pages/Progress';
import ReadingSession from './pages/ReadingSession';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reading" element={<ReadingSession />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </BrowserRouter>
  );
}
