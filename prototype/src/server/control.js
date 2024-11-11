let players = [];
let currentPlayer = 0;
const goal = 10;
const roleNames = ["傲慢","怠惰","暴食","色欲","憤怒","嫉妬","強欲"];

class Player{
    constructor(num){
        this.roleNum = num;
        this.position = 0;
        this.hp = 3;
        this.items = [];
    }
}

function setRole(wss, num){
    console.log(`Game Start`);
    players.push(new Player(num));
    wss.clients.forEach(client => {
		client.send(JSON.stringify({ tag: 'role', data: roleNames[num] }));
	});
}

//playersの中からroleNumのみの配列を返す
function getRoles(){
    return players.map(r => r.roleNum);
}

//次のプレイヤーの選択
function turn(){
    let nextPlayer = currentPlayer === 3 ? 0 : currentPlayer+1;
    currentPlayer = nextPlayer;
}

//サイコロを振ってその数進む
function movePosition(diceNum){   
    players[currentPlayer].position = players[currentPlayer].position + diceNum +1;
    //ゴール地点で止まる
    if(players[currentPlayer].position>goal) players[currentPlayer].position = goal;
    turn();
    return players.map(p => p.position);
}

module.exports = { setRole, getRoles, turn, movePosition };