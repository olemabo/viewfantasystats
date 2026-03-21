"use server"

import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import PlayerOwnership from "@/components/pages/player-ownership/player-ownership";
import { PriceChange } from "@/components/pages/price-change/price-change";
import Popover from "@/components/shared/popover/popover";
import { TOP_X_MANAGERS_DEFAULT } from "@/constants/constants";
import { getPriceChange } from "@/lib/api/get-price-change";
import { getTeamData } from "@/lib/api/teamData/getTeamData";
import { LeaguePath, LeagueTypeByPath, LeagueTypes } from "@/types/league";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{leagueName: LeaguePath}>;
  searchParams: Promise<{ gw?: string }>;
}) {
    const { leagueName } = await params;
    const { gw } = await searchParams;

    const currentGw = gw ? parseInt(gw) : -1;
    const leagueType = LeagueTypeByPath[leagueName];

    const t = await getTranslations('Statistics.PriceChange');

    const description =
        leagueType === LeagueTypes.FPL
        ? t("PriceChangeDescription")
        : t("PriceChangeDescription");    
        
    const { priceChange, gwList } = await getPriceChange(leagueType,  currentGw);
    const teamData = await getTeamData(leagueType);

    const latestGw = Math.max(...gwList) + 1;
    const isLatestGw = currentGw === -1 || currentGw === latestGw;

    return (
        <DefaultPageContainer 
        pageClassName='player-ownership-container'
        style={isLatestGw ? undefined : {maxWidth: 615}}
        leagueType={leagueType}
        heading={t('Title')} 
        description={t('Description')}
        >
        <h1>
            {t('Title')}
            <Popover 
                popoverTitle={t('Title')} 
                iconSize={14}
                iconPosition={[-10, 0, 0, 3]}
                alignLeft
            >
                {description}
            </Popover>
        </h1>
        <PriceChange
            leagueType={leagueType}
            priceChangeData={priceChange}
            gwList={gwList}
            teamData={teamData}
            currentGw={currentGw}
        />
        </DefaultPageContainer>
  );
}