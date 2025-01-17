import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WebSocketContext } from '../WebSocketContext.js';

function GoalPage() {
  const location = useLocation();
  const {message, playerNum} = location.state || {};
  const { ws, sendMessage } = useContext(WebSocketContext); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      const res = JSON.parse(event.data);
      switch(res.tag){
        case 'newGame':
          navigate('/game',{state:{playerNum:playerNum}});
          break;
        default:
            break;
      };
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws]);

  function handleClick(){
    const messageData ={
        playerNum : null,
        tag : 'restart',
        data : null
    }
    ws.send(JSON.stringify(messageData));
  }

  return (
    <>
    <div className="message">
        <p>{message}</p>
    </div>
    <div>
        <button onClick={handleClick}>もう一度遊ぶ</button>
    </div>
    </>
  );
}

export default GoalPage;
