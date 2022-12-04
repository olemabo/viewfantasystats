import { Helmet } from 'react-helmet';
import React from 'react';

type HelmetAndMetaDataProps = {
    description: string;
    heading: string;
}

export const HelmetAndMetaData : React.FunctionComponent<HelmetAndMetaDataProps> = (props) => {
    return <Helmet key='page-helmet'>
        <title>{props.heading}</title>
        <meta name='og:title' content={ props.heading }/>
        <meta name='og:description' content={props.description} />
        <meta name='description' content={props.description} />
    </Helmet>
}

export default HelmetAndMetaData;