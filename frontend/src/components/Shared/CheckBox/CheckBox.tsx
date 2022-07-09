import React, { FunctionComponent } from 'react';
import './CheckBox.scss';

type CheckBoxProps = {
    buttonText: string,
    checked1: boolean,
    checked2: boolean,
    onclickBox1?: any,
    onclickBox2?: any,
    useTwoCheckBoxes?: boolean
}

export const CheckBox : FunctionComponent<CheckBoxProps> = (props) => {

    return <div className='checkbox-component'>
        <input className='' 
        onClick={(e) => props.onclickBox1(e)} 
        type="checkbox" 
        id={props.buttonText} 
        value={props.buttonText} 
        name="fpl-teams" 
        checked={props.checked1} />
        
        { props.useTwoCheckBoxes &&
            <input className={'solution-box'} 
            onClick={(e) => props.onclickBox2(e)} 
            type="checkbox" 
            id={props.buttonText + "-in-solution"} 
            value={props.buttonText} 
            name="fpl-teams-in-solution"
            checked={props.checked2} /> }

    <label htmlFor={props.buttonText}>
        <p>{props.buttonText}</p>
    </label></div>
};

export default CheckBox;


CheckBox.defaultProps = {
    useTwoCheckBoxes: false,
}