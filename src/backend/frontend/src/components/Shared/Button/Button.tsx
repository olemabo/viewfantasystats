import { FunctionComponent } from 'react';
import './Button.scss';

type ButtonProps = {
    buttonText: string,
    onclick: any,
    iconClass?: string,
    small?: boolean,
    color?: 'white' | 'default'
}

export const Button : FunctionComponent<ButtonProps> = ({ 
    buttonText, 
    onclick, 
    iconClass = '',
    small = false,
    color = 'default',
}) => {
    
    return <button className={`button-component ${(small ? ' small' : '')} ${color}`} onClick={() => onclick()}>
        <span>{buttonText}</span>
        <i className={iconClass} aria-hidden="true"></i>
    </button>
};

export default Button;