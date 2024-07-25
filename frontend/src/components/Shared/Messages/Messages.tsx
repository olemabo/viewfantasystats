import { FunctionComponent, useState } from 'react';
import './Messages.scss';
import { ErrorLoading, isEmptyErrorLoadingState } from '../../../models/shared/errorLoading';

export type MessageType = 'empty' | 'warning' | 'info';

export const emptyState: MessageType = 'empty';
export const warning: MessageType = 'warning';
export const info: MessageType = 'info';

type MessageProps = {
    messageType: MessageType;
    messageText: string;
    showCross?: boolean;
}

export const MessageErrorLoading : FunctionComponent<{ errorLoading?: ErrorLoading}> = ({
    errorLoading
}) => {
    if (!errorLoading || isEmptyErrorLoadingState(errorLoading)) { 
        return null;
    }

    const { messageType, errorMessage } = errorLoading;
    
    return <Message 
        messageText={errorMessage} 
        messageType={messageType}    
    />
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