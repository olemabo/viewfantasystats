import { Suspense } from "react";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import { LeaguePath, LeagueType, LeagueTypeByPath } from "@/types/league";
import { getTranslations } from "next-intl/server";
import { getFixturePlannerData } from "./api";
import FixturePlannerTeamIdPage from "@/components/features/fixtures/fixture-planner-team-id/fixture-planner-team-id";
import Popover from "@/components/shared/popover/popover";
import { getKickoffTimes } from "@/components/features/fixtures/utils/api";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";

interface PageProps {
  params: Promise<{ leagueName: LeaguePath }>;
  searchParams: Promise<{ team_id?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { leagueName } = await params;
  const leagueType = LeagueTypeByPath[leagueName];
  const t = await getTranslations("Fixture.TeamPlanner");

  return (
    <div className="team-id-wrapper">
      <div className="team-id-container">
        <DefaultPageContainer
          pageClassName="fixture-planner-container"
          heading={t("Title")}
        >
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
              leagueType={leagueType}
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
  searchParams: PageProps["searchParams"];
}) {
  const { team_id } = await searchParams;

  const [fixtureData, kickOffTimes] = await Promise.all([
    getFixturePlannerData(leagueType),
    getKickoffTimes(leagueType),
  ]);

  if (!fixtureData || !kickOffTimes) {
    return null;
  }

  return (
    <FixturePlannerTeamIdPage
      leagueType={leagueType}
      data={fixtureData}
      teamIdFromSearch={team_id}
      kickoffTimes={kickOffTimes}
    />
  );
}
