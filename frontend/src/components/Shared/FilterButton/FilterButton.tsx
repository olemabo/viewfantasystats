import React, { FunctionComponent } from 'react';
import './FilterButton.scss';

type FilterButtonProps = {
    buttonText: string,
    checked: boolean,
    onclick?: any,
    labelClassName?: string;
    inputName?: string;
    backgroundColor: string;
    fontColor: string;
}

export const FilterButton : FunctionComponent<FilterButtonProps> = (props) => {
    const uncheckedBacgroundColor = '#6e6e6e';
    const uncheckedFontColor = '#FFF';

    function createHexFormat(color: string, checked: boolean, type: string) {
        if (!checked) { return type == 'background' ? uncheckedBacgroundColor : uncheckedFontColor }
        if (color.length > 2) {
            return '#' + color.substring(2)
        }
        if (color == '1') { return 'black'; }
        if (color == '0') { return 'white'; }
        return '#fff'
    }
    
    return <label className={'filter-team ' + props.labelClassName}>
        <input 
            onClick={(e) => props.onclick(e)} 
            value={props.buttonText} 
            checked={props.checked} 
            name={props.inputName} 
            id={props.buttonText} 
            type='checkbox' 
            />
        <span style={{ backgroundColor: createHexFormat(props.backgroundColor, props.checked, 'background'), color: createHexFormat(props.fontColor, props.checked, 'color') }} className={props.checked ? 'checked' : ''}>
            {props.buttonText}  </span>
    </label>
};

export default FilterButton;


FilterButton.defaultProps = {
    labelClassName: 'filter-button',
    backgroundColor: 'gray',
    inputName: '',
}