const WebSocket = require('ws');
const join = require('./playerJoin'); 
const ctrl = require('./control'); 
let Res_msg 

// WebSocketサーバーをポート8080で作成
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
	//コネクションごとにUUIDを作成
	join.setUUID(ws);

	ws.on('message', (message) => {

		try{
			const req = JSON.parse(message);
			if (req.tag) {
				switch (req.tag) {
				  case 'join':
					join.setPlayerList(ws);
					join.sendPlayerCnt(wss);
					break;
		  
				  case 'arco':
					console.log(req.marker_id);
					ctrl.setRole(wss, req.marker_id);
					break;
		  
				  case 'getRoles':
					const roles = ctrl.getRoles();
					sendDataToAll('sendRoles', roles);
					break;
		  
				  case 'dice':
					const currentPositions = ctrl.movePosition(req.data);
					sendDataToAll('position', currentPositions);
					break;
		  
				  case 'image':
					const frame = req.data;      // 映像データ
					const list_data = req.list; // マーカー情報
					sendDataToAll('image', { frame, list_data }); // frameとlist_dataを一緒に送信
					break;
		  
				  default:
					console.log("Unknown tag:", req.tag);
					break;
				}
			  }
		  
			  // `button`の処理
			if (req.button) {
				switch (req.button) {
				  case 'send':
					console.log("でーたじゅんしん");
					break;
					
				  case 'get':
					console.log('そうしん');
					ws.send(getResponce());
					break;

				  default:
					console.log("Unknown button:", req.button);
					break;
				}
			  }

		}catch(error){
			sendDataToAll('list', message);
			setResponce("notset");
		}
	});

	ws.on('close', () => {
    	//接続が切れた時playerListからUUIDを削除
		join.deleteUUID(ws);
    	//プレイヤーの人数を各クライアントに通知
		join.sendPlayerCnt(wss);
	});
});

//クライアント全員にデータを送る関数
function sendDataToAll(scene, data = null){
	const messageData = {
		tag : scene,
		data : data,
	}
	wss.clients.forEach(client => {
		client.send(JSON.stringify(messageData));
	});
}

//特定のUUIDにデータを送る関数
function sendDataToUUID(playerNo, scene, data = null) {
    const ws = join.getWsList[playerNo];
    if (ws && ws.readyState === WebSocket.OPEN) {
        const messageData = {
            tag: scene,
            data: data
        };
        ws.send(JSON.stringify(messageData));
    }
}

function getResponce(){
	return Res_msg;
}

function setResponce(data = null){
	Res_msg = data;
}

console.log('WebSocket server is running on ws://localhost:8080');


