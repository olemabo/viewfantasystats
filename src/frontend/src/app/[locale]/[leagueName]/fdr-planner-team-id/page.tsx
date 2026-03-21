"use server"

import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import { LeaguePath, LeagueTypeByPath } from "@/types/league";
import { getTranslations } from "next-intl/server";
import { getFixturePlannerData } from "./api";
import FixturePlannerTeamIdPage from "@/components/features/fixtures/fixture-planner-team-id/fixture-planner-team-id";
import Popover from "@/components/shared/popover/popover";
import { getKickoffTimes } from "@/components/features/fixtures/utils/api";

interface PageProps {
  params: Promise<{ leagueName: LeaguePath }>;
  searchParams: Promise<{
    team_id?: string;
  }>;
}

export default async function Page({
  params,
  searchParams
}: PageProps) {
    const {leagueName} = await params;
    const {team_id} = await searchParams;

    const leagueType = LeagueTypeByPath[leagueName];
    const t = await getTranslations('Fixture.TeamPlanner');
    
    const [fixtureData, kickOffTimes] = await Promise.all([
            getFixturePlannerData(leagueType),
            getKickoffTimes(leagueType),
    ]);

    if (!fixtureData || !kickOffTimes) {
        return null;
    }

    return (
        <div className='team-id-wrapper'>
            <div className='team-id-container'>
                <DefaultPageContainer 
                    pageClassName='fixture-planner-container'
                    heading={t("Title")}
                >
                    <h1>
                        {t("Title")}
                        <Popover 
                            id='rotations-planner-id'
                            title=''
                            alignLeft
                            popoverTitle={t("Title")} 
                            iconSize={14}
                            iconPosition={[-10, 0, 0, 3]}
                            popoverText={ "" }>
                            {/* <p>{ props.languageContent.Fixture.TeamPlanner.description_1}</p>
                            <p>{ props.languageContent.Fixture.TeamPlanner.description_2}</p>
                            <p>{ props.languageContent.Fixture.TeamPlanner.description_3}</p>
                            { props.languageContent.LongTexts.fixtureAreFrom }
                            <a href={external_urls.url_spreadsheets_dagfinn_thon}>{ props.languageContent.LongTexts.ExcelSheet }</a> { props.languageContent.LongTexts.to } Dagfinn Thon.
                            <FdrBox content={props.languageContent} leagueType={esf}/> */}
                        </Popover>
                    </h1>
                    <FixturePlannerTeamIdPage
                        leagueType={leagueType}
                        data={fixtureData}
                        teamIdFromSearch={team_id}
                        kickoffTimes={kickOffTimes}
                    />
                </DefaultPageContainer>
            </div>
        </div>
  );
}