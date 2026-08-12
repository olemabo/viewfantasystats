import DefaultPageContainer from "../../../../components/layout/default-page-container/default-page-container";
import PlayerOwnership from "../../../../components/pages/player-ownership/player-ownership";
import Popover from "../../../../components/shared/popover/popover";
import { TOP_X_MANAGERS_DEFAULT } from "../../../../constants/constants";
import { getTeamData } from "../../../../lib/api/teamData/getTeamData";
import {
  LeaguePath,
  LeagueTypeByPath,
  LeagueTypes,
} from "../../../../types/league";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ leagueName: LeaguePath }>;
}) {
  "use cache";
  const { leagueName } = await params;
  const leagueType = LeagueTypeByPath[leagueName];
  const t = await getTranslations("Statistics.PlayerOwnership");

  const teamData = await getTeamData(leagueType);

  const ownershipDescription =
    leagueType === LeagueTypes.FPL
      ? t("OwnershiptDescriptionFPL")
      : t("OwnershiptDescription");

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
          {ownershipDescription}
        </Popover>
      </h1>
      <PlayerOwnership
        leagueType={leagueType}
        teamData={teamData}
        topXManagersDefault={TOP_X_MANAGERS_DEFAULT[leagueType]}
      />
    </DefaultPageContainer>
  );
}
