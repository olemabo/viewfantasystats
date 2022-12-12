import React, { FunctionComponent } from 'react';
import './FilterButton.scss';

type FilterButtonProps = {
    buttonText: string,
    checked: boolean,
    onclick?: any,
    labelClassName?: string;
    inputName?: string;
}

export const FilterButton : FunctionComponent<FilterButtonProps> = (props) => {
    
    return <label className={'filter-team ' + props.labelClassName}>
        <input 
            onClick={(e) => props.onclick(e)} 
            value={props.buttonText} 
            checked={props.checked} 
            name={props.inputName} 
            id={props.buttonText} 
            type='checkbox' 
            />
        <span className={props.checked ? 'checked' : ''}>
            {props.buttonText}  </span>
    </label>
};

export default FilterButton;


FilterButton.defaultProps = {
    labelClassName: 'filter-button',
    inputName: '',
}