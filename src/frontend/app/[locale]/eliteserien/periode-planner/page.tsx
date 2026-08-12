import { Suspense } from "react";
import { getFixturePlannerESF } from "@/lib/api/fixture-planner/esf-fixture-planner";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import FixturePlannerPage from "@/components/features/fixtures/fixture-planner/fixture-planner";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { FixturePlanningTypes } from "@/types/fixturePlanningType";
import { LeagueTypes } from "@/types/league";
import { maxGwEsf } from "@/constants/gws";
import FixturePlannerHeader from "@/components/features/fixtures/utils/header-and-popover";
import { getKickoffTimesESF } from "@/lib/api/kickoff-times/kickoff-times";

type SearchParams = {
  startGw?: string;
  endGw?: string;
  minNumFixtures?: string;
  fdrType?: string;
};

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/eliteserien/periode-planner">) {
  return (
    <DefaultPageContainer pageClassName="fixture-planner-container">
      <FixturePlannerHeader
        fixturePlanningType={FixturePlanningTypes.PERIODE}
        leagueType={LeagueTypes.ESF}
      />

      <Suspense fallback={<Spinner />}>
        <PeriodePlannerContent searchParams={searchParams} />
      </Suspense>
    </DefaultPageContainer>
  );
}

async function PeriodePlannerContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { startGw, endGw, minNumFixtures, fdrType } = await searchParams;

  const form: FDRFormInput = {
    startGw: Number(startGw ?? -1),
    endGw: Number(endGw ?? maxGwEsf),
    minNumFixtures: Number(minNumFixtures ?? 3),
    fdrType: fdrType ?? "",
    fixturePlanningType: FixturePlanningTypes.PERIODE,
    maxGw: maxGwEsf,
  };

  const [fixtureData, kickOffTimes] = await Promise.all([
    getFixturePlannerESF(form),
    getKickoffTimesESF(),
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
