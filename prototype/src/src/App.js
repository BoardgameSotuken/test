import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './JoinPage';
import CameraPage from './CameraPage';
import './App.css';

function App() {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      setWs(socket);
    };

    socket.onmessage = (message) => {
      const response = JSON.parse(message.data);
      if (response.tag === 'join' || response.tag === 'four') {
        // JoinPageコンポーネントでメッセージの処理を行う
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (tag, data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = { tag, data };
      ws.send(JSON.stringify(message));
    } else {
      console.log('WebSocket is not open');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinPage />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </Router>
  );
}

export default App;
