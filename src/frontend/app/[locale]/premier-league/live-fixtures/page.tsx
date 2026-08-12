import { Suspense } from "react";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import { getLiveFixtureData } from "@/components/pages/live-fixtures/api";
import { LiveFixturePage } from "@/components/pages/live-fixtures/live-fixtures";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import PageHeaderWithPopover from "@/components/shared/page-header";
import { LeagueType, LeagueTypes } from "@/types/league";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  gw?: string;
};

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/premier-league/live-fixtures">) {
  const t = await getTranslations("Statistics.LiveFixtures");

  const description = t("SiteDescription.FPL");

  return (
    <DefaultPageContainer pageClassName="live-fixtures-container">
      <PageHeaderWithPopover title={t("Title")} description={description} />

      <Suspense fallback={<Spinner />}>
        <LiveFixturesContent
          leagueType={LeagueTypes.FPL}
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
  searchParams: Promise<SearchParams>;
}) {
  const { gw } = await searchParams;
  const currentGw = gw ? parseInt(gw) : 0;

  const data = await getLiveFixtureData({
    leagueType,
    gameweek: currentGw,
  });

  return <LiveFixturePage leagueType={leagueType} data={data} />;
}
