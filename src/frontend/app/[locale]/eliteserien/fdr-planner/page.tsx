import { Suspense } from "react";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import FixturePlannerPage from "@/components/features/fixtures/fixture-planner/fixture-planner";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { FixturePlanningTypes } from "@/types/fixturePlanningType";
import { LeagueTypes } from "@/types/league";
import { maxGwEsf } from "@/constants/gws";
import FixturePlannerHeader from "@/components/features/fixtures/utils/header-and-popover";
import { getKickoffTimesESF } from "@/lib/api/kickoff-times/kickoff-times";
import { getFixturePlannerESF } from "@/lib/api/fixture-planner/esf-fixture-planner";

type FdrSearchParams = {
  startGw?: string;
  endGw?: string;
  minNumFixtures?: string;
  fdrType?: string;
};

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/eliteserien/fdr-planner">) {
  return (
    <DefaultPageContainer pageClassName="fixture-planner-container">
      <FixturePlannerHeader
        fixturePlanningType={FixturePlanningTypes.PLANNER}
        leagueType={LeagueTypes.ESF}
      />

      <Suspense fallback={<Spinner />}>
        <FixturePlannerContent searchParams={searchParams} />
      </Suspense>
    </DefaultPageContainer>
  );
}

async function FixturePlannerContent({
  searchParams,
}: {
  searchParams: Promise<FdrSearchParams>;
}) {
  const { startGw, endGw, minNumFixtures, fdrType } = await searchParams;

  const form: FDRFormInput = {
    startGw: Number(startGw ?? -1),
    endGw: Number(endGw ?? 38),
    minNumFixtures: Number(minNumFixtures ?? 3),
    fdrType: fdrType ?? "",
    fixturePlanningType: FixturePlanningTypes.PLANNER,
    maxGw: maxGwEsf,
  };

  const [fixtureData, kickOffTimes] = await Promise.all([
    getFixturePlannerESF(form),
    getKickoffTimesESF(),
  ]);

  const finalForm = {
    ...form,
    startGw: fixtureData.startGw,
    endGw: fixtureData.endGw,
    maxGw: fixtureData.maxGw,
  };

  return (
    <FixturePlannerPage
      fixturePlanningType={FixturePlanningTypes.PLANNER}
      fixtureData={fixtureData.fdrData}
      kickOffTimes={kickOffTimes}
      defaultForm={finalForm}
    />
  );
}
