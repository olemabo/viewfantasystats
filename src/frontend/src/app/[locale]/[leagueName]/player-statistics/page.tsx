"use server"

import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import PlayerOwnership from "@/components/pages/player-ownership/player-ownership";
import PlayerStatisticsPage from "@/components/pages/player-statistics/player-statistics";
import Popover from "@/components/shared/popover/popover";
import { TOP_X_MANAGERS_DEFAULT } from "@/constants/constants";
import { getPlayerStatistics } from "@/lib/api/get-player-statistics";
import { getTeamData } from "@/lib/api/teamData/getTeamData";
import { LeaguePath, LeagueTypeByPath, LeagueTypes } from "@/types/league";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ leagueName: LeaguePath }>;
  searchParams: Promise<{
    lastXGws?: string;
  }>;
}

export default async function Page({
  params,
  searchParams
}: PageProps) {
    const {leagueName} = await params;
    const {lastXGws} = await searchParams;
    const leagueType = LeagueTypeByPath[leagueName];
    const t = await getTranslations('Statistics.PlayerStatistics');

    const currentLastXGws = lastXGws ? Number(lastXGws) || 0 : 0;

    const playerStats = await getPlayerStatistics({
        leagueType,
        lastXGws: currentLastXGws,
    });

    const teamData = await getTeamData(leagueType);

    return (
        <DefaultPageContainer 
            pageClassName='player-ownership-container'
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
                {/* {ownershipDescription} */}
            </Popover>
        </h1>
        <PlayerStatisticsPage
            leagueType={leagueType}
            categories={playerStats.categories}
            playerStatistics={playerStats.playerStatistics}
            totalNumberOfGws={playerStats.totalNumberOfGws}
            lastXGws={currentLastXGws}
            teamNameAndIds={teamData}
        />
        </DefaultPageContainer>
  );
}