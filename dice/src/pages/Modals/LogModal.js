import './Modal.css';

function LogModal({
    onClose,
    messageQueue
}){

    return(
        <>
        <div className="modal">
            <div className="modal-content">
                <div className="log">
                    <button onClick={onClose} className="close-button">×</button>
                            {messageQueue.map((message, index) => (
                                <p className="gradient-text">{message}</p>
                            ))}
                </div>
            </div>
        </div>
        </>
    )
}

export default LogModal;