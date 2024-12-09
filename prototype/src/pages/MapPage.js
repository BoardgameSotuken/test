import React, { useState, useEffect, useRef } from "react";

const VideoStream = () => {
  const [frame, setFrame] = useState(""); // フレームデータを格納
  const [isConnected, setIsConnected] = useState(false); // 接続状態を管理
  const [list_data, setList] = useState([[], [], []]); // list を空の配列で初期化
  const [showTable, setShowTable] = useState(false); // テーブルの表示状態を管理
  const socketRef = useRef(null); // WebSocketインスタンスを参照で保持
  const frameRef = useRef(null); // <img>タグに関連付ける

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
        if (!isComponentMounted) return; // コンポーネントがアンマウントされていない場合のみ処理

        const message = JSON.parse(event.data); // メッセージをJSONとして解析

        if (message.data) {
          const frame_data = message.data[0];
          const list_data = message.data[1];

          if (frame_data) {
            setFrame(frame_data); // Base64フレームを更新
          }

          if (list_data) {
            setList([list_data]); // list_dataを更新
          }
        }
      };

      ws.onclose = () => {
        if (isComponentMounted) {
          console.log("WebSocket connection closed");
          setIsConnected(false);
          setTimeout(connectWebSocket, 2000); // 2秒後に再接続
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

  useEffect(() => {
    if (frame && frameRef.current) {
      frameRef.current.src = `data:image/jpeg;base64,${frame}`;
    }
  }, [frame]);

  const toggleTable = () => {
    setShowTable(!showTable); // 表示状態を切り替え
  };

  return (
    <div>
      <h1>WebSocket Video Stream</h1>
      <div>
        <img
          ref={frameRef}
          alt="Video Frame"
          style={{ width: "640px", height: "480px" }}
        />
      </div>
      <button onClick={toggleTable}>
        {showTable ? "Hide Table" : "Show Table"} {/* ボタンのテキストを動的に変更 */}
      </button>
      {showTable && ( // テーブルの表示状態を制御
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>X</th>
                <th>Y</th>
              </tr>
            </thead>
            <tbody>
              {list_data.map((id, index) => (
                <tr key={index}>
                  <td>{list_data[0] ?? "N/A"}</td>
                  <td>{list_data[1] ?? "N/A"}</td>
                  <td>{list_data[2] ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VideoStream;
