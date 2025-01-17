import ctrl from './Control.js';
import item from './Item.js';
import { sendMessage } from './Server.js';

function effect(id, p, data) {
    //data.itemIdx, data.target...
    switch (id) {
        case 1:
            getItem(p);
            break;
        case 2:
            exchangeItem(p);
            break;
        case 3:
            exchangeItemForced(p, data.itemIdx);
            break;
        case 4:
            decreaseHP(p);
            break;
        case 5:
            increaseHP(p);
            break;
        case 6:
            loseOneTurn(p);
            break;
        case 7:
            mystery(p);
            break;
        default:
            break;
    }
}

//1:アイテムを取得
function getItem(p) {
    const newItemID = item.makeItem();
    ctrl.players[p].items.push(newItemID);
    sendMessage(p, 'アイテムを手に入れました！');
}

//2:アイテム交渉交換
function exchangeItem(p) {
    sendMessage(p, 'アイテムの交渉交換マスです');
    if (ctrl.players[p].items.length === 0) {
        sendMessage(p, '交換するアイテムがありません');
        return;
    }
    sendMessage(p, 'このマスは開発中');
}

//3:アイテム強制交換
function exchangeItemForced(p, itemIdx) {
    sendMessage(p, 'アイテムの強制交換マスです');
    if (ctrl.players[p].items.length === 0) {
        sendMessage(p, '交換するアイテムがありません');
        return;
    }
    let target = p;
    while(target === p){
        target = Math.floor(Math.random() * ctrl.players.length);
    }
    if(ctrl.players[target].items.length === 0){
        sendMessage(p, 'ランダムに選択されたプレイヤーはアイテムを所持していませんでした');
    }else{
        const targetIdx = Math.floor(Math.random() * ctrl.players[target].items.length);
        const tmp = ctrl.players[p].items[itemIdx];
        ctrl.players[p].items[itemIdx] = ctrl.players[target].items[targetIdx];
        ctrl.players[target].items[targetIdx] = tmp;
        sendMessage(p, 'ランダムに選ばれたアイテムと交換しました');
        sendMessage(target, '強制交換によりアイテムを交換しました');
        console.log('プレイヤー' + p + 'のアイテム' + ctrl.players[target].items[targetIdx] + 
                    'とプレイヤー' + target + 'のアイテム' + ctrl.players[p].items[itemIdx] + 'を交換しました！')
    }
}

//4:HP減少
function decreaseHP(p) {
    if (ctrl.players[p].hp < 1) return;
    ctrl.changeHP(p, -1);
    sendMessage(p, 'HPが減りました！');
}

//5:HP回復
function increaseHP(p) {
    ctrl.changeHP(p, 1);
    sendMessage(p, 'HPが回復しました！');
}

//6:一回休み
function loseOneTurn(p) {
    ctrl.players[p].loseTurnCnt += 1;
    sendMessage(p, '一回休みのマスです');
}

//7:謎解き
function mystery(p) {
    sendMessage(p, '謎解きが始まりました！');
}

const space = {
    effect,
};

export default space;
