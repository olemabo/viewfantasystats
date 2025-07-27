import { FunctionComponent } from 'react';
import './TextInput.scss';


type DropdownProps = {
    htmlFor: string,
    label?: string,
    onSelect: (value: any) => void,
    selected: string;
    dropdownValues: any[]
}
export const Dropdown : FunctionComponent<DropdownProps> = ({
    htmlFor,
    label = '',
    onSelect, 
    dropdownValues,
    selected,
}) => {

    if (!dropdownValues || dropdownValues.length < 1) return;
    
    return <div className='text-input-container'>
        <label htmlFor={htmlFor}>{label}</label>
        <select 
            onChange={(e) => onSelect(e.target.value)} 
            className="input-box" id="sort_on_dropdown" name="sort_on">
        { dropdownValues.map(x => (
            <option selected={x == selected} value={x}>{x}</option>
        ))}
        </select>
    </div>
};

export default Dropdown;
