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
import { maxGwFpl } from "@/constants/gws";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { LeagueType } from "@/models/shared/LeagueType";
import { FixturePlanningTypes } from "@/types/fixturePlanningType";
import { LeagueTypes } from "@/types/league";

type SearchParams = {
  startGw?: string;
  endGw?: string;
  minNumFixtures?: string;
  fdrType?: string;
  teamsToCheck?: string;
  teamsToPlay?: string;
  teamsInSolution?: string[];
  fplTeams?: string[];
};

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/premier-league/rotation-planner">) {
  return (
    <DefaultPageContainer pageClassName="fixture-planner-container">
      <FixturePlannerHeader
        fixturePlanningType={FixturePlanningTypes.ROTATION}
        leagueType={LeagueTypes.FPL}
      />

      <Suspense fallback={<Spinner />}>
        <RotationPlannerContent
          leagueType={LeagueTypes.FPL}
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
  searchParams: Promise<SearchParams>;
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

  const form: FDRFormInput = {
    startGw: Number(startGw ?? -1),
    endGw: Number(endGw ?? 38),
    minNumFixtures: Number(minNumFixtures ?? 3),
    teamsToCheck: Number(teamsToCheck ?? 2),
    teamsToPlay: Number(teamsToPlay ?? 1),
    fdrType: "",
    fixturePlanningType: FixturePlanningTypes.ROTATION,
    teamsInSolution: teamsInSolution ?? [],
    fplTeams: fplTeams ?? [],
    maxGw: maxGwFpl,
  };

  const [fixtureData, kickOffTimes, teamData] = await Promise.all([
    getFixtureData(form, leagueType),
    getKickoffTimes(leagueType),
    getTeamData(leagueType),
  ]);

  const finalForm = {
    ...form,
    startGw: fixtureData.startGw,
    endGw: fixtureData.endGw,
  };

  return (
    <RotationPlannerPage
      fixtureData={fixtureData.fdrRotationData}
      defaultTeamData={teamData}
      kickOffTimes={kickOffTimes}
      defaultForm={finalForm}
    />
  );
}
