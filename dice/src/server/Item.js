import { players, map } from './Control.js';

export let selectedDiceNum = 0;

function effect(id, c, t, diceNum, mapID1, mapID2) {
    switch (id) {
        case 0:
            getItem(c);
            break;
        case 1:
            healHP(c, t, 1);
            break;
        case 2:
            healHP(c, t, 2);
            break;
        case 3:
            attackHP(c, t, 1);
            break;
        case 4:
            attackHP(c, t, 2);
            break;
        case 5:
            makeLoseTurn(c, t);
            break;
        case 6:
            preventEffect(c, t);
            break;
        case 7:
            makeMoveThree(c, t);
            break;
        case 8:
            makeMoveTwo(c, t);
            break;
        case 9:
            evenDice(c);
            break;
        case 10:
            oddDice(c);
            break;
        case 11:
            selectDiceNum(c, diceNum);
            break;
        case 12:
            exchangeMapID(mapID1, mapID2);
            break;
        default:
            break;
    }
}

function getItem(c) {
    const newItem = makeItem();
    players[c].items.push(newItem);
    console.log(c + `がアイテムを手に入れるアイテムを使用しました！`);
}

function healHP(c, t, num) {
    for(let i = 0; i<num; i++){
        players[t].changeHP(1);
    }
    console.log(c + 'が' + t + `のHPを回復するアイテムを使用しました！`);
}

function attackHP(c, t, num) {
    for(let i = 0; i<num; i++){
        players[t].changeHP(0);
    }
    console.log(c + 'が' + t + `のHPを減らすアイテムを使用しました！`);
}

function makeLoseTurn(c, t) {
    players[t].loseTurnCnt += 1;
    console.log(c + 'が' + t + `を一回休みさせるアイテムを使用しました！`);
}

function preventEffect(c, t) {
    console.log(c + 'が' + t + `に使われたアイテム効果を防ぐアイテムを使用しました！`);
}

function makeMoveThree(c, t) {
    players[t].movePosition(3);
    console.log(c + 'が' + t + `に3マス進めるアイテムを使用しました！`);
}

function makeMoveTwo(c, t) {
    players[t].movePosition(-2);
    console.log(c + 'が' + t + `を2マス戻すアイテムを使用しました！`);
}

function evenDice(c) {
    players[c].changeDiceCase(5);
    console.log(`偶数ダイスにするアイテムを使用しました！`);
}

function oddDice(c) {
    players[c].changeDiceCase(6);
    console.log(`奇数ダイスにするアイテムを使用しました！`);
}

function selectDiceNum(c, diceNum) {
    players[c].changeDiceCase(7);
    selectedDiceNum = diceNum;
    console.log(`ダイスの値を指定するアイテムを使用しました！`);
}

function exchangeMapID(mapID1, mapID2) {
    const tmp = map[mapID1];
    map[mapID1] = map[mapID2];
    map[mapID2] = tmp;
    console.log('交換後のマップ配列: ' + map.map(i => i.id));
    console.log(`マスを交換するアイテムを使用しました！`);
}

//ランダムでアイテムを取得
function makeItem() {
    const itemList = [0, 0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
    const itemID = itemList[Math.floor(Math.random() * itemList.length)];
    return itemID;
}



const item = {
    effect, 
    makeItem,
}

export default item;
