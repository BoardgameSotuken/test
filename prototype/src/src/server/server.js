const WebSocket = require('ws');
const join = require('./playerJoin'); 
const ctrl = require('./control'); 

// WebSocketサーバーをポート8080で作成
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
	//コネクションごとにUUIDを作成
	join.setUUID(ws);

	ws.on('message', (message) => {
		const reqest = JSON.parse(message);
		switch (reqest.tag) {
			case 'join':
        		//playerListにUUIDをセット
				join.setPlayerList(ws);
        		//プレイヤーの人数を各クライアントに通知
				join.sendPlayerCnt(wss);
				break;

      		case 'arco':
        		console.log(reqest.marker_id)
        		break;

      		case 'dice':
				ctrl.movePosition();
        		break;

			default:
				return;
		}
	});

	ws.on('close', () => {
    	//接続が切れた時playerListからUUIDを削除
		join.deleteUUID(ws);
    	//プレイヤーの人数を各クライアントに通知
		join.sendPlayerCnt(wss);
	});
});

console.log('WebSocket server is running on ws://localhost:8080');


