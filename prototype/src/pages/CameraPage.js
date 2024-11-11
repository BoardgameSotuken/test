import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../WebSocketContext';

function CameraPage(){
    const [playerNo, setPlayerNo] = useState(1);
    const [message, setMessage] = useState('役職を決定します。');
    const [arcoCnt, setArcoCnt] = useState(0);
    const { ws, sendMessage } = useContext(WebSocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!ws) return;
    
        const handleMessage = (event) => {
            const res = JSON.parse(event.data);
            switch(res.tag){
                case 'role':
                    setMessage('役職は' + res.data + 'です。')
                    setPlayerNo(prevNo => prevNo + 1);
                    setArcoCnt(prevCount => prevCount + 1);
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

    useEffect(() => {
        //4回分の'arco'メッセージを受信したらGamePageへ遷移
        if (arcoCnt === 4) {
            navigate('/game');
        }
    }, [arcoCnt]);

    return(
        <>
        <div>
            <p>{message}</p>
            <p>プレイヤー{playerNo}はカメラにArcoマーカーをかざしてください</p>
        </div>
        </>
    );
}

export default CameraPage;