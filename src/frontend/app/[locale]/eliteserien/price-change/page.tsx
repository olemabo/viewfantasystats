import { Suspense } from "react";
import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import { PriceChange } from "@/components/pages/price-change/price-change";
import Popover from "@/components/shared/popover/popover";
import { Spinner } from "@/components/shared/ui/spinner/Spinner";
import { getPriceChange } from "@/lib/api/get-price-change";
import { getTeamData } from "@/lib/api/teamData/getTeamData";
import { LeagueType, LeagueTypes } from "@/types/league";
import { getTranslations } from "next-intl/server";

type SearchProps = {
  gw?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchProps;
}) {
  const t = await getTranslations("Statistics.PriceChange");
  const description = t("PriceChangeDescription");

  return (
    <DefaultPageContainer pageClassName="player-ownership-container">
      <h1>
        {t("Title")}
        <Popover
          popoverTitle={t("Title")}
          iconSize={14}
          iconPosition={[-10, 0, 0, 3]}
          alignLeft
        >
          {description}
        </Popover>
      </h1>

      <Suspense fallback={<Spinner />}>
        <PriceChangeContent
          leagueType={LeagueTypes.ESF}
          searchParams={searchParams}
        />
      </Suspense>
    </DefaultPageContainer>
  );
}

async function PriceChangeContent({
  leagueType,
  searchParams,
}: {
  leagueType: LeagueType;
  searchParams: SearchProps;
}) {
  const { gw } = await searchParams;
  const currentGw = gw ? parseInt(gw) : -1;

  const [{ priceChange, gwList }, teamData] = await Promise.all([
    getPriceChange(leagueType, currentGw),
    getTeamData(leagueType),
  ]);

  const latestGw = Math.max(...gwList) + 1;
  const isLatestGw = currentGw === -1 || currentGw === latestGw;

  return (
    <div style={isLatestGw ? undefined : { maxWidth: 615 }}>
      <PriceChange
        leagueType={leagueType}
        priceChangeData={priceChange}
        gwList={gwList}
        teamData={teamData}
        currentGw={currentGw}
      />
    </div>
  );
}
