export const roleData = [
    { id: 0, name:"パイオニア", desc:"選択したプレイヤーのHPを1回復します", button: "/imgs/rolebutton/pioneer.png" },
    { id: 1, name:"エレクトス", desc:"1ターン休むとHPが1回復し、次のターンはサイコロ+2マス進みます", button: "/imgs/rolebutton/electus.png" },
    { id: 2, name:"レゾンデートル", desc:"アイテムカードの能力をHP1回復に変更できます", button: "/imgs/rolebutton/raisondetre.png" },
    { id: 3, name:"キュベレー", desc:"ダイスを振って1か6なら、他の役職の力をコピーできます", button: "/imgs/rolebutton/cybele.png" },
    { id: 4, name:"バーサーカー", desc:"サイコロを振って奇数ならサイコロ+２マス、偶数ならサイコロ-1マス進めます", button: "/imgs/rolebutton/berserker.png" },
    { id: 5, name:"オセロー", desc:"2ターンに一度、他人のアイテムをランダムにコピーします", button: "/imgs/rolebutton/othello.png" },
    { id: 6, name:"ギャンブラー", desc:"サイコロで6が出たらアイテムを1つ取得できます", button: "/imgs/rolebutton/gambler.png" }
]

export const itemData = [
    {  id: 0, name :"アイテム取得", desc:"アイテムを1つ取得します" , button: "/imgs/itembutton/getitem.png"},
    {  id: 1, name :"HP1回復", desc:"選択したプレイヤーのHPを1回復します" , button: "/imgs/itembutton/heal1.png"},
    {  id: 2, name :"HP2回復", desc:"選択したプレイヤーのHPを2回復します", button: "/imgs/itembutton/heal2.png"},
    {  id: 3, name :"HP1減少", desc:"選択したプレイヤーのHPを1減らします" , button: "/imgs/itembutton/attack1.png" },
    {  id: 4, name :"HP2減少", desc:"選択したプレイヤーのHPを2減らします" , button: "/imgs/itembutton/attack2.png" },
    {  id: 5, name :"一回休み", desc:"選択したプレイヤーを一回休みさせます" , button: "/imgs/itembutton/skip.png" },
    {  id: 6, name :"アイテム効果防止", desc:"選択したプレイヤーを他のプレイヤーのアイテムから守ります", button: "/imgs/itembutton/guard.png" },
    {  id: 7, name :"+3マス", desc:"選択したプレイヤーを3マス進めます", button: "/imgs/itembutton/move3.png" },
    {  id: 8, name :"-2マス", desc:"選択したプレイヤーを2マス戻します" , button: "/imgs/itembutton/move-2.png" },
    {  id: 9, name :"偶数サイコロ", desc:"次に振るサイコロは必ず偶数が出ます" , button: "/imgs/itembutton/evendice.png" },
    {  id: 10, name :"奇数サイコロ", desc:"次に振るサイコロは必ず奇数が出ます" , button: "/imgs/itembutton/odddice.png" },
    {  id: 11, name :"サイコロ目選択", desc:"次に出るサイコロの目を選べます" , button: "/imgs/itembutton/selectdice.png" },
    {  id: 12, name :"マス交換", desc:"マップから選択した二つのマスの効果を交換できます" , button: "/imgs/itembutton/exchange.png" },  
    {  id: 13, name :"お守り", desc:"このアイテムを持っていると、他のプレイヤーに使われたアイテム効果を一度防ぎます" , button: "/imgs/itembutton/charm.png" }
]

export const mapData = [
    { id: 0, name:"", desc:"" },
    { id: 1, name:"アイテム取得", desc:"アイテムを1つゲットしました！" },
    { id: 2, name:"アイテム交渉交換", desc:"他のプレイヤーとアイテムの交換を交渉できます！" },
    { id: 3, name:"アイテム強制交換", desc:"他のプレイヤーとアイテムを強制的に交換します！" },
    { id: 4, name:"HP減少", desc:"HPが1減少しました！" },
    { id: 5, name:"HP回復", desc:"HPが1回復しました！" },
    { id: 6, name:"一回休み", desc:"次のターンは一回休みです！" },
    { id: 7, name:"謎解き", desc:"謎解きがはじまりました！" }
]

export const campData = [
    { id: 0, name: "脱出", img: "/imgs/campd.png" },
    { id: 1, name: "阻止", img: "/imgs/camps.png" }
]

export const diceImgs = new Array(
    "/imgs/1.png",
    "/imgs/2.png",
    "/imgs/3.png",
    "/imgs/4.png",
    "/imgs/5.png",
    "/imgs/6.png"
    )