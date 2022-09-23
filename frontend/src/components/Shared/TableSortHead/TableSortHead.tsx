import { TableSortLabelTypeMap } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import './TableSortHead.scss';
import { Popover } from '../../Shared/Popover/Popover';

type TableSortHeadProps = {
    text: string,
    onclick: any,
    defaultSortType?: string,
    reset?: boolean,
    popover_title?: string,
    popover_text?: string,
}

const SortType = {
	Decreasing: "Decreasing",
	Increasing: "Increasing",
	NotSorted: "NotSorted",
}

export const TableSortHead : FunctionComponent<TableSortHeadProps> = (props) => {
    const [ sortType, setSortType ] = useState(props.defaultSortType);

    useEffect(() => {
        if (props.reset) {
            setSortType(SortType.NotSorted);
        }       

    }, [props.reset]);

    useEffect(() => { 
        if ( (props.text == "EO" || props.text == "Points") && props.reset) {
            setSortType(SortType.NotSorted);
        } 
        else if ( (props.text == "EO" || props.text == "Points") && props.defaultSortType && sortType == SortType.NotSorted) {
            setSortType(props.defaultSortType);
        }
    });
    
    function sortCell() {
        if (sortType == SortType.NotSorted) {
            setSortType(SortType.Increasing);
            props.onclick(true);
        }
        if (sortType == SortType.Increasing) {
            setSortType(SortType.Decreasing);
            props.onclick(false);
        }
        if (sortType == SortType.Decreasing) {
            setSortType(SortType.Increasing);
            props.onclick(true);
        }
    }
    return <>
        <div className={ (sortType == SortType.NotSorted) ? 'sort-text-adjusted' : 'sort-text'}><>
        { (props.popover_text != '' && props.popover_title != '') ? 
            <Popover
                id={props.text} 
                title={props.text}
                popover_title={props.popover_title ?? ''} 
                popover_text={props.popover_text ?? ''} /> 
            : <>{props.text}</>
        }</>
        </div> 
        <div onClick={() => sortCell()} className="sort-arrows-container">
            <div className={ sortType == SortType.NotSorted ? 'sort-arrow-top-adjusted' : 'sort-arrow-top'}>
            { (sortType == SortType.NotSorted || sortType == SortType.Increasing) && 
                <>&#x25b4;</> 
            } </div>
            <div className={ sortType == SortType.NotSorted ? 'sort-arrow-bottom-adjusted' : 'sort-arrow-bottom'}>
            { (sortType == SortType.NotSorted || sortType == SortType.Decreasing) && 
            <>&#x25be;</> 
            }
        </div>
    </div></>
};

export default TableSortHead;


TableSortHead.defaultProps = {
    defaultSortType: SortType.NotSorted,
    reset: false,
    popover_title: '',
    popover_text: '',
}