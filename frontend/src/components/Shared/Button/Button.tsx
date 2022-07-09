import React, { FunctionComponent } from 'react';
import './Button.scss';

type ButtonProps = {
    buttonText: string,
    onclick: any,
    icon_class?: string,
}

export const Button : FunctionComponent<ButtonProps> = (props) => {
    
    return <button className='button-component' onClick={() => props.onclick()}>
        <span>{props.buttonText}</span>
        <i className={props.icon_class} aria-hidden="true"></i>
    </button>
};

export default Button;

Button.defaultProps = {
    icon_class: "",
}