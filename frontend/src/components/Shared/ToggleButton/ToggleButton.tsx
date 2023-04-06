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
    toggleList: toggleButtonProps[];
}

export const ToggleButton : FunctionComponent<ToggleButtonProps> = (props) => {
    const [ toggleList, SetToggleList ] = useState(props.toggleList);
    const [ checkedValue, SetCheckedValue ] = useState("");

    useEffect(() => {
        SetToggleList(toggleList)
        
        toggleList.map(x => {
            if (x.checked) { SetCheckedValue(x.value); }
        });

    }, [props.toggleList]);

    function updateCheckedState(value: string) {
        // toggleList.map(x => {
        //     x.checked = false;
        //     if (value === x.value) { x.checked = true; }
        // });
    }
    
    
    return <div className='toggle-container'>
        <ul className='toggle-section'>
        {props.toggleList.map(btn => 
            <li className={btn.classname}>
                <input tabIndex={-1} type="radio" id={btn.name} name={props.toggleButtonName} />
                <label className={"thin " + (btn.checked ? "checked" : "")} 
                    tabIndex={0} 
                    onClick={ () => { 
                        updateCheckedState(btn.value);
                        props.onclick(btn.value);
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