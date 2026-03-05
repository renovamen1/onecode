import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TitlePage } from './pages/TitlePage';
import { RegisterPage } from './pages/RegisterPage';
import { MapPage } from './pages/MapPage';
import { LevelPage } from './pages/LevelPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { VictoryPage } from './pages/VictoryPage';
import { ToastContainer } from './components/ui/Toast';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TitlePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/level/:levelId" element={<LevelPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/victory" element={<VictoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
