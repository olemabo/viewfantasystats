import { Suspense } from "react";
import {
  getFixtureData,
  getKickoffTimes,
  getTeamData,
} from "@/components/features/fixtures/utils/api";
import FixturePlannerHeader from "@/components/features/fixtures/utils/header-and-popover";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import RotationPlannerPage from "@/components/pages/rotation-planner/rotation-planner";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import { maxGwEsf, maxGwFpl } from "@/constants/gws";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { esf, LeagueType } from "@/models/shared/LeagueType";
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
    teamsToCheck?: string;
    teamsToPlay?: string;
    teamsInSolution?: string[];
    fplTeams?: string[];
  }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { leagueName } = await params;
  const t = await getTranslations();
  const leagueType = LeagueTypeByPath[leagueName];

  return (
    <DefaultPageContainer
      pageClassName="fixture-planner-container"
      heading={t("Fixture.RotationPlanner.Title")}
    >
      <FixturePlannerHeader
        fixturePlanningType={FixturePlanningTypes.ROTATION}
        leagueType={leagueType}
      />

      <Suspense fallback={<Spinner />}>
        <RotationPlannerContent
          leagueType={leagueType}
          searchParams={searchParams}
        />
      </Suspense>
    </DefaultPageContainer>
  );
}

async function RotationPlannerContent({
  leagueType,
  searchParams,
}: {
  leagueType: LeagueType;
  searchParams: PageProps["searchParams"];
}) {
  const {
    startGw,
    endGw,
    minNumFixtures,
    teamsToCheck,
    teamsToPlay,
    fplTeams,
    teamsInSolution,
  } = await searchParams;

  const maxGw = leagueType === esf ? maxGwEsf : maxGwFpl;

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
    maxGw,
  };

  const [fixtureData, kickOffTimes, teamData] = await Promise.all([
    getFixtureData(defaultForm, leagueType),
    getKickoffTimes(leagueType),
    getTeamData(leagueType),
  ]);

  defaultForm.startGw = fixtureData.startGw;
  defaultForm.endGw = fixtureData.endGw;

  return (
    <RotationPlannerPage
      fixtureData={fixtureData.fdrRotationData}
      defaultTeamData={teamData}
      kickOffTimes={kickOffTimes}
      defaultForm={defaultForm}
    />
  );
}
