import React, { useState, useContext, useEffect } from 'react';
import { WebSocketContext } from '../WebSocketContext';

function GamePage() {
  const iconImgs = new Array("/imgs/00.png","/imgs/01.png","/imgs/02.png","/imgs/03.png","/imgs/04.png","/imgs/05.png","/imgs/06.png");
  const roleNames = ["傲慢","怠惰","暴食","色欲","憤怒","嫉妬","強欲"];

  const [role, setRole] = useState([]);
  const [icon, setIcon] = useState([]);
  const [positions, setPositions] = useState([0,0,0,0]);
  const [HP, setHP] = useState([3,3,3,3]);

  const [img, setImg] = useState("/imgs/1.png");
  let diceImgs = new Array("/imgs/1.png","/imgs/2.png","/imgs/3.png","/imgs/4.png","/imgs/5.png","/imgs/6.png");
  const [message, setMessage] = useState("プレイヤー1はサイコロを振ってください。");
  const { ws, sendMessage } = useContext(WebSocketContext);

  useEffect(() => {
    sendData('getRoles', null);
    return () => {
    };
  }, []);

  //サーバーからメッセージを受け取る時の処理
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
        const res = JSON.parse(event.data);
        switch(res.tag){
          //dataで決定されたroleNum[]を受け取る
          case 'sendRoles':
            const newRoles = [];
            const newIcons = [];
            for(let i = 0; i < 4; i++){
              newRoles.push(roleNames[res.data[i]]);
              newIcons.push(iconImgs[res.data[i]]);              
            }
            setRole(newRoles);
            setIcon(newIcons);
            break;
          case 'position':
            const newPositions = res.data;
            setPositions(newPositions);
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

  //サーバーにデータを送信
  const sendData = (scene, data = null) => {
    const messageData ={
        tag : scene,
        data : data
    }
    ws.send(JSON.stringify(messageData));
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
      <button onClick={roll}>サイコロを振る</button>
    </div>

    <div className="board">
      {Array(11).fill().map((_, index) =>(
          <div key={index} className="cell">
            {positions.map((i,playerNum) => (
            index === i ? (<img src={icon[playerNum]} width="50" height="50" />) : null))}
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
          <th>{role[0]}<img width = "100" height = "100" src = {icon[0]} name = "iconImg"/></th>
          <th>{role[1]}<img width = "100" height = "100" src = {icon[1]} name = "iconImg"/></th>
          <th>{role[2]}<img width = "100" height = "100" src = {icon[2]} name = "iconImg"/></th>
          <th>{role[3]}<img width = "100" height = "100" src = {icon[3]} name = "iconImg"/></th>
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

