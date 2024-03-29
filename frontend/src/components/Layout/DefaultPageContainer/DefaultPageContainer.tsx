import { HelmetAndMetaData } from '../../Shared/HelmetAndMetaData/HelmetAndMetaData';
import { languageCodeSelector } from '../../../store/selectors/languageCodeSelector';
import { setLeagueType } from '../../../hooks/useLeagueTypeDispatch';
import { LeagueType, fpl } from '../../../models/shared/LeagueType';
import { useSelector } from 'react-redux';
import React from 'react';

type DefaultPageContainerProps = {
    heading: string;
    description: string;
    leagueType: LeagueType;
    pageClassName?: string;
    children?: React.ReactNode;
}

export const DefaultPageContainer : React.FunctionComponent<DefaultPageContainerProps> = ({
    heading,
    description,
    pageClassName = '',
    leagueType,
    children,
  }) => {  
    setLeagueType(leagueType);
    const langaugeCodeFromRedux = useSelector(languageCodeSelector);
    document.documentElement.lang = langaugeCodeFromRedux;

    const fullHeading = `${heading} - ${(leagueType === fpl ? "Premier League" : "Eliteserien")}`;

    return (
        <div className={pageClassName} key={`${heading}-container`} lang={langaugeCodeFromRedux}>
            <HelmetAndMetaData description={description} heading={fullHeading} />
            {children}
        </div>
    );
};

export default DefaultPageContainer;
