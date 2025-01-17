import React, { useState } from "react";
import './Modal.css';

function MapModal({
    onClose,
    mapList,
    positions
}){

    return(
        <>
        <div className="modal">
            <div className="modal-content">
            <div className="map">
                <button onClick={onClose} className="close-button">×</button>
                {Array(mapList.length).fill().map((_, index) =>(
                    <div key={index} className="cell">
                        {positions.map((i,playerNum) => (
                        index === i ? playerNum : null))}
                    </div>
                ))}
                </div>
            </div>
        </div>
        </>
    )
}

export default MapModal;