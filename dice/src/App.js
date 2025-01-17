import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './WebSocketContext.js';
import JoinPage from './pages/JoinPage.js';
import MapPage from './pages/MapPage.js';
import MakeMapPage from './pages/MakeMapPage.js';
import CameraPage from './pages/CameraPage.js';
import GamePage from './pages/GamePage.js';
import GoalPage from './pages/GoalPage.js';
import './App.css';

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<JoinPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/makemap" element={<MakeMapPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/goal" element={<GoalPage />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
