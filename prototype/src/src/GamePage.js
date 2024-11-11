import './App.css';
import { useState, useEffect } from 'react';

function GamePage() {
  const icon = new Array("/imgs/00.png","/imgs/01.png","/imgs/02.png","/imgs/03.png","/imgs/04.png","/imgs/05.png","/imgs/06.png");
  const roleNames = ["傲慢","怠惰","暴食","色欲","憤怒","嫉妬","強欲"];

  const [positions, setPositions] = useState([0,0,0,0]);
  const [HP, setHP] = useState([3,3,3,3]);

  const [img, setImg] = useState("/imgs/1.png");
  let diceImgs = new Array("/imgs/1.png","/imgs/2.png","/imgs/3.png","/imgs/4.png","/imgs/5.png","/imgs/6.png");
  const [message, setMessage] = useState("プレイヤー1はサイコロを振ってください。");

  //初回のみ処理実行
  useEffect(() => {

    return () => {

    };
  }, []);

  //サーバーにデータを送信
  const sendData = (ws, scene, diceNum = null) => {
    const data ={
        tag : scene,
        number : diceNum
    }
    ws.send(JSON.stringify(data));
  }

  //サイコロを振る
  function roll(){
    let diceNum = Math.floor(Math.random()*6);
    setImg(diceImgs[diceNum]);
    sendData('dice', diceNum);
    return diceNum;
    }

  //画面に表示
  return (
    <>
    <div className="App">
      <header className="App-header">
        <h1>プロトタイプゲーム</h1>
      </header>
      <h2>{message}</h2>
    </div>
    <div className="dice">
      <img width = "150" height = "150" src = {img} name = "diceImg"/>
    </div>
    <div className="button">
    <button onClick={gameStart}>ゲームを開始する</button>
      <button onClick={roll}>サイコロを振る</button>
    </div>

    <div className="board">
      {Array(11).fill().map((_, index) =>(
          <div key={index} className="cell">
            {positions.map((i,playerNum) => (
            index === i ? (<img src={icons[playerNum]} width="50" height="50" />) : null))}
          </div>
      ))}
    </div>

    <br></br>

    <div className="chart">
      <table border="1" width="80%">
        <tr>
          <th>プレイヤー</th>
          <th>１</th>
          <th>２</th>
          <th>３</th>
          <th>４</th>
        </tr>
        <tr>
          <th>役職</th>
          <th>{roles[0]}<img width = "100" height = "100" src = {icons[0]} name = "iconImg"/></th>
          <th>{roles[1]}<img width = "100" height = "100" src = {icons[1]} name = "iconImg"/></th>
          <th>{roles[2]}<img width = "100" height = "100" src = {icons[2]} name = "iconImg"/></th>
          <th>{roles[3]}<img width = "100" height = "100" src = {icons[3]} name = "iconImg"/></th>
        </tr>
        <tr>
          <th>コマの位置</th>
          <th>{positions[0]}</th>
          <th>{positions[1]}</th>
          <th>{positions[2]}</th>
          <th>{positions[3]}</th>
        </tr>
        <tr>
          <th>HP</th>
          <th>{HP[0]}</th>
          <th>{HP[1]}</th>
          <th>{HP[2]}</th>
          <th>{HP[3]}</th>
        </tr>
      </table>
    </div>
    </>
  );
}

export default GamePage;

