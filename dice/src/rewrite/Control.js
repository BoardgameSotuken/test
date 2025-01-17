import gameMap from './GameMap.js'
import Player from './Player.js'
import item from './Item.js';
import {sendMessage} from './Server.js'

class Control{
    constructor(){
        this.players = [];                                   //プレイヤーのインスタンスを格納
        this.currentPlayer = 0;                              //現在のプレイヤー
        this.turnCnt = 0;                                    //次のプレイヤーに進むと＋１
        this.usedItems = [];                                 //清算ターンまでアイテム情報を保持
        this.mapIDList = [0,1,3,4,5,6,0,1,3,4,5,6,0];      //マップのID
        this.turnCase = 0;                                    //0:ターン開始＆役職、1:アイテム、2:マス効果、3:清算ターン
    }

    //ゲームの初期化
    start(){
        let roleNums = [0,1,2,4,5,6]; //3キュベレーのエラーなくなったら足す
        roleNums = this.rnd(roleNums);
        let campNums = [0,0,1,1];
        campNums = this.rnd(campNums);
        //役職確認用。最後は消す
        // this.players.push(new Player(0, 6, campNums[0]));
        // this.players.push(new Player(1, 1, campNums[1]));
        // this.players.push(new Player(2, 2, campNums[2]));
        // this.players.push(new Player(3, 4, campNums[3]));

        for(let i = 0; i<4; i++){
            this.players.push(new Player(i, roleNums[i], campNums[i]));
        }
        //ここにあとでマス効果をランダムにする処理
        //初期アイテム獲得
        for(let i = 0; i<4; i++){
            for(let j = 0; j<3; j++){
                const newItem = item.makeItem();
                this.players[i].items.push(newItem);
            }
        }
    }

    rnd(array){
        let newArray = array;
        for(const i of newArray){
            const rnd = Math.floor(Math.random() * newArray.length);
            const tmp = newArray[i];
            newArray[i] = newArray[rnd];
            newArray[rnd] = tmp;
        }
        return newArray;
    }

    setMap(array){
        this.mapIDList = array;
    }

    changeCase(num){
        this.turnCase = num;
    }

    roleTurn(p, data){
        if(data.yn === 'yes'){
            this.players[p].effect(data);
            if(this.players[p].roleNum === 1){  //エレクトスと力を使うと次のターン
                this.nextPlayer();
                return;
            }
        }
        if(this.players[p].cybeleFlg) return;
        this.changeCase(1);
    }

    itemTurn(p, data){
        if(data.yn === 'yes'){
            if((data.id >= 1 && data.id <= 5) || data.id == 7 || data.id == 8){
                this.usedItems.push([data.id, p, data.target]);
            }else if(data.id === 11){
                item.effect(data.id, p, null, data.diceNum);
            }else if(data.id === 12){
                item.effect(data.id, p, null, null, data.mapIdx1, data.mapIdx2);
            }else item.effect(data.id, p, data.target);
            this.players[p].items.splice(data.itemIdx, 1);
        }else if(data.yn === 'no'){
            this.changeCase(2);
        }
    }

    spaceTurn(p, data){
        if(data.yn === 'yes') gameMap.effect(this.mapIDList[this.players[p].position], p, data);
        this.nextPlayer();
    }

    //次のプレイヤーに進む or 決算
    nextPlayer(){
        this.turnCnt += 1;
        this.currentPlayer = this.currentPlayer === 3 ? 0 : this.currentPlayer + 1
        if(this.turnCnt % this.players.length === 0) this.settlement();
        this.changeCase(0);
        if(this.players[this.currentPlayer].loseTurnCnt > 0){
            this.players[this.currentPlayer].loseTurnCnt -= 1;
            sendMessage(this.currentPlayer, '一回休みです')
            this.nextPlayer();
        }
        sendMessage(this.currentPlayer, 'あなたのターンです')
    }

