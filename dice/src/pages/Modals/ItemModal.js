import React, { useState } from "react";
import './Modal.css';
import { itemData } from "../Data.js";

function ItemModal({
    onClose,
    myNum,
    item
}){
    const [desc, setDesc] = useState('　　　　　　　　　　　　'); 

    const handleMouseEnter = (index) => {
        setDesc(itemData[index].desc);
      };
    
      const handleMouseLeave = () => {
        setDesc('　　　　　　　　　　　　');
      }; 

    return(
        <>
        <div className="modal">
            <div className="modal-content">
            <button onClick={onClose} className="close-button">×</button>
            <div className="items">
                    {item[myNum].map((itemId, index) => (
                    <div
                        onMouseEnter={() => handleMouseEnter(item[myNum][index])}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleMouseEnter(item[myNum][index])}
                    >
                        <img src={itemData[itemId].button} className="item-img" />
                    </div>
                    ))}
                </div>
                <div>{desc}</div>
            </div>
        </div>
        </>
    )
}

export default ItemModal;