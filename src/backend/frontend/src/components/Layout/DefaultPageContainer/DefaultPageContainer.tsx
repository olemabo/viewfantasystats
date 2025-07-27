import React, { CSSProperties, useEffect } from 'react';
import { HelmetAndMetaData } from '../../Shared/HelmetAndMetaData/HelmetAndMetaData';
import { languageCodeSelector } from '../../../store/selectors/languageCodeSelector';
import { fpl, LeagueType } from '../../../models/shared/LeagueType';
import { useSelector } from 'react-redux';
import useLeagueTypeDispatch from '../../../hooks/useLeagueTypeDispatch';
import { MessageErrorLoading } from '../../Shared/Messages/Messages';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { ErrorLoading, isEmptyErrorLoadingState } from '../../../models/shared/errorLoading';

type DefaultPageContainerProps = {
    heading: string;
    description: string;
    leagueType: LeagueType;
    pageClassName?: string;
    children?: React.ReactNode;
    renderTitle?: () => React.ReactNode;
    errorLoading?: ErrorLoading;
    isLoading?: boolean;
    pageTitle?: string;
    style?: CSSProperties;
};

export const DefaultPageContainer: React.FC<DefaultPageContainerProps> = ({
    heading,
    description,
    pageClassName = '',
    leagueType,
    children,
    renderTitle,
    errorLoading,
    isLoading,
    pageTitle,
    style,
}) => {
    useLeagueTypeDispatch(leagueType);
    const languageCode = useSelector(languageCodeSelector);

    useEffect(() => {
        document.documentElement.lang = languageCode;
    }, [languageCode]);

    const fullHeading = `${heading} - ${leagueType === fpl ? 'Premier League' : 'Eliteserien'}`;

    return (
        <div style={style} className={pageClassName} key={`${heading}-container`} lang={languageCode}>
            <HelmetAndMetaData description={description} heading={fullHeading} />
            {renderTitle ? renderTitle() : pageTitle && <h1>{pageTitle}</h1>}
            {isLoading ? <Spinner /> : isEmptyErrorLoadingState(errorLoading) ? children : <MessageErrorLoading errorLoading={errorLoading} />}
        </div>
    );
};

export default DefaultPageContainer;