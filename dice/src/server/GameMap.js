import {players, nextPlayer, turn} from './Control.js'
import {sendDataToUUID} from './Server.js'
import item from './Item.js'

class GameMap {
    constructor(id) {
        this.id = id;
        this.effects = {}; // 関数を保持するオブジェクト
        this.exCnt = 0;
        this.exID = [];
        this.registerEffects();
    }

    // IDに応じた関数を登録
    registerEffects() {
        switch (this.id) {
            case 1:
                this.effects.getItem = this.getItem;
                break;
            case 2:
                this.effects.exchangeItem = this.exchangeItem;
                break;
            case 3:
                this.effects.exchangeItemForced = this.exchangeItemForced;
                break;
            case 4:
                this.effects.decreaseHP = this.decreaseHP;
                break;
            case 5:
                this.effects.increaseHP = this.increaseHP;
                break;
            case 6:
                this.effects.loseOneTurn = this.loseOneTurn;
                break;
            case 7:
                this.effects.mystery = this.mystery;
                break;
            default:
                break;
        }
    }

    // 引数を受け取って登録された関数に渡す(c=現在のプレイヤー、s=対象のプレイヤー)
    effect(c) {
        Object.values(this.effects).forEach(fn => fn.call(this, c));
    }

    // 各関数が引数を受け取れるようにする
    getItem(c) {
        const newItemID = item.makeItem();
        players[c].items.push(newItemID);
        console.log(`アイテムを手に入れました！`);
    }

    exchangeItem(c) {
        if(players[c].items.length === 0){
            console.log('交換するアイテムがありません')
            return;
        }
        console.log('交渉交換するアイテムを選んでください')
        sendDataToUUID(c, 'exchange', null)
    }

    setExchangeItem(playerNum, index){
        this.exCnt += 1;
        this.exID.push([playerNum, index]);
        if(this.exID.length === 2){
            this.doExchangeItem(this.exID[0][0], this.exID[1][0], this.exID[0][1], this.exID[1][1]);
            console.log('アイテムを交渉交換します',this.exID[0][0], this.exID[1][0], this.exID[0][1], this.exID[1][1])
            this.exCnt = 0;
            this.exID = [];
        }
    }

    doExchangeItem(c, t, cItemIndex, tItemIndex){
        const tmp = players[c].items[cItemIndex];
        players[c].items[cItemIndex] = players[t].items[tItemIndex];
        players[t].items[tItemIndex] = tmp;
        nextPlayer();
        turn();
    }

    exchangeItemForced(c) {
        if(players[c].items.length === 0){
            console.log('交換するアイテムがありません')
            return;
        }
        console.log('強制交換するアイテムを選んでください')
        sendDataToUUID(c, 'exchangeForced', null)
    }

    doExchangeItemForced(c, cItemIndex){
        console.log(c + ',' + cItemIndex);
        let tPlayer = c;
        while(tPlayer === c){
            tPlayer = Math.floor(Math.random()*4);
        }
        if(players[tPlayer].items.length === 0){
            players[tPlayer].items.push(players[c].items[cItemIndex]);
            players[c].items.splice(cItemIndex, 1);
        }
        else{
            const tItemIndex = Math.floor(Math.random()*players[tPlayer].items.length);
            const tmp = players[c].items[cItemIndex];
            players[c].items[cItemIndex] = players[tPlayer].items[tItemIndex];
            players[tPlayer].items[tItemIndex] = tmp;
            console.log('プレイヤー'+c+'：　'+players[c].items[cItemIndex]+'とプレイヤー'+tPlayer+'：　'+players[tPlayer].items[tItemIndex]+`のアイテムを強制交換しました！`);
        }
        nextPlayer();
        turn();
    }

    decreaseHP(c) {
        if(players[c].hp < 1) return;
        players[c].hp -= 1;
        console.log('プレイヤー' + c + 'のHP：' + players[c].hp + 'に減少しました！');
    }

    increaseHP(c) {
        if(players[c].hp > 2) return;
        players[c].hp += 1;
        console.log('プレイヤー' + c + 'のHP：' + players[c].hp + 'に回復しました！');
    }

    loseOneTurn(c) {
        players[c].loseTurnCnt += 1;
        console.log('プレイヤー' + c + `のターンが一回休みになりました！`);
    }

    mystery(c) {
        console.log(`謎解きが始まりました！`);
    }
}

export default GameMap;
