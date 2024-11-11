let players = [];
let currentPlayer = 0;
let goal = 10;

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

// WebSocketサーバーをポート8080で作成
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  const clientId = uuidv4(); // クライアントごとにUUIDを生成
  console.log(`Client connected: ${clientId}`);

  // クライアントからメッセージを受け取った時の処理
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    // メッセージの種類に応じた処理を分岐
    switch (parsedMessage.type) {
      case 'start':
        console.log(`${clientId}: Game Start`);
        const roleNums = start();
        currentPlayer = 0;
        ws.send(JSON.stringify({ type: 'start', data: roleNums }));
        break;
      case 'dice':
        console.log(`${clientId}: ${parsedMessage.number}`);
        const reqNum = parsedMessage.number;
        const resPositions = addPosition(currentPlayer,reqNum);
        const resNextPlayer = turn();
        currentPlayer = resNextPlayer;
        ws.send(JSON.stringify({ type: 'dice', next : resNextPlayer, positions : resPositions  }));
        break;
      case 'arco':
        console.log(parsedMessage.marker_id)
        break;
      default:
        console.log(`Unknown message type from ${clientId}`);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${clientId}`);
  });
});

console.log('server listening...');

class Player{
    constructor(num){
        this.roleNum = num;
        this.position = 0;
        this.hp = 3;
        this.items = [];
    }
}

function start(){
  //0~6からランダムに4つの数字を選び振り分ける
  let roleNums = [0,1,2,3,4,5,6];
  for(let i = 0; i<6; i++){
    let random = Math.floor(Math.random()*6);
    let tmp = roleNums[i];
    roleNums[i] = roleNums[random];
    roleNums[random] = tmp;
  }
  players = [new Player(roleNums[0]),new Player(roleNums[1]),new Player(roleNums[2]),new Player(roleNums[3])];

  //playersの中からroleNumのみの配列を返す
  return players.map(r => r.roleNum);
}

//次のプレイヤーの選択
function turn(){
    let nextPlayer = currentPlayer === 3 ? 0 : currentPlayer+1;
    return nextPlayer;
}

//サイコロを振ってその数進む
function addPosition(num,diceNum){    
    players[num].position = players[num].position + diceNum +1;
    //ゴール地点で止まる
    if(players[num].position>goal) players[num].position = goal;
    return players.map(p => p.position);
}