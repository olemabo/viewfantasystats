import { Suspense } from "react";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import FixturePlannerPage from "@/components/features/fixtures/fixture-planner/fixture-planner";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { FixturePlanningTypes } from "@/types/fixturePlanningType";
import { LeagueType, LeagueTypes } from "@/types/league";
import { maxGwFpl } from "@/constants/gws";
import FixturePlannerHeader from "@/components/features/fixtures/utils/header-and-popover";
import {
  getFixtureData,
  getKickoffTimes,
} from "@/components/features/fixtures/utils/api";

type SearchParams = {
  startGw?: string;
  endGw?: string;
  minNumFixtures?: string;
  fdrType?: string;
};

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/premier-league/periode-planner">) {
  return (
    <DefaultPageContainer pageClassName="fixture-planner-container">
      <FixturePlannerHeader
        fixturePlanningType={FixturePlanningTypes.PERIODE}
        leagueType={LeagueTypes.FPL}
      />

      <Suspense fallback={<Spinner />}>
        <PeriodePlannerContent
          leagueType={LeagueTypes.FPL}
          searchParams={searchParams}
        />
      </Suspense>
    </DefaultPageContainer>
  );
}

async function PeriodePlannerContent({
  leagueType,
  searchParams,
}: {
  leagueType: LeagueType;
  searchParams: Promise<SearchParams>;
}) {
  const { startGw, endGw, minNumFixtures, fdrType } = await searchParams;

  const form: FDRFormInput = {
    startGw: Number(startGw ?? -1),
    endGw: Number(endGw ?? maxGwFpl),
    minNumFixtures: Number(minNumFixtures ?? 3),
    fdrType: fdrType ?? "",
    fixturePlanningType: FixturePlanningTypes.PERIODE,
    maxGw: maxGwFpl,
  };

  const [fixtureData, kickOffTimes] = await Promise.all([
    getFixtureData(form, leagueType),
    getKickoffTimes(leagueType),
  ]);

  const finalForm: FDRFormInput = {
    ...form,
    startGw: fixtureData.startGw,
    endGw: fixtureData.endGw,
    maxGw: fixtureData.maxGw,
  };

  return (
    <FixturePlannerPage
      fixturePlanningType={FixturePlanningTypes.PERIODE}
      fixtureData={fixtureData.fdrData}
      kickOffTimes={kickOffTimes}
      defaultForm={finalForm}
    />
  );
}
