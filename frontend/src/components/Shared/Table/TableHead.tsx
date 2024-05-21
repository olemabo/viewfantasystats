import React, { FunctionComponent } from 'react';

export type TableHeight = 'normal' | 'compact';

type TableHeadProps = {
    className?: string,
    tableHeight?: TableHeight,
    children?: React.ReactNode;
}

export const TableHead : FunctionComponent<TableHeadProps> = ({
    className, tableHeight = 'normal', children
}) => {
    
    return <thead className={`${className ?? ''} ${tableHeight}`}>
        { children}
    </thead>
};