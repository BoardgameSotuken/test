import ctrl from './Control.js';
import { sendMessage } from './Server.js';

function effect(id, p, t, diceNum, mapIdx1, mapIdx2) {
    switch (id) {
        case 0:
            getItem(p);
            break;
        case 1:
            healHP(p, t, 1);
            break;
        case 2:
            healHP(p, t, 2);
            break;
        case 3:
            attackHP(p, t, 1);
            break;
        case 4:
            attackHP(p, t, 2);
            break;
        case 5:
            makeLoseTurn(p, t);
            break;
        case 6:
            preventEffect(p, t);
            break;
        case 7:
            makeMoveThree(p, t);
            break;
        case 8:
            makeMoveTwo(p, t);
            break;
        case 9:
            evenDice(p);
            break;
        case 10:
            oddDice(p);
            break;
        case 11:
            selectDice(p, diceNum);
            break;
        case 12:
            exchangeMapIdx(mapIdx1, mapIdx2);
            break;
        default:
            break;
    }
}

function getItem(p) {
    const newItem = makeItem();
    ctrl.players[p].items.push(newItem);
    sendMessage(p, '新しいアイテムを手にいれました！');
}

function healHP(p, t, num) {
    for (let i = 0; i < num; i++) {
        ctrl.changeHP(t, 1);
    }
    sendMessage(p, 'プレイヤー' + (t+1) + 'のHPを回復しました！');
    sendMessage(t, '誰かがあなたのHPを回復しました！');
}

function attackHP(p, t, num) {
    for (let i = 0; i < num; i++) {
        ctrl.changeHP(t, -1);
    }
    sendMessage(p, 'プレイヤー' + (t+1) + 'のHPを減らしました！');
    sendMessage(t, '誰かがあなたのHPを減らしました！');
}

function makeLoseTurn(p, t) {
    ctrl.players[t].loseTurnCnt += 1;
    sendMessage(p, 'プレイヤー' + (t+1) + 'を一回休みにしました！');
    sendMessage(t, '誰かがあなたを一回休みにしました！');
}

function preventEffect(p, t) {
    ctrl.players[t].preventCnt += 1;
    sendMessage(p, 'プレイヤー' + (t+1) + 'を守るアイテムを使いました！');
}

function makeMoveThree(p, t) {
    ctrl.movePosition(t, 3);
    sendMessage(p, 'プレイヤー' + (t+1) + 'を3マス進めました！');
    sendMessage(t, '誰かがあなたを3マス進めました！');
}

function makeMoveTwo(p, t) {
    ctrl.movePosition(t, -2);
    sendMessage(p, 'プレイヤー' + (t+1) + 'を2マス戻しました！');
    sendMessage(t, '誰かがあなたを2マス戻しました！');
}

function evenDice(p) {
    ctrl.players[p].evenFlg = true;
    sendMessage(p, '偶数サイコロになりました！');
}

function oddDice(p) {
    ctrl.players[p].oddFlg = true;
    sendMessage(p, '奇数サイコロになりました！');
}

function selectDice(p, diceNum) {
    ctrl.players[p].selectFlg = true;
    ctrl.players[p].selectedDiceNum = diceNum;
    sendMessage(p, 'サイコロの値を選ぶアイテムを使いました！');
}

function exchangeMapIdx(mapIdx1, mapIdx2) {
    const tmp = ctrl.mapIDList[mapIdx1];
    ctrl.mapIDList[mapIdx1] = ctrl.mapIDList[mapIdx2];
    ctrl.mapIDList[mapIdx2] = tmp;
    sendMessage(4, 'マップのマスが交換されました！');
    console.log('交換後のマップ配列: ' + ctrl.mapIDList);
}

// ランダムでアイテムを取得
function makeItem() {
    const itemList = [0, 0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
    const itemID = itemList[Math.floor(Math.random() * itemList.length)];
    return itemID;
}

const item = {
    effect,
    makeItem,
};

export default item;
