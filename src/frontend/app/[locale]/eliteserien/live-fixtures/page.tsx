import { Suspense } from "react";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import { getLiveFixtureData } from "@/components/pages/live-fixtures/api";
import { LiveFixturePage } from "@/components/pages/live-fixtures/live-fixtures";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import PageHeaderWithPopover from "@/components/shared/page-header";
import {
  LeaguePath,
  LeagueType,
  LeagueTypeByPath,
  LeagueTypes,
} from "@/types/league";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ leagueName: LeaguePath }>;
  searchParams: Promise<{
    gw?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { leagueName } = await params;
  const leagueType = LeagueTypeByPath[leagueName];
  const t = await getTranslations("Statistics.LiveFixtures");

  const description =
    leagueType === LeagueTypes.FPL
      ? t("SiteDescription.FPL")
      : t("SiteDescription.ESF");

  return (
    <DefaultPageContainer pageClassName="live-fixtures-container">
      <PageHeaderWithPopover title={t("Title")} description={description} />

      <Suspense fallback={<Spinner />}>
        <LiveFixturesContent
          leagueType={leagueType}
          searchParams={searchParams}
        />
      </Suspense>
    </DefaultPageContainer>
  );
}

async function LiveFixturesContent({
  leagueType,
  searchParams,
}: {
  leagueType: LeagueType;
  searchParams: PageProps["searchParams"];
}) {
  const { gw } = await searchParams;
  const currentGw = gw ? parseInt(gw) : 0;

  const data = await getLiveFixtureData({
    leagueType,
    gameweek: currentGw,
  });

  return <LiveFixturePage leagueType={leagueType} data={data} />;
}
