import React, { FunctionComponent } from 'react';
import './Table.scss';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

export type TableLayoutType = 'fpl' | 'esf';

type TableProps = {
    tableLayoutType: TableLayoutType;
    className?: string,
    children?: React.ReactNode;
}

export const Table : FunctionComponent<TableProps> = (props) => {
    return <table className={`table-container ${props.className ?? ''} ${props.tableLayoutType}`}>
        { props.children}
    </table>
};

export { TableHead };
export { TableBody };
export { TableRow };
export { TableCell };

export default Table;

