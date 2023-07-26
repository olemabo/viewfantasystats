import React, { FunctionComponent } from 'react';

type TableBodyProps = {
    className?: string,
    children?: React.ReactNode;
}

export const TableBody : FunctionComponent<TableBodyProps> = (props) => {
    
    return <tbody className={props.className}>
        { props.children}
    </tbody>
};