import React, { FunctionComponent } from 'react';

export type TableCellType = 'data' | 'head';

type TableCellProps = {
    cellType: TableCellType;
    className?: string;
    minWidth?: number;
    children?: React.ReactNode;
}

export const TableCell : FunctionComponent<TableCellProps> = (props) => {
    
    return props.cellType === 'head' ? 
        <th style={{ minWidth: props.minWidth ?? undefined }} className={props.className}>{props.children}</th> : 
        <td style={{ minWidth: props.minWidth ?? undefined }} className={props.className}>{props.children}</td> 
};