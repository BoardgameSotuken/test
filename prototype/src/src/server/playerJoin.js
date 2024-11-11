const { v4: uuidv4 } = require('uuid');

const playerList = Array(4).fill(null);
const clients = new Map();

// クライアントごとにUUIDを生成してMapに格納（まだplayerListには追加しない）
function setUUID(ws) {
	const newUUID = uuidv4();
	clients.set(newUUID, ws);
	ws.uuid = newUUID; // WebSocketオブジェクトにUUIDを追加
	console.log(`Client connected: ${newUUID}`);
}

function setPlayerList(ws) {
	const emptyIndex = playerList.indexOf(null);
	if (emptyIndex === -1) {
		ws.send(JSON.stringify({ tag: 'join', message: '上限を超えたため参加できません' }));
		return;
	}
	playerList[emptyIndex] = ws.uuid;
	console.log(`Client joined: ${ws.uuid}`);
}

// クライアントが切断した場合、UUIDを削除して空きスロットを作る
function deleteUUID(ws) {
	const disconnectIndex = playerList.indexOf(ws.uuid);
	if (disconnectIndex !== -1) {
		console.log(`Client disconnected: ${ws.uuid}`);
		playerList[disconnectIndex] = null;
		clients.delete(ws.uuid);
	}
}

// クライアント全員に現在の参加人数を送信
function sendPlayerCnt(wss) {
	const playerCount = playerList.filter(uuid => uuid !== null).length;
	wss.clients.forEach(client => {
		if (playerCount === 4) {
			console.log('プレイヤーが揃いました');
			sendPlayerNum();
		} else {
			client.send(JSON.stringify({ tag: 'join', data: playerCount }));
		}
	});
	console.log(`現在の参加人数: ${playerCount}`);
}

// プレイヤーNoを通知
function sendPlayerNum() {
	for (let i = 0; i < 4; i++) {
		const ws = clients.get(playerList[i]);
		const playerNum = i + 1;
		const message = 'あなたはプレイヤー' + playerNum + 'です';
		ws.send(JSON.stringify({ tag: 'four', data: 4, message: message }));
	}
}

//プレイヤーリストを取得
function getPlayerList(){
    return playerList;
}

module.exports = { setUUID, setPlayerList, deleteUUID, sendPlayerCnt, sendPlayerNum ,getPlayerList };
