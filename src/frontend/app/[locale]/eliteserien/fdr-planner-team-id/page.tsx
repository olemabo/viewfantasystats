import { Suspense } from "react";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import { LeagueType, LeagueTypes } from "@/types/league";
import { getTranslations } from "next-intl/server";
import { getFixturePlannerData } from "./api";
import FixturePlannerTeamIdPage from "@/components/features/fixtures/fixture-planner-team-id/fixture-planner-team-id";
import Popover from "@/components/shared/popover/popover";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import { getKickoffTimesESF } from "@/lib/api/kickoff-times/kickoff-times";
import { getPlayersFromTeamIdESF } from "@/lib/api/fixture-planner/players-from-team-id";

type SearchParams = {
  team_id?: string;
};

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/eliteserien/fdr-planner-team-id">) {
  const t = await getTranslations("Fixture.TeamPlanner");

  return (
    <div className="team-id-wrapper">
      <div className="team-id-container">
        <DefaultPageContainer pageClassName="fixture-planner-container">
          <h1>
            {t("Title")}
            <Popover
              id="rotations-planner-id"
              title=""
              alignLeft
              popoverTitle={t("Title")}
              iconSize={14}
              iconPosition={[-10, 0, 0, 3]}
              popoverText={""}
            />
          </h1>

          <Suspense fallback={<Spinner />}>
            <TeamIdContent
              leagueType={LeagueTypes.ESF}
              searchParams={searchParams}
            />
          </Suspense>
        </DefaultPageContainer>
      </div>
    </div>
  );
}

async function TeamIdContent({
  leagueType,
  searchParams,
}: {
  leagueType: LeagueType;
  searchParams: Promise<SearchParams>;
}) {
  const { team_id } = await searchParams;

  const [fixtureData, kickoffTimes, initialPlayers] = await Promise.all([
    getFixturePlannerData(leagueType),
    getKickoffTimesESF(),
    team_id
      ? getPlayersFromTeamIdESF(Number(team_id))
      : Promise.resolve([[], [], [], []]),
  ]);

  if (!fixtureData || !kickoffTimes) {
    return null;
  }

  console.log(initialPlayers);

  return (
    <FixturePlannerTeamIdPage
      leagueType={leagueType}
      data={fixtureData}
      teamIdFromSearch={team_id}
      kickoffTimes={kickoffTimes}
      initialPlayers={initialPlayers}
    />
  );
}
