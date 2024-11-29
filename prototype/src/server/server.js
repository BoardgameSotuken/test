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
			switch (req.tag) {
				case 'join':
					//playerListにUUIDをセット
					join.setPlayerList(ws);
					//プレイヤーの人数を各クライアントに通知
					join.sendPlayerCnt(wss);
					break;

				case 'arco':
					console.log(req.marker_id);
					//役職を決定し各クライアントに通知
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
					const { frame, list } = req.data;  // データから image_data と list_data を抽出
					sendDataToAll('image', {"frame_data": frame, "list_data": list});
					ws.send(getResponce());
					break;

				case 'setMap':
					console.log("でーたじゅんしん");
					setResponce(req.data);
					break

				default:
					return;
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
		data : data
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

function setResponce(data){
	Res_msg = data;
	//setTimeout(() => {Res_msg = "notset"},1000);
}

console.log('WebSocket server is running on ws://localhost:8080');


