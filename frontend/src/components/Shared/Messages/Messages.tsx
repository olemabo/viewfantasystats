import React, { FunctionComponent } from 'react';
import './Messages.scss';


type MessageProps = {
    messageType: 'warning';
    messageText: string;
}

export const Message : FunctionComponent<MessageProps> = ({
    messageType,
    messageText,
}) => {
    
    return <div className='message'>
        <p className={messageType}>
            {messageText}
        </p>
    </div>
};

export default Message;