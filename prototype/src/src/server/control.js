let players = [];
let currentPlayer = 0;
const goal = 10;

class Player{
    constructor(num){
        this.roleNum = num;
        this.position = 0;
        this.hp = 3;
        this.items = [];
    }
}

function start(){
    console.log(`Game Start`);
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
function movePosition(num,diceNum){    
    players[num].position = players[num].position + diceNum +1;
    //ゴール地点で止まる
    if(players[num].position>goal) players[num].position = goal;
    return players.map(p => p.position);
}

module.exports = { start, turn, movePosition };