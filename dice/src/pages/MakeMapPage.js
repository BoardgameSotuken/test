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

  const renderSquares2 = () => {
    return list_data.map((row, index) => (
      <div key={index} style={{ position: 'absolute', left: row[2], top: row[3], width: '80px', height: '80px', backgroundColor: 'lightblue', border: '1px solid black' }}>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {row[1]}  {/* ID */}
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