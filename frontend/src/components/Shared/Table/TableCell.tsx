import React, { FunctionComponent } from 'react';

export type TableCellType = 'data' | 'head';

type TableCellProps = {
    cellType: TableCellType;
    className?: string;
    minWidth?: number;
    children?: React.ReactNode;
    tableKey?: string;
}

export const TableCell : FunctionComponent<TableCellProps> = ({
    cellType, className, minWidth, children, tableKey
}) => {
    
    return cellType === 'head' ? 
        <th key={tableKey} style={{ minWidth: minWidth ?? undefined }} className={className}>{children}</th> : 
        <td key={tableKey} style={{ minWidth: minWidth ?? undefined }} className={className}>{children}</td> 
};