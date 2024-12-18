import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const MakeMapPage = () => {
  const { state } = useLocation();  // locationからstateを取得
  const list_data = state?.list_data || [];  // list_dataを取得（ない場合は空の配列）
  const navigate = useNavigate();

  // すごろくのマスを描画する関数
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',  // 5列でグリッド
    gridGap: '10px',  // マス間の間隔
    width: '80%',  // グリッドの幅
    margin: 'auto',  // 中央に配置
    paddingTop: '20px',  // 上部のスペースを確保
  };

  // すごろくのマスを描画する関数
  const renderSquares = () => {
    return list_data.map((row, index) => (
      <div
        key={index}
        style={{
          width: '80px', 
          height: '80px',
          backgroundColor: 'lightblue', 
          border: '1px solid black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        {row[1]}  {/* ID */}
      </div>
    ));
  };

  const isOverlapping = (rect1, rect2) => {
    return (
      rect1.left < rect2.left + rect2.width &&
      rect1.left + rect1.width > rect2.left &&
      rect1.top < rect2.top + rect2.height &&
      rect1.top + rect1.height > rect2.top
    );
  };

  const adjustSizes = (list) => {
    const result = [...list];
  
    for (let i = 0; i < result.length; i++) {
      const current = result[i];
      let adjusted = false;
  
      for (let j = 0; j < i; j++) {
        const compared = result[j];
        const rect1 = { left: current[2], top: current[3], width: 80, height: 80 };
        const rect2 = { left: compared[2], top: compared[3], width: 80, height: 80 };
  
        if (isOverlapping(rect1, rect2)) {
          // サイズ調整: ここでサイズを小さくする (例: 10pxずつ)
          current[2] += 10; // X座標を右に移動
          current[3] += 10; // Y座標を下に移動
          adjusted = true;
        }
      }
  
      // サイズを変える (重なりが見つかるたびにサイズ縮小)
      if (adjusted) {
        current[4] = Math.max(current[4] - 10, 30); // 最小サイズは30にする
      }
    }
  
    return result;
  };
  const renderSquares2 = () => {
    const adjustedList = adjustSizes(list_data);

    return adjustedList.map((row, index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: row[2],
          top: row[3],
          width: "80px",
          height: "80px",
          backgroundColor: "lightblue",
          border: "1px solid black",
          width: `${row[4]}px`, // サイズを反映
          height: `${row[4]}px`, // サイズを反映
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {row[1]}
        </span>
      </div>
    ));
  };

  const backMap  = () =>{
    navigate("/map")
  }

  return (
    <div>
        <div>
            <h1>Make Map</h1>
            <div style={gridStyle}>
                {renderSquares()}
            </div>
        </div>
        <div>
            <h1>Make Map</h1>
            <div style={{ position: 'relative', width: '1000px', height: '500px' }}>
                {renderSquares2()}
            </div>
        </div>
        <div>
            <button onClick={backMap}>やりなおす</button>
        </div>
    </div>
  );
};



export default MakeMapPage;