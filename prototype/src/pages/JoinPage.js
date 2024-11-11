import './JoinPage.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../WebSocketContext';

function JoinPage() {
  const [message, setMessage] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const { ws, sendMessage } = useContext(WebSocketContext);
  const navigate = useNavigate();

  const onClick = () => {
    sendMessage('join', null);
    setIsButtonVisible(false);
  };

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      const res = JSON.parse(event.data);
      updateMessage(res);
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws]);

  const updateMessage = (res) => {
    if (res.data < 4) {
      setMessage(`現在の参加人数: ${res.data}`);
    } else if (res.data === 4) {
      navigate('/camera');
    }
  };

  return (
    <div className="all">
      {isButtonVisible ? (
        <div className="button">
          <button onClick={onClick}>START</button>
        </div>
      ) : (
        <div className="message">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default JoinPage;
