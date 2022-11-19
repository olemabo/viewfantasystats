import React, { FunctionComponent, useEffect, useState } from 'react';
import './Popover.scss';

type PopoverProps = {
    id: string;
    title: string;
    popover_title: string;
    popover_text: string;
    iconSize?: number;
    algin_left?: boolean;
    iconpostition?: number[];
}

export const Popover : FunctionComponent<PopoverProps> = (props) => {

    
    if (document.querySelector('[data-popover-target]')) {
        // Create an array of all popover toggle buttons on the page
        let popoverButtonsArray: any = [].slice.call(document.querySelectorAll('[data-popover-target]'));
    
        // Assign toggle buttons to corosponding popover
        popoverButtonsArray.forEach((currentValue: any, currentIndex: any, listObj: any) => {
            let targetIdName = popoverButtonsArray[currentIndex].dataset.popoverTarget; // get the id from dataset
            let targetPopover : any = document.getElementById(targetIdName); // get the element based on id
            let targetCloseButton = targetPopover.querySelector('.thin-ui-popover-close-button'); // popover close icon
    
            // Assign all the buttons to open and close their popovers
            popoverButtonsArray[currentIndex].addEventListener('click', () => {
                // Hide other popovers
                let popoverTriggers = document.querySelectorAll('.thin-ui-popover');
                [].forEach.call(popoverTriggers, function (el: any) {
                    el.classList.add('hide');
                });
    
                targetPopover.classList.toggle('hide');
            });
    
            // Make the close icon close the popover
            targetCloseButton.addEventListener('click', () => {
                targetPopover.classList.toggle('hide');
            });
        });
    }

    const [ show, setShow ] = useState(false);

    // let id = props.title;
    useEffect(() => {
        var ignoreClickOnMeElement = document.getElementById(props.id);
        document.addEventListener('click', function(event: any) {
            if (ignoreClickOnMeElement != null) {
                var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                if (!isClickInsideElement) {
                    setShow(false);
                }
            }
        });
    });   

    return <>
    <label htmlFor='popover-content' id={props.id} className={ "thin-ui-popover " + (props.iconSize != null && props.iconSize > 0 ? "" : "dotted")}>
        {props.title}
        <button id='popover-button' title="popover-button" name="popover" onClick={() => setShow(true)}>
            { props.iconSize != null && props.iconSize > 0 && props.iconpostition != null &&
                <svg style={{
                    width: props.iconSize.toString() + "px", 
                    position: "relative", 
                    borderBottomStyle: "none",
                    top: props.iconpostition[0].toString() + "px",
                    right: props.iconpostition[1].toString() + "px",
                    bottom: props.iconpostition[2].toString() + "px",
                    left: props.iconpostition[3].toString() + "px",
                    }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="svg-inline--fa fa-question-circle fa-w-16 fa-fw" data-icon="question-circle" data-prefix="fal" viewBox="0 0 512 512">
                    <defs />
                    <path fill="currentColor" d="M256 340a28 28 0 100 56 28 28 0 000-56zm7.7-24h-16a12 12 0 01-12-12v-.4c0-70.3 77.4-63.6 77.4-107.4 0-20-17.8-40.2-57.4-40.2-29.2 0-44.3 9.6-59.2 28.7-4 5-11 6-16.3 2.4l-13.1-9.2a12 12 0 01-2.7-17.2c21.3-27.2 46.4-44.7 91.3-44.7 52.3 0 97.4 29.8 97.4 80.2 0 67.4-77.4 63.9-77.4 107.4v.4a12 12 0 01-12 12zM256 40a216 216 0 110 432 216 216 0 010-432m0-32a248 248 0 100 496 248 248 0 000-496z" />
                </svg> }
        </button>
        { show &&
        <div id="popover-content" className={"thin-ui-popover-body " + (props.algin_left ? "adjust-left" : " ")}>
            <h3>{props.popover_title}</h3>
            <p>{props.popover_text}</p>
            <p>{props.children}</p>
        </div>}
    </label>
    </>
};

export default Popover;


Popover.defaultProps = {
    iconSize: 0,
    iconpostition: [0, 0, 0, 0],
    algin_left: false,
}