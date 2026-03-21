"use server"

import { getFixtureData, getKickoffTimes, getTeamData } from "@/components/features/fixtures/utils/api";
import FixturePlannerHeader from "@/components/features/fixtures/utils/header-and-popover";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import { getFixtureDataESFServer } from "@/components/features/fixtures/fixture-planner/esf-api";
import RotationPlannerPage from "@/components/pages/rotation-planner/rotation-planner";

import { maxGwEsf, maxGwFpl } from "@/constants/gws";
import { getFixtureDataFPLServerFPL } from "@/lib/api/fixturePlanner/getFixturePlannerData";
import { getKickoffTimesESF, getKickoffTimesFPL } from "@/lib/api/kickoffTimes/getKickOffTimes";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { esf, fpl } from "@/models/shared/LeagueType";
import { FixturePlanningTypes } from "@/types/fixturePlanningType";
import { LeaguePath, LeagueType, LeagueTypeByPath } from "@/types/league";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ leagueName: LeaguePath }>;
  searchParams: Promise<{
    startGw?: string;
    endGw?: string;
    minNumFixtures?: string;
    fdrType?: string;
    teamsToCheck?: string;
    teamsToPlay?: string;
    teamsInSolution?: string[];
    fplTeams?: string[];
  }>;
};

export default async function Page({
  params,
  searchParams
}: PageProps) {
    const {leagueName} = await params;
    const { startGw, endGw, minNumFixtures, teamsToCheck,
    teamsToPlay, fplTeams, teamsInSolution } = await searchParams;

    const t = await getTranslations();
    const leagueType = LeagueTypeByPath[leagueName];
    const maxGw = leagueType === esf ? maxGwEsf : maxGwFpl;

    // MÅ HÅNDTERE start og end gw midt i sesongen
    const defaultForm: FDRFormInput = {
        startGw: Number(startGw ?? -1),
        endGw: Number(endGw ?? 38),
        minNumFixtures: Number(minNumFixtures ?? 3),
        teamsToCheck: Number(teamsToCheck ?? 2),
        teamsToPlay: Number(teamsToPlay ?? 1),
        fdrType: "",
        fixturePlanningType: FixturePlanningTypes.ROTATION,
        teamsInSolution: teamsInSolution ?? [],
        fplTeams: fplTeams ?? [],
        maxGw: maxGw
    };

    const [fixtureData, kickOffTimes, teamData] = await Promise.all([
        getFixtureData(defaultForm, leagueType),
        getKickoffTimes(leagueType),
        getTeamData(leagueType)
    ]);

    defaultForm.startGw = fixtureData.startGw;
    defaultForm.endGw = fixtureData.endGw;

    return (
        <DefaultPageContainer 
            pageClassName='fixture-planner-container'
            heading={t('Fixture.RotationPlanner.Title')} 
        >
            <FixturePlannerHeader
                fixturePlanningType={defaultForm.fixturePlanningType} 
                leagueType={leagueType}
            />

            <RotationPlannerPage 
                fixtureData={fixtureData.fdrRotationData}
                defaultTeamData={teamData}
                kickOffTimes={kickOffTimes}
                defaultForm={defaultForm}
            />
        </DefaultPageContainer>
    );
}