import {players, map, nextPlayer, turn} from './Control.js'
import item from './Item.js';
import { selectedDiceNum } from './Item.js';

class Player{
    constructor(i, num){
        this.playerNum = i;      //プレイヤー番号(0~3)
        this.roleNum = num;      //役職番号
        this.position = 0;       //マスの位置
        this.hp = 3;             //HP
        this.items = [];         //所有アイテム(アイテムIDの配列)
        this.loseTurnCnt = 0;    //一回休みのカウント
        this.effects = {};       //役職効果
        this.diceCase = 0;       //所有するダイスの現在の状態
        this.turnCnt = 0;        //ターンのカウント
        this.preventCnt = 0;     //効果防止アイテムのカウント
        this.registerEffectseffect();
        this.gamblerNum = 6;
    }

    registerEffectseffect(){
        switch(this.roleNum){
            case 0:
                this.effects.pioneer = this.pioneer;
                break;
            case 1:
                this.effects.electus = this.electus;
                break;
            case 2:
                this.effects.raisondetre = this.raisondetre;
                break;
            case 3:
                this.effects.cybele = this.cybele;
                break;
            case 4:
                this.effects.berserker = this.berserker;
                break;
            case 5:
                this.effects.othello = this.othello;
                break;
            case 6:
                this.effects.gambler = this.gambler;
                break;
            default:
                break;

        }
    }

    // 引数を受け取って登録された関数に渡す
    effect(t) {
        Object.values(this.effects).forEach(fn => {
            if (fn === this.pioneer || fn === this.raisondetre) {
                fn.call(this, t); //
            } else {
                fn.call(this); // 他の関数には引数なしで実行
            }
        });
    }
    

    //0パイオニア:誰かのHPを1回復
    pioneer(t){
        console.log('tは' + t)
        players[t].changeHP(1);
        console.log('パイオニアの力を使用しました。プレーヤー' + t +'のHP :' + players[t].hp);
    }

    //1エレクトス:1ターン休めばHPが＋１回復する、次のターン＋２マス進める
    electus(){
        this.changeHP(1);
        this.diceCase = 1;
        nextPlayer();
        console.log('エレクトスの力を使用しました。プレーヤー' + this.playerNum +'のHP :' + this.hp);
    }

    //2レゾンデートル:アイテムカードの能力をHP1回復にできる
    raisondetre(itemIndex){
        this.changeHP(1);
        this.items.splice(itemIndex,1);
        console.log('レゾンデートルの力を使用しました。プレーヤー' + this.playerNum +'のHP :' + this.hp);
    }

    //3キュベレー:毎ターン1/3で発動、他のプレイヤー役職の能力を１つ使う
    cybele(){
        this.diceCase = 2;
        console.log('ダイスを振って1か6なら役職をコピー');
    }

    //4バーサーカー:サイコロを振って奇数だったら＋2マス進める偶数だったら－１マス
    berserker(){
        this.diceCase = 3;
        console.log('バーサーカーの力を使用します。ダイスを振ってください');
    }

    //5オセロー:２ターンに一度人のアイテムをコピーして使える
    othello(){
        if(this.turnCnt % 2 ===0){
            let num = this.playerNum;
            while (num === this.playerNum){
                num = Math.floor(Math.random()*4);
            }
            if(players[num].items.length === 0){
                console.log('対象のプレーヤーはアイテムを所有していません。');
                return;
            }
            else{
                const itemIndex = Math.floor(Math.random()*players[num].items.length);
                this.items.push(players[num].items[itemIndex]);
                console.log('プレイヤー' + players[num].playerNum +'のアイテム(ID：　' + players[num].items[itemIndex] + 'をコピーしました。');
                console.log('オセローの力を使用しました。');
            }
        }
        else console.log('オセローの能力が使えるターンではありません');
    }

    //6ギャンブラー:サイコロで任意の数字が出たらアイテムカードを一枚取得（数字はゲーム開始時に選択）
    gambler(){
        this.diceCase = 4;
        console.log('ギャンブラーの力を使用します。ダイスを振ってください。');
    }

    //各プレイヤーが保持するダイス
    rollDice(rolledNum){
        let diceNum = rolledNum; //サイコロを振って出た値
        const oddDice = [0,1,1,3,3,5,5];
        const evenDice = [0,2,2,4,4,6,6];
        switch(this.diceCase){
            //通常時
            case 0:
                this.movePosition(diceNum);
                break;
            //エレクトス(1ターン休めば+2マス)
            case 1:
                diceNum += 2;
                this.movePosition(diceNum);
                break;
            //キュベレー(3分の1の確立で他の役職をコピー)
            case 2:
                if(diceNum === 1 || diceNum === 6){
                    let tPlayer = this.playerNum
                    while(tPlayer === this.playerNum){
                        tPlayer = Math.floor(Math.random()*players.length);
                    }
                    console.log('プレイヤー：' + tPlayer + 'の役職id：' + players[tPlayer].roleNum + 'をコピーしました。');                  
                    this.roleNum = players[tPlayer].roleNum;
                    this.registerEffectseffect();

                    this.effect();
                    this.effects = {};  
                    this.roleNum = 3;
                    this.registerEffectseffect();
                }
                else{
                    console.log('キュベレーの力は使えません。');
                }
                break;
            //バーサーカー(奇数なら+2,偶数なら-1)
            case 3:
                if(diceNum % 2 !== 0) diceNum += 2;
                else diceNum -= 1;
                this.movePosition(diceNum);
                break;
            //ギャンブラー
            case 4:
                if(diceNum === this.gamblerNum) this.items.push(item.makeItem());
                else console.log('当たり番号ではありませんでした。')
                break;
            //偶数ダイス
            case 5:
                console.log('出た目：　' + diceNum);
                diceNum = evenDice[diceNum];
                console.log('アイテム利用後の目：　' + diceNum);
                this.movePosition(diceNum);
                break;
            //奇数ダイス
            case 6:
                diceNum = oddDice[diceNum]; 
                this.movePosition(diceNum);   
                break;
            //数字を選べる
            case 7:
                diceNum = selectedDiceNum;
                this.movePosition(diceNum); 
                break;
            default:
                break;
        }
        this.diceCase = 0; //ダイスをデフォルトの状態に戻す
    }

    //ダイスケース変更
    changeDiceCase(num){
        this.diceCase = num;
    }

    //HPを変える
    changeHP(num){
        switch(num){
            case 0:  //HP減少
                if(1 > this.hp) return;
                else this.hp -= 1;
                break;
            case 1:  //回復
                if(this.hp > 2) return;
                else this.hp += 1;
                break;
        }
    }

    //ポジションを動かす
    movePosition(num){
        this.position += num;
        if(this.position < 0) this.position = 0;
        //ゴール判定
        if(this.position >= map.length){
            this.position = map.length - 1;
            console.log('プレイヤー' + this.playerNum + 'の勝利です！')
            return;
        }
        //let startMapEffect = parseInt(prompt('マップ効果を発動しますか？　はい：0,　いいえ：1'));
        //if(startMapEffect === 0){
            map[this.position].effect(this.playerNum);            
        //}
        if(map[this.position].id === 2 || map[this.position].id === 3) return;
        nextPlayer();
        turn();
    }
}

export default Player;