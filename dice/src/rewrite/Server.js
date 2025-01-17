import { WebSocketServer } from 'ws';
import join from './PlayerJoin.js'; 
import ctrl from './Control.js'; 

// WebSocketサーバーをポート8080で作成
const wss = new WebSocketServer({ port: 8080 });

let d = null;
let startFlg = false;

wss.on('connection', async (ws) => {
	//コネクションごとにUUIDを作成
	join.setUUID(ws);

	ws.on('message', async (message) => {
		const req = JSON.parse(message);
		switch (req.tag) {
			case 'join':
        		//playerListにUUIDをセット
				await join.setPlayerList(ws);
        		//プレイヤーの人数を各クライアントに通知
				await join.sendPlayerCnt(wss);
				break;	

			// case 'image':
			// 	const frame = req.data;      // 映像データ
			// 	const list_data = req.list; // マーカー情報
			// 	sendDataToAll('image', { frame, list_data }); // frameとlist_dataを一緒に送信
			// 	break;
			
			case 'start':
				if(startFlg) break;
				if(req.playerNum === 1){
					ctrl.start();
					startFlg = true;
					sendDataToAll('playerNum', null);
				}
				break;

			//最新情報を更新
			case 'update':
				d = ctrl.getData();
				sendDataToAll('update', d);
				break;

			case 'role':
				await ctrl.roleTurn(req.playerNum, req.data);
				d = ctrl.getData();
				sendDataToAll('update', d);
				break;

			case 'item':
				await ctrl.itemTurn(req.playerNum, req.data);
				d = ctrl.getData();
				sendDataToAll('update', d);
				break;

			case 'dice':
				await ctrl.rollDice(req.playerNum, req.data);
				d = ctrl.getData();
				sendDataToAll('position', d);
				break;

			case 'space':
				ctrl.spaceTurn(req.playerNum, req.data);
				d = ctrl.getData();
				sendDataToAll('update', d);
				break;

			case 'restart':
				ctrl.restart(); //インスタンスのリセット
				startFlg = false;
				d = null;
				sendDataToAll('newGame', null);
				break;

			default:
				return;
		}
	});

	ws.on('close', () => {
    	//接続が切れた時playerListからUUIDを削除
		join.deleteUUID(ws);
		join.sendPlayerCnt(wss);
	});
});

//クライアント全員にデータを送る関数
function sendDataToAll(tag, data = null){
	const messageData = {tag, data};
	wss.clients.forEach(client => {
		client.send(JSON.stringify(messageData));
	});
}

//特定のUUIDにデータを送る関数
function sendDataToUUID(playerNo, scene, data = null) {
    const wsList = join.getWsList();
    const ws = wsList[playerNo];
    const messageData = {
        tag: scene,
        data: data
    };
	console.log(ws + "に" + playerNo)
    ws.send(JSON.stringify(messageData));
}

//状況に応じた説明文を送信。playerNo1~3のときはそのプレイヤーに、4のときは全員に送信
export function sendMessage(playerNo, message) {
	const messageData = {
        tag: 'message',
        message : message
    };
	if(playerNo >= 0 && ctrl.players.length > playerNo){
		const wsList = join.getWsList();
		const ws = wsList[playerNo];
		ws.send(JSON.stringify(messageData));
	}else if(playerNo === ctrl.players.length){
		wss.clients.forEach(client => {
			client.send(JSON.stringify(messageData));
		});
	}else if(playerNo > ctrl.players.length){  //ゴールのとき
		wss.clients.forEach(client => {
			client.send(JSON.stringify({ tag: 'goal', message: message }));
		});
	}
}

console.log('WebSocket server is running on ws://localhost:8080');