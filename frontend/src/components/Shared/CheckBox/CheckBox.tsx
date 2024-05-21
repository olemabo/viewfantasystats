import { FunctionComponent } from 'react';
import './CheckBox.scss';

type CheckBoxProps = {
    buttonText: string,
    checked1: boolean,
    checked2: boolean,
    onclickBox1?: any,
    onclickBox2?: any,
    useTwoCheckBoxes?: boolean
}

export const CheckBox : FunctionComponent<CheckBoxProps> = ({
    buttonText, checked1, checked2, onclickBox1, onclickBox2, useTwoCheckBoxes = false,
}) => {

    return <div className='checkbox-component'>
        <input 
            onClick={(e) => onclickBox1(e)} 
            type='checkbox' 
            id={buttonText} 
            value={buttonText} 
            name='fpl-teams"'
            checked={checked1} 
        />
        { useTwoCheckBoxes &&
            <input className={'solution-box'} 
                onClick={(e) => onclickBox2(e)} 
                type='checkbox' 
                id={buttonText + '-in-solution'} 
                value={buttonText} 
                name='fpl-teams-in-solution'
                checked={checked2} 
            /> 
        }
        <label htmlFor={buttonText}>
            <p>{buttonText}</p>
        </label>
    </div>
};

export default CheckBox;