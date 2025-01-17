import { WebSocketServer } from 'ws';
import join from './PlayerJoin.js'; 
import ctrl, { players, map } from './Control.js'; 

// WebSocketサーバーをポート8080で作成
const wss = new WebSocketServer({ port: 8080 });

let d = null;

wss.on('connection', async (ws) => {
	//コネクションごとにUUIDを作成
	join.setUUID(ws);

	ws.on('message', async (message) => {
		const req = JSON.parse(message);
		switch (req.tag) {
			case 'join':
        		//playerListにUUIDをセット
				join.setPlayerList(ws);
        		//プレイヤーの人数を各クライアントに通知
				join.sendPlayerCnt(wss);
				break;	
			
			case 'start':
				await ctrl.start();
				for(let i = 1; i<ctrl.players.length; i++){
					sendDataToUUID(i, 'playerNum', i)
				}
				break;

			//最新情報を更新
			case 'update':
				d = ctrl.getData();
				sendDataToAll('update', d);
				break;

			case 'dice':
				await ctrl.players[req.playerNum].rollDice(req.data);
				d = ctrl.getData();
				sendDataToAll('update', d);
				break;

			case 'item':
				await ctrl.useItem(ctrl.players[req.playerNum].items[req.data.index], req.data.index, req.data.target, req.data.diceNum, req.data.mapID1, req.data.mapID2);
				d = ctrl.getData();
				sendDataToAll('update', d);
				break;

			case 'role':
				await ctrl.useRoleEffect(req.data);
				d = ctrl.getData();
				sendDataToAll('update', d);
				break;

			case 'exchangeReply':
				await map[players[req.playerNum].position].doExchangeItemForced(players[req.playerNum].playerNum, req.data.index);
				d = ctrl.getData();
				sendDataToAll('update', d);
				sendDataToAll('endExchange', d);

			case 'exchangeIndex':
				await map[players[req.playerNum].position].setExchangeItem(players[req.playerNum].playerNum, req.data.index);
				sendDataToAll('canPushItem', req.playerNum);
				break;

			case 'exchangeIndex2':
				await map[players[req.data.target].position].setExchangeItem(players[req.playerNum].playerNum, req.data.index);
				d = ctrl.getData();
				sendDataToAll('endExchange', d);
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
export function sendDataToUUID(playerNo, scene, data = null) {
    const wsList = join.getWsList();
    const ws = wsList[playerNo];

    // メッセージを送信
    const messageData = {
        tag: scene,
        data: data
    };
    ws.send(JSON.stringify(messageData));
}


console.log('WebSocket server is running on ws://localhost:8080');