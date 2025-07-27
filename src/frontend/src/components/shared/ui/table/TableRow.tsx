import React, { FunctionComponent } from 'react';

type TableRowProps = {
    className?: string,
    children?: React.ReactNode;
}

export const TableRow : FunctionComponent<TableRowProps> = ({
    className, children
}) => {
    return <tr className={className}>
        { children}
    </tr>
};