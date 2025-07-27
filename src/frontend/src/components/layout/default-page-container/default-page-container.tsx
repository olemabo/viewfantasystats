"use server"

import React, { CSSProperties } from 'react';
import { HelmetAndMetaData } from '../../shared/HelmetAndMetaData/HelmetAndMetaData';
import { fpl, LeagueType } from '../../../models/shared/LeagueType';
import { MessageErrorLoading } from '../../shared/Messages/Messages';
import { Spinner } from '../../shared/ui/spinner/Spinner';
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
    langCode?: string;
};

export default async function DefaultPageContainer({ 
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
    langCode,
}: DefaultPageContainerProps) {
    const fullHeading = `${heading} - ${leagueType === fpl ? 'Premier League' : 'Eliteserien'}`;

    return (
        <div style={style} className={pageClassName} key={`${heading}-container`} lang={langCode}>
            <HelmetAndMetaData description={description} heading={fullHeading} />
            {renderTitle ? renderTitle() : pageTitle && <h1>{pageTitle}</h1>}
            {isLoading ? <Spinner /> : isEmptyErrorLoadingState(errorLoading) ? children : <MessageErrorLoading errorLoading={errorLoading} />}
        </div>
    );
};