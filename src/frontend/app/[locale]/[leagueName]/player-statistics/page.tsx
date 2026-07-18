import { Suspense } from "react";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import PlayerStatisticsPage from "@/components/pages/player-statistics/player-statistics";
import Popover from "@/components/shared/popover/popover";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import { getPlayerStatistics } from "@/lib/api/get-player-statistics";
import { getTeamData } from "@/lib/api/teamData/getTeamData";
import { LeagueType, mapPathToLeagueType } from "@/types/league";
import { getTranslations } from "next-intl/server";

interface SearchParamsProps {
  lastXGws?: string;
}

export default async function Page({
  params,
  searchParams,
}: PageProps<"/[locale]/[leagueName]/player-statistics">) {
  const { leagueName } = await params;
  const leagueType = mapPathToLeagueType(leagueName);
  const t = await getTranslations("Statistics.PlayerStatistics");

  return (
    <DefaultPageContainer
      pageClassName="player-ownership-container"
      heading={t("Title")}
    >
      <h1>
        {t("Title")}
        <Popover
          popoverTitle={t("Title")}
          iconSize={14}
          iconPosition={[-10, 0, 0, 3]}
          alignLeft
        >
          {/* {ownershipDescription} */}
        </Popover>
      </h1>

      <Suspense fallback={<Spinner />}>
        <PlayerStatisticsContent
          leagueType={leagueType}
          searchParams={searchParams}
        />
      </Suspense>
    </DefaultPageContainer>
  );
}

async function PlayerStatisticsContent({
  leagueType,
  searchParams,
}: {
  leagueType: LeagueType;
  searchParams: Promise<SearchParamsProps>;
}) {
  const { lastXGws } = await searchParams;
  const currentLastXGws = lastXGws ? Number(lastXGws) || 0 : 0;

  const [playerStats, teamData] = await Promise.all([
    getPlayerStatistics({
      leagueType,
      lastXGws: currentLastXGws,
    }),
    getTeamData(leagueType),
  ]);

  return (
    <PlayerStatisticsPage
      leagueType={leagueType}
      categories={playerStats.categories}
      playerStatistics={playerStats.playerStatistics}
      totalNumberOfGws={playerStats.totalNumberOfGws}
      lastXGws={currentLastXGws}
      teamNameAndIds={teamData}
    />
  );
}
