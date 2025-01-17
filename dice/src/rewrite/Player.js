import ctrl from './Control.js';
import item from './Item.js';
import { sendMessage } from './Server.js';

class Player {
    constructor(i, num, camp) {
        this.playerNum = i;        //プレイヤー番号(0~3)
        this.roleNum = num;        //役職番号
        this.camp = camp;          //陣営番号
        this.position = 0;         //マスの位置
        this.hp = 3;               //HP
        this.items = [];           //所有アイテム(アイテムIDの配列)
        this.effects = {};         //役職効果
        this.loseTurnCnt = 0;      //一回休みのカウント
        this.preventCnt = 0;       //効果防止アイテムのカウント
        this.gamblerNum = 6;       //ギャンブラーの当たり番号
        this.berserkerFlg = false  //バーサーカーのフラグ
        this.electusFlg = false;
        this.cybeleFlg = false;
        this.oddFlg = false;       //奇数サイコロのフラグ
        this.evenFlg = false;      //偶数サイコロのフラグ
        this.selectFlg = false;
        this.selectedDiceNum = null;
        this.registerEffectseffect();
    }

    registerEffectseffect() {
        switch (this.roleNum) {
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

    effect(data) {
        Object.values(this.effects).forEach(fn => {
            if (fn === this.pioneer) fn.call(this, data.target);
            else if(fn === this.raisondetre) fn.call(this, data.itemIdx);
            else if(fn === this.cybele || fn === this.gambler) fn.call(this, data.diceNum);
            else fn.call(this);
        });
    }

    // 0パイオニア: 誰かのHPを1回復
    pioneer(t) {
        ctrl.changeHP(t, 1);
        if(this.cybeleFlg) this.offCybeleFlg();
        sendMessage(this.playerNum, 'パイオニアの力を使用しました！');
    }

    // 1エレクトス: 1ターン休めばHPが＋1回復する、次のターン＋2マス進める
    electus() {
        ctrl.changeHP(this.playerNum, 1);
        this.electusFlg = true;
        if(this.cybeleFlg) this.offCybeleFlg();
        sendMessage(this.playerNum, 'エレクトスの力を使用しました！このターンは1回休みです');
    }

    // 2レゾンデートル: アイテムカードの能力をHP1回復にできる
    raisondetre(itemIdx) {
        ctrl.changeHP(this.playerNum, 1);
        this.items.splice(itemIdx, 1);
        if(this.cybeleFlg) this.offCybeleFlg();
        sendMessage(this.playerNum, 'レゾンデートルの力を使用しました！');
    }

    // 3キュベレー: 毎ターン1/3で発動、他のプレイヤー役職の能力を1つ使う
    cybele(diceNum) {
        if(diceNum === 1 || diceNum === 6){
            const data = ctrl.getData();
            const roles = data.roles;
            let num = this.playerNum;
            while(num === this.playerNum){
                num = Math.floor(Math.random() * ctrl.players.length);
            }
            this.roleNum = ctrl.players[num].roleNum;
            this.registerEffectseffect();
            this.cybeleFlg = true;
            sendMessage(this.playerNum, '他のプレイヤーの役職をランダムにコピーしました！');
        }else sendMessage(this.playerNum, 'キュベレーのあたり番号ではありません');
    }

    // 4バーサーカー: サイコロを振って奇数だったら＋2マス進める偶数だったら－1マス
    berserker() {
        this.berserkerFlg = true;
        if(this.cybeleFlg) this.offCybeleFlg();
        sendMessage(this.playerNum, 'バーサーカーの力を使用しました！');
    }

    // 5オセロー: 2ターンに一度人のアイテムをコピーして使える
    othello() {
        if ((Math.floor(ctrl.turnCnt / ctrl.players.length) % 2) === 0 || this.cybeleFlg) {
            let num = this.playerNum;
            while (num === this.playerNum) {
                num = Math.floor(Math.random() * ctrl.players.length);
            }
            if (ctrl.players[num].items.length === 0) {
                sendMessage(this.playerNum, 'ランダムに選択したプレイヤーはアイテムを持っていません');
                return;
            } else {
                const itemIdx = Math.floor(
                    Math.random() * ctrl.players[num].items.length
                );
                this.items.push(ctrl.players[num].items[itemIdx]);
                sendMessage(this.playerNum, 'オセローの力を使ってアイテムをコピーしました！');
            }
        } else sendMessage(this.playerNum, 'オセローの力を使用できるターンではありません');
        if(this.cybeleFlg) this.offCybeleFlg();
    }

    // 6ギャンブラー: サイコロで6が出たらアイテムカードを一枚取得
    gambler(diceNum) {
        if(diceNum === 6){
            this.items.push(item.makeItem());
            sendMessage(this.playerNum, '6が出ました！アイテムを取得しました！');
        }
        else sendMessage(this.playerNum, diceNum + 'が出ました。あたり番号ではありません');
        if(this.cybeleFlg) this.offCybeleFlg();
    }

    offCybeleFlg(){
        this.cybeleFlg = false;
        this.roleNum = 3;
        this.registerEffectseffect();
        sendMessage(this.playerNum, '役職がキュベレーに戻りました');
    }
}

export default Player;
