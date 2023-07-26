import React, { FunctionComponent, useEffect, useState } from 'react';
import './ToggleButton.scss';

type toggleButtonProps = {
    name: string;
    value: string;
    checked: boolean;
    classname: string;
}

type ToggleButtonProps = {
    onclick: any;
    toggleButtonName: string;
    defaultToggleList: toggleButtonProps[];
    small?: boolean;
}

export const ToggleButton : FunctionComponent<ToggleButtonProps> = ({
    onclick,
    toggleButtonName,
    defaultToggleList,
    small = false
}) => {
    const [ toggleList, SetToggleList ] = useState(defaultToggleList);
    const [ checkedValue, SetCheckedValue ] = useState("");

    useEffect(() => {
        SetToggleList(toggleList)
        
        toggleList.map(x => {
            if (x.checked) { SetCheckedValue(x.value); }
        });

    }, [defaultToggleList]);
    
    
    return <div className={`toggle-container${(small ? " small" : "")}`}>
        <ul className='toggle-section'>
        {defaultToggleList.map(btn => 
            <li className={btn.classname}>
                <input tabIndex={-1} type="radio" id={btn.name} name={toggleButtonName} />
                <label className={"thin " + (btn.checked ? "checked" : "")} 
                    tabIndex={0} 
                    onClick={ (e: any) => { 
                        onclick(btn.value);
                        e.preventDefault();
                    }} 
                    role="radio" 
                    aria-label={btn.name}
                    htmlFor={btn.name}>
                        {btn.name}
                </label>
            </li> )}
        </ul>
    </div>
};

type ToggleButtonProps2 = {
    on_text: string;
    of_text: string;
    onclick: any;
}

export const ToggleButton2 : FunctionComponent<ToggleButtonProps2> = (props) => {

    return <>
        <label className="toggle">
            <input onChange={(e) => props.onclick(e.target.checked)} type="checkbox"></input>
            <span className="labels" data-on={props.on_text} data-off={props.of_text}></span>
        </label>
    </>
};

export default ToggleButton;