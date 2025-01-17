import './GamePage.css';
import Modal from "./Modals/Modal.js";
import ItemModal from './Modals/ItemModal.js';
import MapModal from './Modals/MapModal.js';
import LogModal from './Modals/LogModal.js';
import { roleData, itemData, campData, diceImgs } from './Data.js'
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WebSocketContext } from '../WebSocketContext.js';

function App() {
  const [myNum, setMyNum] = useState(0);                  //プレイヤー番号
  const [player, setPlayer] = useState(0);                //現在のプレイヤー
  const [turn, setTurn] = useState(1);                    //現在何巡目か
  const [role, setRole] = useState([3,3,3,3]);            //全員の役職番号
  const [camp, setCamp] = useState([0,0,0,0])             //全員の陣営
  const [positions, setPositions] = useState([0,0,0,0]);  //全員のマス位置
  const [HP, setHP] = useState([3,3,3,3]);                //全員のHP
  const [item, setItem] = useState([[],[],[],[]]);        //全員のアイテム
  const [mapList, setMapList] = useState([]);             //現在のマスIDリスト
  const [currentCase, setCurrentCase] = useState(null);   //役職・アイテム・マス効果のケース
  const [turnCnt, setTurnCnt] = useState(0);              //ターンのカウント(巡目はturnCnt/プレイヤーの数の商+1)
  const { ws, sendMessage } = useContext(WebSocketContext); //wsインスタンスにアクセス

  const [roleFlg, setRoleFlg] = useState(false);          //役職効果を使うかのフラグ
  const [diceValue, setDiceValue] = useState(1);          //サイコロの値
  const [diceImg, setDiceImg] = useState(diceImgs[0]); 
  const [desc, setDesc] = useState('');                   //アイテムの説明文

  //状況に応じて表示されるもの
  const [showModal, setShowModal] = useState(false);      //モーダルの表示
  //モーダルの種類(0:YesNo, 1:アイテム選択, 2:ターゲット選択, 3:サイコロ, 4:サイコロ値確定, 5:マップ交換)
  const [modalCase, setModalCase] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  let playLog = [];
  const [playLogs, setPlaylogs] = useState([]);
  const [itemIdx, setItemIdx] = useState(null);           //アイテムのインデックス
  const [mapIdx1, setMapIdx1] = useState(null);           //マス交換
  const [messageQueue, setMessageQueue] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {playerNum} = location.state || {};


  useEffect(() => {
    setMyNum(playerNum);
    setDiceValue(Math.floor(Math.random() * 6)+1)
  }, []);

  useEffect(() => {
    sendData('start', null);
  }, [myNum])


  //サーバーからメッセージを受け取る時の処理
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      const res = JSON.parse(event.data);
      switch(res.tag){
        case 'playerNum':
          sendData('update', null);
          break;
        case 'update':
          dataSet(res.data);
          break;
        case 'position':
          dataSet(res.data);
          setModalCase(0);
          break;
        case 'message':
          addMessage(res.message);
          break;
        case 'goal':
          navigate('/goal',{ state:{message : res.message, playerNum:playerNum }});
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

  //myNumとcurrentCaseに合わせて状況を管理
  useEffect(() => {
    if(myNum === player){
      switch(currentCase){
        case 0:   //役職効果
          setModalCase(0);
          break;
        case 1:   //アイテム効果
          setModalCase(1);
          break;
        case 2:   //サイコロを振ってマスを進める
          setModalCase(3);
          break;
      }
    }
  }, [currentCase, turnCnt])

  useEffect(() => {
    if(myNum === player) setShowModal(true);
  }, [modalCase, turnCnt])


  //データをセット
  function dataSet(d){
    setPlayer(d.player);
    setRole(d.roles);
    setHP(d.hps);
    setItem(d.items);
    setCamp(d.camps);
    setPositions(d.positions);
    setMapList(d.mapList);
    setCurrentCase(d.case);
    setTurnCnt(d.turn);
  }

  //turnCntが変更されたとき何巡目か表示
  useEffect(() => {
    const newTurn = Math.floor(turnCnt/4) + 1;
    setTurn(newTurn);
  }, [turnCnt])

  //キュベレーの能力を発動したときの処理
  useEffect(() => {
    if(role[myNum] !== 3){
      setModalCase(0);
    }
  }, [role[myNum]])

  //サーバーにデータを送信
  function sendData(scene, data = null){
    const messageData ={
        playerNum : myNum,
        tag : scene,
        data : data
    }
    ws.send(JSON.stringify(messageData));
  }

  //サイコロの値を変更
  function handleDiceInput(e) {
    const value = parseInt(e.target.value, 10);
    setDiceValue(value);
  }

  function rollDice(){
    setDiceNum();
    if(currentCase === 0) sendData('role', { yn : 'yes', diceNum : diceValue});
    else if(currentCase === 2){
      sendData('dice', { diceNum: diceValue })
      setModalCase(false);
    }
  }

  function setDiceNum(){
    const rndNum = Math.floor(Math.random()*6) + 1;
    setDiceValue(rndNum);
  }

  function selectDice(){
    sendData('item', {yn : 'yes', id: 11, diceNum : diceValue, itemIdx : itemIdx});
    setModalCase(1);
  }

  //YesNoボタン押したとき
  function handleYNClick(yn){
    if(currentCase === 0){                          //役職効果YesNo
      if(yn === 'yes') setRoleFlg(true);
      else sendData('role', { yn : 'no' });
    }else if(currentCase === 1){                    //アイテムを「使わない」を選択
      if(yn === 'no') sendData('item', { yn : 'no' });
    }else if(currentCase === 2){                    //マス効果YesNo
      if(yn === 'yes'){
        if(mapList[positions[myNum]] === 2){        //アイテム交渉交換
          sendData('space', { yn : 'yes' });
        }else if(mapList[positions[myNum]] === 3){  //アイテム強制交換
          setModalCase(1);
        }else sendData('space', { yn : 'yes' });
      }
      else sendData('space', { yn : 'no' });
    }
    setShowModal(false);
  }

  //役職効果Yesのときの分岐
  useEffect(() => {
    if(roleFlg){
      if(role[myNum] === 0) setModalCase(2);                           //パイオニア：ターゲット選択
      else if(role[myNum] === 2) setModalCase(1);                      //レゾンデートル：アイテムのインデックス選択
      else if(role[myNum] ===3 || role[myNum] ===6) setModalCase(3);   //キュベレーorギャンブラー：サイコロを振る
      else sendData('role', { yn : 'yes' });
      setRoleFlg(false);
    }
  }, [roleFlg])

  //アイテム選択時の処理
  function handleItemClick(idx){
    if(currentCase === 0) sendData('role', { yn : 'yes', itemIdx : idx});
    else if(currentCase === 1){
      const id = item[myNum][idx];
      setItemIdx(idx);
      if(id >= 1 && 8 >= id) setModalCase(2);   //ターゲットのいるアイテム
      else if(id === 11) setModalCase(4);       //サイコロ値選択
      else if(id === 12) setModalCase(5);       //マス交換
      else if(id === 13) return;                //おまもり
      else sendData('item', { yn : 'yes', id : id ,itemIdx : idx});  //ほか
    }else if(currentCase === 2){
      sendData('space', { yn : 'yes', itemIdx : idx })
    }
  }

  //対象プレイヤーの選択
  function handleTargetClick(targetPlayer){
    if(currentCase === 0 && role[myNum] === 0) sendData('role', { yn : 'yes', target :targetPlayer });  //パイオニア使用の場合
    else if(currentCase === 1){
      sendData('item', { yn : 'yes', target : targetPlayer, id : item[myNum][itemIdx], itemIdx : itemIdx});
      setModalCase(1);
    }
  }

  //マス交換アイテムの選択
  function selectMapIdx(idx){
    if(mapIdx1 === null){
      setMapIdx1(idx);
    }else{
      sendData('item',{ yn : 'yes', id : 12, itemIdx : itemIdx, mapIdx1 : mapIdx1, mapIdx2 : idx});
      setMapIdx1(null);
      setModalCase(1);
    }
  }

  //オンマウスで説明を表示
  const handleMouseEnter = (index) => {
    setDesc(itemData[index].desc);
  };

  const handleMouseLeave = () => {
    setDesc('　　　　　　　　　　　');
  };  

  const addMessage = (message) => {
    setMessageQueue((prev) => [...prev, message]);
    playLog.push(message);
    setPlaylogs(playLog);

    // 5秒後に消す
    setTimeout(() => {
      setMessageQueue((prev) => prev.filter((msg) => msg !== message));
    }, 5000);
  }; 


  //画面に表示
  return (
    <>
    <div className="container">
      <div className={campData[camp[myNum]].id === 0 ? 'dasshutsu' : 'soshi'}>
        <div className="message-container">
          {messageQueue.map((msg, index) => (
            <div key={index} className="message-popup">
              {msg}
            </div>
          ))}
        </div>
        <div className='turn'>
          <p>Turn{turn}</p>
          <p>現在のプレイヤー  {player+1}</p>
        </div>
        <img src="/imgs/role.png" alt="役職画像" class="role-image" />
        <img src={campData[camp[myNum]].img} class="camp" />
        <div class="right-side">
        <div className='player'>
        　💀PlayerNo.{myNum+1}　
          💛HP × {HP[myNum]}
        </div>
            <div class="right-side-top">
                <div class="role-button"><img src={roleData[role[myNum]].button} /></div>
                <div class="item-button" onClick={() => setShowItemModal(true)}><img src="/imgs/item-button.png" /></div>
            </div>
            <div class="right-side-bottom">
                <div class="map-button" onClick={() => setShowMapModal(true)}><img src="/imgs/map-button.png" /></div>
                <div class="log-button" onClick={() => setShowLogModal(true)}><img src="/imgs/log-button.png" /></div>
            </div>
        </div>  
        {player === myNum && showModal && (
          <Modal
            modalCase={modalCase}
            currentCase={currentCase}
            role={role}
            myNum={myNum}
            item={item}
            desc={desc}
            mapList={mapList}
            mapIdx1={mapIdx1}
            diceValue={diceValue}
            diceImg={diceImg}
            handleYNClick={handleYNClick}
            handleItemClick={handleItemClick}
            handleTargetClick={handleTargetClick}
            handleDiceInput={handleDiceInput}
            rollDice={rollDice}
            selectDice={selectDice}
            selectMapIdx={selectMapIdx}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />
        )}
        {showItemModal && (
          <ItemModal
            onClose={() => setShowItemModal(false)} // モーダルを閉じる処理
            item={item}
            myNum={myNum}
          />
        )}
        {showLogModal && (
          <LogModal
            onClose={() => setShowLogModal(false)} // モーダルを閉じる処理
            messageQueue = {playLogs}
          />
        )}
        {showMapModal && (
          <MapModal
            onClose={() => setShowMapModal(false)} // モーダルを閉じる処理
            mapList = {mapList}
            positions = {positions}
          />
        )}
        </div>
      </div>
    </>
  );
}

export default App;
