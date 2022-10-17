import { Helmet } from 'react-helmet';
import React from 'react';

type HelmetAndMetaDataProps = {
    description: string;
    heading: string;
}

export const HelmetAndMetaData : React.FunctionComponent<HelmetAndMetaDataProps> = (props) => {
    return <Helmet key='page-helmet'>
        <title>{props.heading}</title>
        <meta property='og:title' content={ props.heading }/>
        <meta property='og:description' content={props.description} />
        <meta property='description' content={props.description} />
    </Helmet>
}

export default HelmetAndMetaData;