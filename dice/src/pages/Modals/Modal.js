import React from "react";
import { roleData, itemData } from "../Data.js";

function Modal({
  modalCase,
  currentCase,
  role,
  myNum,
  item,
  desc,
  mapList,
  mapIdx1,
  diceValue,
  diceImg,
  handleYNClick,
  handleItemClick,
  handleTargetClick,
  handleDiceInput,
  rollDice,
  selectDice,
  selectMapIdx,
  handleMouseEnter,
  handleMouseLeave,
})

{
    
  return (
    <div className="modal">
      <div className="modal-content">

        {modalCase === 0 && (
          <>
            <h2>{currentCase === 0 ? "あなたのターンです。役職の力を使いますか？" : "マス効果を使いますか？"}</h2>
            <p>{currentCase === 0 ? `${roleData[role[myNum]].name}: ${roleData[role[myNum]].desc}` : ""}</p>
            <button onClick={() => handleYNClick("yes")}>Yes</button>
            <button onClick={() => handleYNClick("no")}>No</button>
          </>
        )}

        {modalCase === 1 && (
          <>
            <h2>
              {currentCase === 0
                ? "HP1に変えるアイテムを選択してください"
                : currentCase === 1
                ? "アイテムを使いますか？"
                : "アイテム強制交換マスです。交換するアイテムを選択してください"}
            </h2>
            <div className="items">
            {item[myNum].map((itemId, index) => (
              <div
                key={index}
                onMouseEnter={() => handleMouseEnter(item[myNum][index])}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleItemClick(index)}
              >
                <img src={itemData[itemId].button} className="item-img"/>
              </div>
            ))}{currentCase === 0
            ? null :<button onClick={() => handleYNClick("no")}>使わない</button>
            }
            </div>
            <div>{desc}</div>
          </>
        )}

        {modalCase === 2 && (
          <>
            <h2>対象プレイヤーを選択してください</h2>
            {Array(4)
              .fill()
              .map((_, index) =>
                index !== myNum ? (
                  <button key={index} onClick={() => handleTargetClick(index)}>
                    プレイヤー {index+1}
                  </button>
                ) : null
              )}
          </>
        )}

        {modalCase === 3 && (
          <>
            <div className="input">
              <h2>サイコロを振ってください</h2>
              <div className="dice">
                <img width="150" height="150" src={diceImg} alt="サイコロ" />
              </div>
              <button onClick={rollDice}>サイコロを振る</button>
            </div>
          </>
        )}

        {modalCase === 4 && (
          <>
            <div className="input">
              <label htmlFor="diceInput">サイコロの値を選択: </label>
              <input
                type="number"
                id="diceInput"
                min="1"
                max="6"
                value={diceValue}
                onChange={handleDiceInput}
              />
              <button onClick={selectDice}>この値を選択</button>
            </div>
          </>
        )}

        {modalCase === 5 && (
          <>
            <div className="target-selection">
              <h3>{mapIdx1 === null ? "交換したいマップのマスを選択してください" : "二つ目を選択してください"}</h3>
              {Array(mapList.length)
                .fill()
                .map((_, index) => (
                  <button key={index} onClick={() => selectMapIdx(index)}>
                    {index}マス目
                  </button>
                ))}
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}

export default Modal;
