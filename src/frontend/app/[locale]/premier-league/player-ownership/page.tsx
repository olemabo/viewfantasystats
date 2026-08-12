import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
import PlayerOwnership from "@/components/pages/player-ownership/player-ownership";
import { TOP_X_MANAGERS_DEFAULT } from "@/constants/constants";
import { getTeamData } from "@/lib/api/teamData/getTeamData";
import { LeagueTypes } from "@/types/league";
import Title from "./title";

export default async function Page() {
  const teamData = await getTeamData(LeagueTypes.FPL);

  return (
    <DefaultPageContainer pageClassName="player-ownership-container">
      <Title />
      <PlayerOwnership
        leagueType={LeagueTypes.FPL}
        teamData={teamData}
        topXManagersDefault={TOP_X_MANAGERS_DEFAULT[LeagueTypes.FPL]}
      />
    </DefaultPageContainer>
  );
}
