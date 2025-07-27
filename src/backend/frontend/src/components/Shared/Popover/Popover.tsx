import React, { FunctionComponent, useEffect, useState } from 'react';
import './Popover.scss';

type PopoverProps = {
    id: string;
    title?: string;
    popoverTitle: string;
    htmlTitle?: string;
    popoverText?: string;
    iconSize?: number;
    alignLeft?: boolean;
    iconPosition?: number[];
    children?: React.ReactNode;
    topRightCornerInDiv?: boolean;
    className?: string;
    adjustLeftPx?: string;
};

export const Popover : FunctionComponent<PopoverProps> = ({
    id,
    title = '',
    popoverTitle,
    popoverText,
    iconSize = 0,
    alignLeft = false,
    iconPosition = [0, 0, 0, 0],
    topRightCornerInDiv = false,
    htmlTitle = '',
    className = '',
    children,
    adjustLeftPx = ''
}) => {
    const [ show, setShow ] = useState(false);

    useEffect(() => {
        const popoverButtons = Array.from(document.querySelectorAll('[data-popover-target]'));
        popoverButtons.forEach(button => {
            const targetId = button.getAttribute('data-popover-target');
            if (targetId) {
                const targetPopover = document.getElementById(targetId);
                const closeButton = targetPopover?.querySelector('.thin-ui-popover-close-button');

                button.addEventListener('click', () => {
                    document.querySelectorAll('.thin-ui-popover').forEach(el => {
                        el.classList.add('hide');
                    });
                    targetPopover?.classList.toggle('hide');
                });

                closeButton?.addEventListener('click', () => {
                    targetPopover?.classList.toggle('hide');
                });
            }
        });
    }, []);

    useEffect(() => {
        const ignoreClickOnMeElement = document.getElementById(id);
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (ignoreClickOnMeElement && target) {
                const isClickInsideElement = ignoreClickOnMeElement.contains(target);
                if (!isClickInsideElement) {
                    setShow(false);
                } else {
                    setShow(true);
                }
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [id]);

    return <>
    <label
        style={{ position: topRightCornerInDiv ? 'initial' : 'relative' }}
        htmlFor={`popover-content-${id}`}
        id={id}
        className={`thin-ui-popover ${iconSize > 0 ? '' : 'dotted'} ${className}`}
    >
        {title}
        { topRightCornerInDiv ? <>
            { iconSize > 0 &&
                <button 
                    id={`popover-content-${id}`}
                    title={htmlTitle} 
                    name='popover'
                >
                    <svg 
                        style={{
                            width: `${iconSize}px`,
                            position: "relative", 
                            borderBottomStyle: "none",
                        }} 
                        xmlns="http://www.w3.org/2000/svg" 
                        aria-hidden="true" 
                        className={`svg-inline--fa fa-question-circle fa-w-16 fa-fw top-corner`}
                        data-icon="question-circle" 
                        data-prefix="fal" 
                        viewBox="0 0 512 512"
                    >
                    <defs />
                    <path 
                        fill="currentColor"
                        d="M256 340a28 28 0 100 56 28 28 0 000-56zm7.7-24h-16a12 12 0 01-12-12v-.4c0-70.3 77.4-63.6 77.4-107.4 0-20-17.8-40.2-57.4-40.2-29.2 0-44.3 9.6-59.2 28.7-4 5-11 6-16.3 2.4l-13.1-9.2a12 12 0 01-2.7-17.2c21.3-27.2 46.4-44.7 91.3-44.7 52.3 0 97.4 29.8 97.4 80.2 0 67.4-77.4 63.9-77.4 107.4v.4a12 12 0 01-12 12zM256 40a216 216 0 110 432 216 216 0 010-432m0-32a248 248 0 100 496 248 248 0 000-496z" 
                    />
                    </svg>
                </button>
            }
            </>
            :     
            <button 
                style={{ height: `${iconSize}px` }}
                id={`popover-content-${id}`}
                title={htmlTitle} 
                name='popover'
            >
                { iconSize > 0 &&
                    <svg 
                        style={{
                            width: `${iconSize}px`,
                            position: 'relative',
                            borderBottomStyle: 'none',
                            top: `${iconPosition[0]}px`,
                            right: `${iconPosition[1]}px`,
                            bottom: `${iconPosition[2]}px`,
                            left: `${iconPosition[3]}px`,
                        }}
                        xmlns="http://www.w3.org/2000/svg" 
                        aria-hidden="true" 
                        className={`svg-inline--fa fa-question-circle fa-w-16 fa-fw ${(topRightCornerInDiv ? ' top-corner' : '')}`}
                        data-icon="question-circle" 
                        data-prefix="fal" 
                        viewBox="0 0 512 512">
                        <defs />
                        <path 
                            fill="currentColor"
                            d="M256 340a28 28 0 100 56 28 28 0 000-56zm7.7-24h-16a12 12 0 01-12-12v-.4c0-70.3 77.4-63.6 77.4-107.4 0-20-17.8-40.2-57.4-40.2-29.2 0-44.3 9.6-59.2 28.7-4 5-11 6-16.3 2.4l-13.1-9.2a12 12 0 01-2.7-17.2c21.3-27.2 46.4-44.7 91.3-44.7 52.3 0 97.4 29.8 97.4 80.2 0 67.4-77.4 63.9-77.4 107.4v.4a12 12 0 01-12 12zM256 40a216 216 0 110 432 216 216 0 010-432m0-32a248 248 0 100 496 248 248 0 000-496z"
                        />
                    </svg> }
            </button>
        }
        {show && (
            <div
                id={`popover-content-${id}`}
                style={{left: adjustLeftPx}}
                className={`thin-ui-popover-body ${alignLeft ? 'adjust-left ' : ''} ${
                    topRightCornerInDiv ? 'adjust-top-right-mobile ' : ''
                } ${className}`}
            >
                <h3>{popoverTitle}</h3>
                { popoverText && <p>{popoverText}</p> }
                <p>{children}</p>
            </div>
        )}
    </label>
    </>
};

export default Popover;