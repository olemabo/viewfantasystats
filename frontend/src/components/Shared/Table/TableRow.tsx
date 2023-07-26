import React, { FunctionComponent } from 'react';

type TableRowProps = {
    className?: string,
    children?: React.ReactNode;
}

export const TableRow : FunctionComponent<TableRowProps> = (props) => {
    return <tr className={props.className}>
        { props.children}
    </tr>
};