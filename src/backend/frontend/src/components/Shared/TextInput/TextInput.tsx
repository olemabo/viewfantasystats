import { FunctionComponent } from 'react';
import './TextInput.scss';


type TextInputProps = {
    htmlFor: string,
    defaultValue?: number | string,
    className?: string,
    onInput?: any,
    min?: number,
    max?: number,
    children?: any,
    minWidth?: number;
    placeholder?: string;
    type?: 'number' | 'text';
    border?: boolean;
}
export const TextInput : FunctionComponent<TextInputProps> = ({
    htmlFor,
    className = '',
    defaultValue = -1,
    min = undefined,
    max = undefined,
    onInput,
    children,
    minWidth = undefined,
    placeholder = undefined,
    type = "number",
    border = false,
}) => {
    
    return <div className={`text-input-container ${border ? 'border' : ''}`}>
        <label htmlFor={htmlFor}>{children}</label>
        <input 
            style={{ minWidth: minWidth }}
            className={className !== '' ? className : undefined}
            name={htmlFor}
            id={htmlFor}
            onInput={(e) => onInput(type === "number" ? parseInt(e.currentTarget.value) : e.currentTarget.value) } 
            value={defaultValue === -1 ? undefined : defaultValue}
            min={min}
            max={max}
            placeholder={placeholder}
            type={type}
        />
        
    </div>
};

export default TextInput;
