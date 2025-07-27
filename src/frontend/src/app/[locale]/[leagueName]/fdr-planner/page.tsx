"use server"

import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import FixturePlannerPage from "@/components/pages/fixture-planner/fixture-planner";
import FdrBox from "@/components/shared/FDR-explaination/fdr-box";

import Popover from "@/components/shared/Popover/Popover";
import { externalUrls } from "@/constants/urls/externalUrls";
import { getFixtureDataFPLServer } from "@/lib/api/fixturePlanner/getFixturePlannerData";
import { getKickoffTimesFPL } from "@/lib/api/kickoffTimes/getKickOffTimes";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { FixturePlanningTypes } from "@/types/fixturePlanningType";
import { LeaguePath, LeagueTypeByPath } from "@/types/league";
import { getTranslations } from "next-intl/server";

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

    // MÅ HÅNDTERE start og end gw midt i sesongen
    const defaultForm: FDRFormInput = {
        startGw: Number(startGw ?? 1),
        endGw: Number(endGw ?? 38),
        minNumFixtures: Number(minNumFixtures ?? 3),
        fdrType: fdrType ?? '',
        fixturePlanningType: FixturePlanningTypes.PLANNER
    };

    const [fixtureData, kickOffTimes] = await Promise.all([
        getFixtureDataFPLServer(defaultForm),
        getKickoffTimesFPL(),
    ]);

    return (
        <DefaultPageContainer 
        pageClassName='fixture-planner-container'
        leagueType={leagueType}
        heading={t('Title')} 
        description={t('Description')}
        >
            <h1>
                {t('Title')}
                <Popover 
                    popoverTitle={t('Title')} 
                    iconSize={14}
                    iconPosition={[-10, 0, 0, 3]}
                    alignLeft
                >
                    { t("FixtureAreFrom")}
                        <a href={externalUrls.official.fpl}>Fantasy Premier League.</a>
                        <FdrBox 
                            fdrValues={t("FdrValues")}
                            FdrDescription={t("FdrDescription")}
                        />
                </Popover>
            </h1>
            <FixturePlannerPage 
                fixturePlanningType={FixturePlanningTypes.PLANNER}
                fixtureData={fixtureData.fdrData}
                kickOffTimes={kickOffTimes}
                defaultForm={defaultForm}
            />
        </DefaultPageContainer>
    );
}