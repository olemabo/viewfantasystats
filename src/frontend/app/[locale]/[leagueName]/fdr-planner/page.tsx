import { Suspense } from "react";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import FixturePlannerPage from "@/components/features/fixtures/fixture-planner/fixture-planner";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import { FDRFormInput } from "@/models/fixturePlanning/FDRFormInput";
import { FixturePlanningTypes } from "@/types/fixturePlanningType";
import { mapPathToLeagueType } from "@/types/league";
import { getTranslations } from "next-intl/server";
import { esf, LeagueType } from "@/models/shared/LeagueType";
import { maxGwEsf, maxGwFpl } from "@/constants/gws";
import FixturePlannerHeader from "@/components/features/fixtures/utils/header-and-popover";
import {
  getFixtureData,
  getKickoffTimes,
} from "@/components/features/fixtures/utils/api";

type FdrSearchParams = {
  startGw?: string;
  endGw?: string;
  minNumFixtures?: string;
  fdrType?: string;
};

export default async function Page({
  params,
  searchParams,
}: PageProps<"/[locale]/[leagueName]/fdr-planner">) {
  const { leagueName } = await params;
  const t = await getTranslations("Fixture.FixturePlanner");
  const leagueType = mapPathToLeagueType(leagueName);

  return (
    <DefaultPageContainer
      pageClassName="fixture-planner-container"
      heading={t("Title")}
    >
      <FixturePlannerHeader
        fixturePlanningType={FixturePlanningTypes.PLANNER}
        leagueType={leagueType}
      />

      <Suspense fallback={<Spinner />}>
        <FixturePlannerContent
          leagueType={leagueType}
          searchParams={searchParams}
        />
      </Suspense>
    </DefaultPageContainer>
  );
}

async function FixturePlannerContent({
  leagueType,
  searchParams,
}: {
  leagueType: LeagueType;
  searchParams: Promise<FdrSearchParams>;
}) {
  const { startGw, endGw, minNumFixtures, fdrType } = await searchParams;

  const maxGw = leagueType === esf ? maxGwEsf : maxGwFpl;

  const defaultForm: FDRFormInput = {
    startGw: Number(startGw ?? -1),
    endGw: Number(endGw ?? 38),
    minNumFixtures: Number(minNumFixtures ?? 3),
    fdrType: fdrType ?? "",
    fixturePlanningType: FixturePlanningTypes.PLANNER,
    maxGw,
  };

  const [fixtureData, kickOffTimes] = await Promise.all([
    getFixtureData(defaultForm, leagueType),
    getKickoffTimes(leagueType),
  ]);

  defaultForm.startGw = fixtureData.startGw;
  defaultForm.endGw = fixtureData.endGw;

  return (
    <FixturePlannerPage
      fixturePlanningType={FixturePlanningTypes.PLANNER}
      fixtureData={fixtureData.fdrData}
      kickOffTimes={kickOffTimes}
      defaultForm={defaultForm}
    />
  );
}
