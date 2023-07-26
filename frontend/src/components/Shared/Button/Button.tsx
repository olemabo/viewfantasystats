import React, { FunctionComponent } from 'react';
import './Button.scss';

type ButtonProps = {
    buttonText: string,
    onclick: any,
    icon_class?: string,
    small?: boolean,
    color?: 'white' | 'default'
}

export const Button : FunctionComponent<ButtonProps> = ({ 
    buttonText, 
    onclick, 
    icon_class = '',
    small = false,
    color = 'default',
}) => {
    
    return <button className={`button-component ${(small ? ' small' : '')} ${color}`} onClick={() => onclick()}>
        <span>{buttonText}</span>
        <i className={icon_class} aria-hidden="true"></i>
    </button>
};

export default Button;