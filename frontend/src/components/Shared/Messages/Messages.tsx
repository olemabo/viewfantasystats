import React, { FunctionComponent, useState } from 'react';
import './Messages.scss';


type MessageProps = {
    messageType: 'warning' | 'info';
    messageText: string;
    showCross?: boolean;
}

export const Message : FunctionComponent<MessageProps> = ({
    messageType,
    messageText,
    showCross = false
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    return <>{ isVisible && 
    <div className={`message ${messageType}`}>
        { showCross && <span className="close-icon" onClick={handleClose}>
          &times;
        </span> }
        <p>{messageText}</p>
    </div>
    }</>
};

export default Message;