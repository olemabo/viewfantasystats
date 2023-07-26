import { HelmetAndMetaData } from '../../Shared/HelmetAndMetaData/HelmetAndMetaData';
import { useSelector } from 'react-redux';
import React from 'react';

type DefaultPageContainerProps = {
    heading: string;
    description: string;
    pageClassName?: string;
    children?: React.ReactNode;
}

export const DefaultPageContainer : React.FunctionComponent<DefaultPageContainerProps> = ({
    heading,
    description,
    pageClassName = '',
    children,
  }) => {  
    const langaugeCodeFromRedux = useSelector((state: any) => state?.language_code);
    document.documentElement.lang = langaugeCodeFromRedux;
    
    return (
        <div className={pageClassName} key={`${heading}-container`} lang={langaugeCodeFromRedux.toString()}>
            <HelmetAndMetaData description={description} heading={heading} />
                {children}
        </div>
    );
};

export default DefaultPageContainer;
