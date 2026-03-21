"use server"

import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import FixturePlannerPage from "@/components/features/fixtures/fixture-planner/fixture-planner";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { FixturePlanningTypes } from "@/types/fixturePlanningType";
import { LeaguePath, LeagueTypeByPath } from "@/types/league";
import { getTranslations } from "next-intl/server";
import { esf } from "@/models/shared/LeagueType";
import { maxGwEsf, maxGwFpl } from "@/constants/gws";
import FixturePlannerHeader from "@/components/features/fixtures/utils/header-and-popover";
import { getFixtureData, getKickoffTimes } from "@/components/features/fixtures/utils/api";

type PageProps = {
  params: Promise<{ leagueName: LeaguePath }>;
  searchParams: Promise<{
    startGw?: string;
    endGw?: string;
    minNumFixtures?: string;
    fdrType?: string;
  }>;
};

export default async function Page({
  params,
  searchParams
}: PageProps) {
    const {leagueName} = await params;
    const { startGw, endGw, minNumFixtures, fdrType } = await searchParams;

    const t = await getTranslations('Fixture.FixturePlanner');
    const leagueType = LeagueTypeByPath[leagueName];

    const maxGw = leagueType === esf ? maxGwEsf : maxGwFpl;
    
    const defaultForm: FDRFormInput = {
        startGw: Number(startGw ?? -1),
        endGw: Number(endGw ?? 38),
        minNumFixtures: Number(minNumFixtures ?? 3),
        fdrType: fdrType ?? '',
        fixturePlanningType: FixturePlanningTypes.PLANNER,
        maxGw: maxGw
    };

    const [fixtureData, kickOffTimes] = await Promise.all([
        getFixtureData(defaultForm, leagueType),
        getKickoffTimes(leagueType),
    ]);

    
    defaultForm.startGw = fixtureData.startGw;
    defaultForm.endGw = fixtureData.endGw;
    
    return (
        <DefaultPageContainer 
            pageClassName='fixture-planner-container'
            heading={t('Title')} 
        >
            <FixturePlannerHeader
                fixturePlanningType={defaultForm.fixturePlanningType} 
                leagueType={leagueType}
            />
            <FixturePlannerPage 
                fixturePlanningType={FixturePlanningTypes.PLANNER}
                fixtureData={fixtureData.fdrData}
                kickOffTimes={kickOffTimes}
                defaultForm={defaultForm}
            />
        </DefaultPageContainer>
    );
}