import { Suspense } from "react";
import FixturePlannerHeader from "@/components/features/fixtures/utils/header-and-popover";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import RotationPlannerPage from "@/components/pages/rotation-planner/rotation-planner";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import { maxGwEsf } from "@/constants/gws";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { FixturePlanningTypes } from "@/types/fixturePlanningType";
import { LeagueTypes } from "@/types/league";
import { getKickoffTimesESF } from "@/lib/api/kickoff-times/kickoff-times";
import { getFixturePlannerESF } from "@/lib/api/fixture-planner/esf-fixture-planner";
import { getTeamDataESF } from "@/lib/api/fixture-planner/team-info";

type SearchParams = {
  startGw?: string;
  endGw?: string;
  minNumFixtures?: string;
  fdrType?: string;
  teamsToCheck?: string;
  teamsToPlay?: string;
  teamsInSolution?: number[];
  fplTeams?: number[];
};

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/eliteserien/rotation-planner">) {
  return (
    <DefaultPageContainer pageClassName="fixture-planner-container">
      <FixturePlannerHeader
        fixturePlanningType={FixturePlanningTypes.ROTATION}
        leagueType={LeagueTypes.ESF}
      />

      <Suspense fallback={<Spinner />}>
        <RotationPlannerContent searchParams={searchParams} />
      </Suspense>
    </DefaultPageContainer>
  );
}

async function RotationPlannerContent({
  searchParams,
}: {
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
    fplTeams: fplTeams ?? [], // TODO: format her på lag er rart tydeligvis
    maxGw: maxGwEsf,
  };

  const [fixtureData, kickOffTimes, teamData] = await Promise.all([
    getFixturePlannerESF(form),
    getKickoffTimesESF(),
    getTeamDataESF(),
  ]);

  const finalForm = {
    ...form,
    startGw: fixtureData.startGw,
    endGw: fixtureData.endGw,
    maxGw: fixtureData.maxGw,
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