    settlement(){
        console.log('清算ターンです')
        sendMessage(4, '清算ターンです')
        for(let i = 0; i < this.usedItems.length; i++){
            if(this.usedItems[i][2] !== null){
                if(this.players[this.usedItems[i][2]].preventCnt > 0){
                    sendMessage(this.players[this.usedItems[i][2]].playerNum, '誰かが使ったアイテムを効果防止アイテムで阻止しました')
                    continue;
                }else{   //お守りがあるか走査
                    const amuletIndex = this.players[this.usedItems[i][2]].items.indexOf(13);
                    if(amuletIndex === -1) item.effect(this.usedItems[i][0], this.usedItems[i][1], this.usedItems[i][2]);
                    else{
                        this.players[this.usedItems[i][2]].items.splice(amuletIndex, 1);
                        sendMessage(this.players[this.usedItems[i][2]].playerNum, '誰かが使ったアイテムをお守りで阻止しました')
                    }
                }
            }else item.effect(this.usedItems[i][0], this.usedItems[i][1], this.usedItems[i][2]);
        }
        this.usedItems = [];
        console.log('清算ターンが終了しました')
    }

    getData(){
        const roles = this.players.map(r => r.roleNum);
        const positions = this.players.map(p => p.position);
        const hps = this.players.map(h => h.hp);
        const camps = this.players.map(c => c.camp);
        const itemsList = [];
        for(let i = 0; i<4; i++){
            itemsList.push(this.players[i].items);
        }
        return {
            roles : roles, 
            positions : positions, 
            hps : hps,
            items : itemsList,
            camps : camps,
            player : this.currentPlayer,
            turn : this.turnCnt,
            mapList : this.mapIDList,
            case : this.turnCase
            };
    }

    rollDice(p, data){
        let num = data.diceNum;
        if(ctrl.players[p].selectFlg){
            num = ctrl.players[p].selectedDiceNum;
            ctrl.players[p].selectFlg = false;
        }
        this.movePosition(p, num);
        //this.spaceTurn(p, data);
    }

    //ポジションを動かす
    movePosition(p, num){
        let diceNum = num;
        //case２の状態を判定
        if(this.turnCase === 2){
            //サイコロの状態を判定
            const oddDice = [0,1,1,3,3,5,5];
            const evenDice = [0,2,2,4,4,6,6];
            if(this.players[p].oddFlg){
                diceNum = oddDice[num];
                this.players[p].oddFlg = false;
            }else if(this.players[p].evenFlg){
                diceNum = evenDice[num];
                this.players[p].evenFlg = false;
            }else if(this.players[p].selectFlg){
                diceNum = this.players[p].selectedDiceNum;
                this.players[p].selectFlg = false;
            }
            //バーサーカーの判定
            if(this.players[p].berserkerFlg){
                if(diceNum % 2 !== 0) diceNum += 2;
                else diceNum -= 1;
                this.players[p].berserkerFlg = false;
            }else if(this.players[p].electusFlg){
                diceNum += 2;
            }
        }
        sendMessage(p, diceNum + "マス進みました！")
        this.players[p].position += diceNum;
        if(this.players[p].position < 0) this.players[p].position = 0;
        //ゴール判定
        if(this.players[p].position >= (this.mapIDList.length - 1)){ 
            this.players[p].position = this.mapIDList.length - 1;
            this.judge(p);
        }
    }

    //HP値を変える
    changeHP(t, num){
        this.players[t].hp += num;
        if(this.players[t].hp < 0) this.players[t].hp = 0;
    }

    //ゴール時の判定
    judge(goalPlayer){
        let points = [0, 0];
        let message = 'プレイヤー' + (goalPlayer+1) + 'がゴールしました！';
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].camp === 0){
                points[0] = points[0] + this.players[i].position; + this.players[i].hp;
            }else if(this.players[i].camp === 1){
                points[1] = points[1] + this.players[i].position; + this.players[i].hp;
            }
        }
        if(points[0] > points[1]) message += '脱出： ' + points[0] + '対 阻止： ' + points[1] + 'で脱出の勝利です';
        else if(points[0] < points[1]) message += '脱出： ' + points[0] + '対 阻止: ' + points[1] + 'で阻止の勝利です';
        else message += '脱出：　' + points[0] + '対 阻止: ' + points[1] + 'で引き分けです';
        sendMessage(5, message);
    }

    restart(){
        this.players = [];
        this.currentPlayer = 0;
        this.turnCnt = 0;   
        this.usedItems = [];             
        this.mapIDList = [0,1,3,4,5,6,0,1,3,4,5,6,0]; 
        this.turnCase = 0; 
    }
}

const ctrl = new Control();

export default ctrl;