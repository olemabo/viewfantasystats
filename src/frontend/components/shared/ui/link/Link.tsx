import React, { FunctionComponent } from 'react';
import './Link.scss';

export type TargetType = '_blank' | '';

type LinkProps = {
    href: string;
    target?: TargetType;
    className?: string,
    children?: React.ReactNode;
}

export const Link : FunctionComponent<LinkProps> = (props) => {
    return <a target={props.target} href={props.href} className={`link-container ${props.className}`}>
        { props.children }
    </a>
};