import { useState } from 'react';
import { diceImgs } from './Data.js';

function DiceRoller() {
  const [diceValue, setDiceValue] = useState(1);
  const [diceImg, setDiceImg] = useState(diceImgs[1])

  const rollDice = () => {
    const rndNum = Math.floor(Math.random() * 6) + 1;
    setDiceValue(rndNum);
    setDiceImg(diceImgs[rndNum]);
  };

  return (
    <div className="dice-roller">
      <h3><img width = "150" height = "150" src = {diceImg}/></h3>
      <button onClick={rollDice}>サイコロを振る</button>
    </div>
  );
}

export default DiceRoller;
