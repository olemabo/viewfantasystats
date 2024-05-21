import { useState, useEffect } from 'react';
import axios from 'axios';
import { LeagueType } from '../models/shared/LeagueType';
import { TeamNameAndIdModel } from '../models/playerOwnership/TeamNameAndIdModel';
import { PlayerStatisticsModel } from '../models/playerStatistics/PlayerStatisticsModel';

interface PlayerStats {
    categories: string[];
    teamNameAndIds: TeamNameAndIdModel[];
    playerStatistics: PlayerStatisticsModel[];
    totalNumberOfGws: number;
}

const usePlayerStatistics = (leagueType: LeagueType, lastXGws: number) => {
    const playeyStatisticsApiPath = "/statistics/player-statistics-api/";
    
    const [playerStats, setPlayerStats] = useState<PlayerStats>({
        categories: [],
        teamNameAndIds: [],
        playerStatistics: [],
        totalNumberOfGws: 0
    });

    const [errorLoading, setErrorLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {      
                const response = await axios.get(playeyStatisticsApiPath + "?league_name=" + leagueType + "&last_x_gw=" + lastXGws.toString());
                const data = JSON.parse(response?.data);

                setPlayerStats({
                    categories: data?.categories,
                    teamNameAndIds: UpdateTeamNameAndIds(data.team_names_and_ids),
                    playerStatistics: data?.player_info,
                    totalNumberOfGws: data.total_number_of_gws
                });

                setIsLoading(false);
                setErrorLoading(false);
            } catch (error) {
                setErrorLoading(true);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [leagueType, lastXGws]);

    function UpdateTeamNameAndIds(data: any) {
        let te: TeamNameAndIdModel[] = []
        data?.map((team: any) => {
            let parsed = JSON.parse(team);
            te.push({
                team_name: parsed.team_name,
                team_id: parsed.id
            })
        })
        
        return te;
    }

    return { isLoading, errorLoading, playerStats };
};

export default usePlayerStatistics;
