import GameMap from './GameMap.js'
import Player from './Player.js'
import item from './Item.js';

export let players = [];
let cPlayer = 0;
let turnCnt = 0;

const mapID = [0,1,2,3,4,5,6,0,1,2,3,4,5,6];
export let map = [];

let usedItems = [];
let startFirst = false;

//ゲームの初期化
function start(){
    if(startFirst) return;
    let roleNums = [0,1,2,3,4,5,6];
    for(const i of roleNums){
        const rnd = Math.floor(Math.random() * roleNums.length);
        const tmp = roleNums[i];
        roleNums[i] = roleNums[rnd];
        roleNums[rnd] = tmp;
    }
    for(let i = 0; i<4; i++){
        players.push(new Player(i, roleNums[i]));
    }
    //マップ生成
    for(const i of mapID){
    map.push(new GameMap(i));
    }
    //初期アイテム獲得
    for(let i = 0; i<4; i++){
    for(let j = 0; j<3; j++){
        const newItem = item.makeItem();
        players[i].items.push(newItem);
    }
    }
    console.log(map.map(i => i.id));
    startFirst = true;
}

function getData(){
    const roles = players.map(r => r.roleNum);
    const positions = players.map(p => p.position);
    const hps = players.map(h => h.hp);
    const itemsList = [];
    for(let i = 0; i<4; i++){
        itemsList.push(players[i].items);
    }
    return {
        roles : roles, 
        positions : positions, 
        hps : hps,
        items : itemsList,
        player : cPlayer,
        turnCnt : turnCnt,
        mapList : map.map(i => i.id)
        };
}

//ターン処理
export function turn(){
    players[cPlayer].turnCnt += 1;
    if(turnCnt % players.length === 0) {
        settlement();
    }
    if(players[cPlayer].loseTurnCnt > 0){
        players[cPlayer].loseTurnCnt -= 1;
        nextPlayer();
        console.log('ターンをスキップします')
        return;
    }else if(players[cPlayer].hp < 1){
        players[cPlayer].hp = 3;
        nextPlayer();
        console.log('体力がないため、一回休みして回復します')
    }else return;
}

//清算ターンの処理
function settlement(){
    console.log('清算ターンです')
    for(let i = 0; i < usedItems.length; i++){
        if(usedItems[i][2] !== null){
            console.log(usedItems[i]);
            if(players[usedItems[i][2]].preventCnt > 0){
                console.log(players[usedItems[i][1]].playerNum + 'が使用したID：' + usedItems[i][0] + 'のアイテムは効果防止アイテムにより相殺されました。');
                continue;
            }else{
                //お守りがあるか走査
                const amuletIndex = players[usedItems[i][2]].items.indexOf(13);
                if(amuletIndex === -1) item.effect(usedItems[i][0], usedItems[i][1], usedItems[i][2]);
                else{
                    players[usedItems[i][2]].items.splice(amuletIndex, 1);
                    console.log(players[usedItems[i][1]].playerNum + 'が使用したID：' + usedItems[i][0] + 'のアイテムはお守りにより相殺されました。');
                }
            }
        }else item.effect(usedItems[i][0], usedItems[i][1], usedItems[i][2]);
    }
    usedItems = [];
    console.log('清算ターンが終了しました')
    return;
}

//次のプレイヤーの選択
export function nextPlayer(){
    turnCnt += 1;
    cPlayer = cPlayer === 3 ? 0 : cPlayer+1;
}

//サイコロを振る
function rollDice(num){
    players[cPlayer].rollDice(num);
}

function useRoleEffect(t = null){
    players[cPlayer].effect(t);
}

function useItem(id, index, target, diceNum = null, mapID1 = null, mapID2 = null) {
    if(id === 0 || id >= 9 && id <= 12){
        item.effect(id, cPlayer, null, diceNum, mapID1, mapID2);
    }else if(id === 13) return;
    else if(id === 6){
        players[target].preventCnt += 1; 
    }
    else usedItems.push([id, cPlayer, target]);
    players[cPlayer].items.splice(index, 1);
}

export default { players, start, getData, turn, rollDice, 
    useRoleEffect, useItem};