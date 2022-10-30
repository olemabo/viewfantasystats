import { TableSortLabelTypeMap } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import './TableSortHead.scss';
import { Popover } from '../../Shared/Popover/Popover';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownIcon from  '@material-ui/icons/ArrowDropDownOutlined';
import UnfoldMore from  '@material-ui/icons/UnfoldMore';
import ExpandLess from  '@material-ui/icons/ExpandLess';
import ExpandMore from  '@material-ui/icons/ExpandMore';

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
        <div className='sort-text'><>
        { (props.popover_text != '' && props.popover_title != '') ?
            <Popover
                id={props.text}
                title={props.text}
                popover_title={props.popover_title ?? ''}
                popover_text={props.popover_text ?? ''} />
            : <>{props.text}</>
        }</>
        </div>
        <button onClick={() => sortCell()} className="sort-arrows-container">
            { (sortType == SortType.Increasing) &&
                    <ExpandLess fontSize={'inherit'}  />
            }
            { (sortType == SortType.Decreasing) &&
                    <ExpandMore fontSize={'inherit'} />
            }
            { (sortType == SortType.NotSorted) &&
                    <UnfoldMore fontSize={'inherit'} />
            }
        </button>
    </>
};

export default TableSortHead;


TableSortHead.defaultProps = {
    defaultSortType: SortType.NotSorted,
    reset: false,
    popover_title: '',
    popover_text: '',
}