import { HelmetAndMetaData } from '../../Shared/HelmetAndMetaData/HelmetAndMetaData';
import React from 'react';
import { useSelector } from 'react-redux';

type DefaultPageContainerProps = {
    heading: string;
    description: string;
    pageClassName?: string;
}

export const DefaultPageContainer : React.FunctionComponent<DefaultPageContainerProps> = (props) => {  
    const langaugeCodeFromRedux = useSelector((state: any) => state?.language_code);

    return <>
        <div className={props.pageClassName} key={props.heading + "-container"} lang={langaugeCodeFromRedux}>
            <HelmetAndMetaData description={props.description} heading={props.heading} />
                {props.children}
        </div>
    </>
}

export default DefaultPageContainer;

DefaultPageContainer.defaultProps = {
    pageClassName: "",
}