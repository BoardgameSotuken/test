import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinPage() {
  const [message, setMessage] = useState(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    // ボタンが押されたときにサーバにデータを送信する処理
    setIsButtonVisible(false);
  };

  // サーバーからのメッセージで内容を更新
  const updateMessage = (res) => {
    if (res.data < 4) {
      setMessage(`現在の参加人数: ${res.data}`);
    } else if (res.data === 4) {
      setMessage(`プレイヤーが揃いました。${res.message}`);
      navigate('/camera');  // プレイヤーが4人揃ったらページ遷移
    }
  };

  return (
    <>
      <div>
        {isButtonVisible && <button onClick={handleClick}>START</button>}
      </div>
      <div>
        <p>{message}</p>
      </div>
    </>
  );
}

export default JoinPage;
