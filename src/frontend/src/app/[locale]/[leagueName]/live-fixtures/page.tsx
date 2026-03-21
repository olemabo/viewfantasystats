"use server"

import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import { getLiveFixtureData } from "@/components/pages/live-fixtures/api";
import { LiveFixturePage } from "@/components/pages/live-fixtures/live-fixtures";
import PageHeaderWithPopover from "@/components/shared/page-header";
import { LeaguePath, LeagueTypeByPath, LeagueTypes } from "@/types/league";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ leagueName: LeaguePath }>;
  searchParams: Promise<{
    gw?: string;
  }>;
}

export default async function Page({
  params,
  searchParams
}: PageProps) {
  const {leagueName} = await params;
  const {gw} = await searchParams;

  const leagueType = LeagueTypeByPath[leagueName];
  const t = await getTranslations('Statistics.LiveFixtures');

  const currentGw = gw ? parseInt(gw) : 0;

  const description = leagueType === LeagueTypes.FPL ? t('SiteDescription.FPL') : t('SiteDescription.ESF');
  
  const data = await getLiveFixtureData({
    leagueType: leagueType,
    gameweek: currentGw,
  });

  return (
    <DefaultPageContainer 
        pageClassName='live-fixtures-container'
        heading={t('Title')} 
    >
      <PageHeaderWithPopover 
        title={t('Title')} 
        description={description} 
      />
      <LiveFixturePage
        leagueType={leagueType}
        data={data}
      />
    </DefaultPageContainer>
  );
}