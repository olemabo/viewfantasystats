import { FunctionComponent, useEffect, useState } from 'react';
import { Popover } from '../../Shared/Popover/Popover';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import './TableSortHead.scss';

type TableSortHeadProps = {
    text: string,
    onclick: any,
    defaultSortType?: TableSortType,
    reset?: boolean,
    popover_title?: string,
    popover_text?: string,
}

const SortType = {
	Decreasing: 'Decreasing',
	Increasing: 'Increasing',
	NotSorted: 'NotSorted',
}

export type TableSortType = 'Decreasing' | 'Increasing' | 'NotSorted';

export const Decreasing: TableSortType = 'Decreasing';
export const Increasing: TableSortType = 'Increasing';
export const NotSorted: TableSortType = 'NotSorted';

export const TableSortHead : FunctionComponent<TableSortHeadProps> = ({
    text,
    onclick,
    defaultSortType = SortType.NotSorted,
    reset,
    popover_title,
    popover_text,
}) => {
    const [ sortType, setSortType ] = useState(defaultSortType);

    useEffect(() => {
        if (reset) {
            setSortType(SortType.NotSorted);
        }

    }, [reset]);

    useEffect(() => {
        if ( (text == "EO" || text == "Points") && reset) {
            setSortType(SortType.NotSorted);
        }
        else if ( (text == "EO" || text == "Points") && defaultSortType && sortType == SortType.NotSorted) {
            setSortType(defaultSortType);
        }
    });

    function sortCell() {
        if (sortType == SortType.NotSorted) {
            setSortType(SortType.Increasing);
            onclick(true);
        }
        if (sortType == SortType.Increasing) {
            setSortType(SortType.Decreasing);
            onclick(false);
        }
        if (sortType == SortType.Decreasing) {
            setSortType(SortType.Increasing);
            onclick(true);
        }
    }
    return <>
        <div className='sort-text'><>
            {(popover_text && popover_title) ?
                <Popover
                    id={text}
                    title={text}
                    popoverTitle={popover_title ?? ''}
                    popoverText={popover_text ?? ''} />
                : <>{text}</>
            }</>
        </div>
        <button 
            title="sort-arrow-button"
            onClick={() => sortCell()} 
            className="sort-arrows-container"
        >
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