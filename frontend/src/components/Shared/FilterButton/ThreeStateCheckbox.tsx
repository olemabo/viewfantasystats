import React, { FunctionComponent } from 'react';
import './FilterButton.scss';

type ThreeStateCheckboxProps = {
    checked: boolean,
    checked_must_be_in_solution: boolean,
    buttonText: string,
    onclick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
    labelClassName?: string;
}

export const ThreeStateCheckbox : FunctionComponent<ThreeStateCheckboxProps> = ({
    checked, checked_must_be_in_solution, buttonText, onclick, labelClassName = 'filter-button'
}) => {
    let defaultFilter = 'can-be-in-solution';
    
    if (!checked) {
        defaultFilter = 'not-in-solution'
    }
    else if (checked_must_be_in_solution) {
        defaultFilter = 'must-be-in-solution'
    }
    
    return <div className={'three-state-checkbox-container ' + labelClassName}>
        <span 
            className={"checkbox " + defaultFilter}
            onClick={(e) => onclick(e)} 
            id={buttonText}>
            {buttonText}
        </span>
    </div>
};

export default ThreeStateCheckbox;
