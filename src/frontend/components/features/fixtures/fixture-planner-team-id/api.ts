import { useEffect, useState } from 'react';
import { getApiUrl } from '../../../../lib/api';
import { TeamNamePlayerName } from '../../../../models/fixturePlanning/TeamNamePlayerName';
import { LeagueType } from '../../../../types/league';
import { esf } from '../../../../models/shared/LeagueType';
import { URLS } from '../../../../constants/urls';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export function useFDRFromTeamId(teamId: number, currentGw: number, leagueType: LeagueType) {
  const [players, setPlayers] = useState<TeamNamePlayerName[][]>([[], [], [], []]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId || !currentGw) return;

    const fetchFDRData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fixturePlannerApiPath = leagueType === esf
            ? API_ENDPOINTS.ESF.FIXTURE_PLANNER.FANTASY_TEAM_FDR 
            : URLS.API.FDR.PREMIER_LEAGUE_FROM_TEAM_ID;

        const url = getApiUrl(fixturePlannerApiPath);

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
          body: JSON.stringify({ team_id: teamId, current_gw: currentGw }),
        });

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const json = await res.json();

        const hasPlayerData =
          json.goal_keepers?.length > 0 &&
          json.defenders?.length > 0 &&
          json.midtfielders?.length > 0 &&
          json.forwards?.length > 0;

        if (hasPlayerData) {
            setPlayers([
                convertToTeamNamePlayerName(json.goal_keepers),
                convertToTeamNamePlayerName(json.defenders),
                convertToTeamNamePlayerName(json.midtfielders),
                convertToTeamNamePlayerName(json.forwards),
            ]);
        } else {
          setPlayers([[], [], [], []]);
        }

      } catch (err: any) {
        console.error("Error fetching FDR data:", err);
        setError(err.message || "Unknown error");
        setPlayers([[], [], [], []]);
      } finally {
        setLoading(false);
      }
    };

    fetchFDRData();
  }, [teamId, currentGw]);

  return { players, loading, error };
}

const convertToTeamNamePlayerName = (data: string[]): TeamNamePlayerName[] => {
  return data.map((x: any) => {
    return {
      team_id: x.team_name_short,
      player_name: x.player_name,
    };
  });
};