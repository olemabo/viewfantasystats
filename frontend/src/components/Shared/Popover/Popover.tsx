import React, { FunctionComponent, useEffect, useState } from 'react';
import './Popover.scss';

type PopoverProps = {
    id: string;
    title: string;
    popover_title: string;
    html_title?: string;
    popover_text: string;
    iconSize?: number;
    algin_left?: boolean;
    iconpostition?: number[];
    children?: React.ReactNode;
    topRigthCornerInDiv?: boolean;
    className?: string;
}

export const Popover : FunctionComponent<PopoverProps> = ({
    id,
    title,
    popover_title,
    popover_text,
    iconSize = 0,
    algin_left = false,
    iconpostition = [0, 0, 0, 0],
    topRigthCornerInDiv = false,
    html_title = "",
    className = "",
    children,
}) => {

    
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

    // let id = title;
    useEffect(() => {
        var ignoreClickOnMeElement = document.getElementById(id);
        document.addEventListener('click', function(event: any) {
            // event.stopPropagation();
            if (ignoreClickOnMeElement != null) {
                var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                if (!isClickInsideElement) {
                    setShow(false);
                }
            }
        });
    });   

    return <>
    <label style={{ position: (topRigthCornerInDiv ? 'initial' : 'relative')}} htmlFor={'popover-content-' + id} id={id} className={ "thin-ui-popover " + (iconSize != null && iconSize > 0 ? "" : "dotted")}>
        {title}
        { topRigthCornerInDiv ? <>
        { iconSize != null && iconSize > 0 && iconpostition != null &&
            <button id={'popover-content-' + id} title={html_title} name="popover"><svg onClick={() => setShow(true)} style={{
                width: iconSize.toString() + "px", 
                position: "relative", 
                borderBottomStyle: "none",
                }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" 
                className={`svg-inline--fa fa-question-circle fa-w-16 fa-fw top-corner`}
                data-icon="question-circle" data-prefix="fal" viewBox="0 0 512 512">
                <defs />
                <path fill="currentColor" d="M256 340a28 28 0 100 56 28 28 0 000-56zm7.7-24h-16a12 12 0 01-12-12v-.4c0-70.3 77.4-63.6 77.4-107.4 0-20-17.8-40.2-57.4-40.2-29.2 0-44.3 9.6-59.2 28.7-4 5-11 6-16.3 2.4l-13.1-9.2a12 12 0 01-2.7-17.2c21.3-27.2 46.4-44.7 91.3-44.7 52.3 0 97.4 29.8 97.4 80.2 0 67.4-77.4 63.9-77.4 107.4v.4a12 12 0 01-12 12zM256 40a216 216 0 110 432 216 216 0 010-432m0-32a248 248 0 100 496 248 248 0 000-496z" />
            </svg></button> }</>
        :     
        <button onClick={() => setShow(true)} style={{height: iconSize.toString() + "px"}} id={'popover-content-' + id} title={html_title} name="popover">
            { iconSize != null && iconSize > 0 && iconpostition != null &&
                <svg style={{
                    width: iconSize.toString() + "px", 
                    position: "relative", 
                    borderBottomStyle: "none",
                    top: iconpostition[0].toString() + "px",
                    right: iconpostition[1].toString() + "px",
                    bottom: iconpostition[2].toString() + "px",
                    left: iconpostition[3].toString() + "px",
                    }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" 
                    className={`svg-inline--fa fa-question-circle fa-w-16 fa-fw ${(topRigthCornerInDiv ? ' top-corner' : '')}`}
                    data-icon="question-circle" data-prefix="fal" viewBox="0 0 512 512">
                    <defs />
                    <path fill="currentColor" d="M256 340a28 28 0 100 56 28 28 0 000-56zm7.7-24h-16a12 12 0 01-12-12v-.4c0-70.3 77.4-63.6 77.4-107.4 0-20-17.8-40.2-57.4-40.2-29.2 0-44.3 9.6-59.2 28.7-4 5-11 6-16.3 2.4l-13.1-9.2a12 12 0 01-2.7-17.2c21.3-27.2 46.4-44.7 91.3-44.7 52.3 0 97.4 29.8 97.4 80.2 0 67.4-77.4 63.9-77.4 107.4v.4a12 12 0 01-12 12zM256 40a216 216 0 110 432 216 216 0 010-432m0-32a248 248 0 100 496 248 248 0 000-496z" />
                </svg> }
        </button>
        }
        { show &&
        <div id={'popover-content-' + id} className={"thin-ui-popover-body " + (algin_left ? "adjust-left " : " ") + (topRigthCornerInDiv ? "adjust-top-right-mobile " : " ") + className}>
            <h3>{popover_title}</h3>
            <p>{popover_text}</p>
            <p>{children}</p>
        </div>}
    </label>
    </>
};

export default Popover;