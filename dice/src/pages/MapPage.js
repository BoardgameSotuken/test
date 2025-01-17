import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const VideoStream = () => {
  const [frame, setFrame] = useState(""); // フレームデータを格納
  const [isConnected, setIsConnected] = useState(false); // 接続状態を管理
  const [list_data, setList] = useState([[]]); // list を空の配列で初期化
  const [showTable, setShowTable] = useState(false); // テーブルの表示状態を管理
  const socketRef = useRef(null); // WebSocketインスタンスを参照で保持
  const frameRef = useRef(null); // <img>タグに関連付ける
  const navigate = useNavigate();

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

        if (message.tag === "image") {
          // 映像データの更新
          if (message.data.frame) {
            setFrame(message.data.frame);
          }
      
          // マーカーリストの更新
          if (message.data.list_data) {
            setList(message.data.list_data); // 二次リストをそのまま更新
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

  const makeMap = () => {
    let id_list = [];
    for(let i = 0; i<list_data.length; i++){
      id_list.push(list_data[i][1]);
    }
    navigate("/game", { state: { id_list }});
  }

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
        <button onClick={makeMap}>MAKE MAP</button>
      {showTable && ( // テーブルの表示状態を制御
        <div>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>ID</th>
                <th>X</th>
                <th>Y</th>
              </tr>
            </thead>
            <tbody>
              {list_data.map((row, index) => (
                <tr key={index}>
                  <td>{row[0] ?? "N/A"}</td> {/* No */}
                  <td>{row[1] ?? "N/A"}</td> {/* ID */}
                  <td>{row[2] ?? "N/A"}</td> {/* X座標 */}
                  <td>{row[3] ?? "N/A"}</td> {/* Y座標 */}
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
