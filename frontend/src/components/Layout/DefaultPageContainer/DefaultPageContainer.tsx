import { HelmetAndMetaData } from '../../Shared/HelmetAndMetaData/HelmetAndMetaData';
import { useSelector } from 'react-redux';
import React from 'react';

type DefaultPageContainerProps = {
    heading: string;
    description: string;
    pageClassName?: string;
}

export const DefaultPageContainer : React.FunctionComponent<DefaultPageContainerProps> = (props) => {  
    const langaugeCodeFromRedux = useSelector((state: any) => state?.language_code);
    document.documentElement.lang = langaugeCodeFromRedux;
    
    return <>
        <div className={props.pageClassName} key={props.heading + "-container"} lang={langaugeCodeFromRedux.toString()}>
            <HelmetAndMetaData description={props.description} heading={props.heading} />
                {props.children}
        </div>
    </>
}

export default DefaultPageContainer;

DefaultPageContainer.defaultProps = {
    pageClassName: "",
}