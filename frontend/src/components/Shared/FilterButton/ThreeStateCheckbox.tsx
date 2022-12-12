import React, { FunctionComponent } from 'react';
import './FilterButton.scss';

type ThreeStateCheckboxProps = {
    checked: boolean,
    checked_must_be_in_solution: boolean,
    buttonText: string,
    onclick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
    labelClassName?: string;
    inputName?: string;
}

export const ThreeStateCheckbox : FunctionComponent<ThreeStateCheckboxProps> = (props) => {
    let defaultFilter = 'can-be-in-solution';
    
    if (!props.checked) {
        defaultFilter = 'not-in-solution'
    }
    else if (props.checked_must_be_in_solution) {
        defaultFilter = 'must-be-in-solution'
    }
    
    return <div className={'three-state-checkbox-container ' + props.labelClassName}>
        <span 
            className={"checkbox " + defaultFilter}
            onClick={(e) => props.onclick(e)} 
            id={props.buttonText}>
            {props.buttonText}
        </span>
    </div>
};

export default ThreeStateCheckbox;


ThreeStateCheckbox.defaultProps = {
    labelClassName: 'filter-button',
    inputName: '',
}
