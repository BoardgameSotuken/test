// WebSocketContext.js
import React, { createContext, useState, useEffect } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://172.16.2.125:8080');

    socket.onopen = () => {
      setWs(socket);
    };

    socket.onclose = () => {
    };

    return () => {
      if (socket) socket.close();
    };
  }, []);

  // メッセージをサーバに送信する関数
  const sendMessage = (playerNum, tag, data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = { playerNum,  tag, data };
      ws.send(JSON.stringify(message));
    } else {
      console.log('WebSocket is not open');
    }
  };

  return (
    <WebSocketContext.Provider value={{ ws, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};