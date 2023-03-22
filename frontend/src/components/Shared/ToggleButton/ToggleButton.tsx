import React, { FunctionComponent, useEffect, useState } from 'react';
import './ToggleButton.scss';

type ToggleButtonProps = {
    on_text: string;
    of_text: string;
    onclick: any;
}

export const ToggleButton : FunctionComponent<ToggleButtonProps> = (props) => {

    return <>
        <label className="toggle">
            <input onChange={(e) => props.onclick(e.target.checked)} type="checkbox"></input>
            <span className="labels" data-on={props.on_text} data-off={props.of_text}></span>
        </label>
    </>
};

export default ToggleButton;