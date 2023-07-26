import React, { FunctionComponent, useEffect, useState } from 'react';
import { Popover } from '../../Shared/Popover/Popover';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import './TableSortHead.scss';

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
        <button title="sort-arrow-button" onClick={() => sortCell()} className="sort-arrows-container">
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