import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './WebSocketContext';
import JoinPage from './pages/JoinPage';
import CameraPage from './pages/CameraPage';
import GamePage from './pages/GamePage';
import './App.css';

function App() {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<JoinPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
