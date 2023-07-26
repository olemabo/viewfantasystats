import React, { FunctionComponent } from 'react';

export type TableHeight = 'normal' | 'compact';

type TableHeadProps = {
    className?: string,
    tableHeight?: TableHeight,
    children?: React.ReactNode;
}

export const TableHead : FunctionComponent<TableHeadProps> = (props) => {
    
    return <thead className={`${props.className ?? ''} ${props.tableHeight}`}>
        { props.children}
    </thead>
};

TableHead.defaultProps = {
    tableHeight: 'normal'
}