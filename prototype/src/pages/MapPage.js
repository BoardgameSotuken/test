import React, { useState, useEffect, useRef } from "react";

const VideoStream = () => {
  const [frame, setFrame] = useState(""); // フレームデータを格納
  const [isConnected, setIsConnected] = useState(false); // 接続状態を管理
  const [list, setList] = useState([]); // list を空の配列で初期化
  const socketRef = useRef(null); // WebSocketインスタンスを参照で保持

  useEffect(() => {
    let isComponentMounted = true; // アンマウント後の呼び出しを防止

    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:8080");
      socketRef.current = ws;

      ws.onopen = () => {
        if (isComponentMounted) {
          console.log("WebSocket connection established");
          setIsConnected(true);
        }
      };

      ws.onmessage = (event) => {
        if (!isComponentMounted) return;  // コンポーネントがアンマウントされていない場合のみ処理
      
        const message = JSON.parse(event.data);  // メッセージをJSONとして解析
        
        // messageにimage_dataとlist_dataのどちらも含まれている場合に処理
        if (message.data) {
          const frame_data = message.data.frame_data;
          const list_data = message.data.list_data;
          
          // frame_dataがある場合
          if (frame_data) {
            setFrame(frame_data);  // Base64フレームを更新
          }
      
          // list_dataがある場合
          if (list_data) {
            setList(list_data);  // list_dataを更新
          }
        }
      };

      ws.onclose = () => {
        if (isComponentMounted) {
          console.log("WebSocket connection closed");
          setIsConnected(false);
          // 再接続処理（任意）
          setTimeout(connectWebSocket, 2000); // 5秒後に再接続
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      isComponentMounted = false;
      if (socketRef.current) {
        socketRef.current.close(); // WebSocket接続を閉じる
      }
    };
  }, []);

  const setMap = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        tag: "setMap",
        data: "set",
      };
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected or not ready.");
    }
  };

  return (
    <div>
      <div>
        <h1>Video Stream</h1>
        {frame ? (
          <img
            src={`data:image/jpeg;base64,${frame}`}
            alt="Video Frame"
            style={{ width: "640px", height: "480px" }}
          />
        ) : (
          <p>No video data received</p>
        )}
      </div>
      <div className="button">
        <button onClick={setMap} disabled={!isConnected}>
          MAP決定
        </button>
      </div>
      <div>
        <p>lists:</p>
        {/* listが配列の場合、その要素をリストで表示 */}
        {Array.isArray(list) && list.length > 0 ? (
          <ul>
            {list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No list data available</p>
        )}
      </div>
    </div>
  );
};

export default VideoStream;