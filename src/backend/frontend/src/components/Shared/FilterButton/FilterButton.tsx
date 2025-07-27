import React, { FunctionComponent } from 'react';
import './FilterButton.scss';

type FilterButtonProps = {
    buttonText: string,
    checked: boolean,
    onclick: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void,
    labelClassName?: string;
    inputName?: string;
}

export const FilterButton : FunctionComponent<FilterButtonProps> = ({
    buttonText,
    checked,
    onclick,
    labelClassName = 'filter-button',
    inputName = ''
}) => {
    
    return <label className={'filter-team ' + labelClassName}>
        <input 
            onClick={(e) => onclick(e)} 
            value={buttonText} 
            checked={checked} 
            name={inputName} 
            id={buttonText} 
            type='checkbox' 
            />
        <span className={checked ? 'checked' : ''}>
            {buttonText}  </span>
    </label>
};

export default FilterButton;