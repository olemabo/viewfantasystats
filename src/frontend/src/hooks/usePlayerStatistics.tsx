import { useState, useEffect } from 'react';
import axios from 'axios';
import { TeamNameAndIdModel } from '../models/playerOwnership/TeamNameAndIdModel';
import { PlayerStatisticsModel } from '../models/playerStatistics/PlayerStatisticsModel';
import { ErrorLoading, emptyErrorLoadingState } from '../models/shared/errorLoading';
import { warning } from '../components/Shared/Messages/Messages';
import { PageProps } from '../models/shared/PageProps';

interface PlayerStats {
    categories: string[];
    teamNameAndIds: TeamNameAndIdModel[];
    playerStatistics: PlayerStatisticsModel[];
    totalNumberOfGws: number;
}

const usePlayerStatistics = (pageProps: PageProps, lastXGws: number) => {
    const playeyStatisticsApiPath = "/statistics/player-statistics-api/";
    
    const [playerStats, setPlayerStats] = useState<PlayerStats>({
        categories: [],
        teamNameAndIds: [],
        playerStatistics: [],
        totalNumberOfGws: 0
    });

    const [errorLoading, setErrorLoading] = useState<ErrorLoading>(emptyErrorLoadingState);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {      
                const response = await axios.get(playeyStatisticsApiPath, {
                    params: { 
                        league_name: pageProps.leagueType, 
                        last_x_gw: lastXGws.toString()  
                    }
                });

                const data = JSON.parse(response?.data);

                setPlayerStats({
                    categories: data?.categories,
                    teamNameAndIds: updateTeamNameAndIds(data.team_names_and_ids),
                    playerStatistics: data?.player_info,
                    totalNumberOfGws: data.total_number_of_gws
                });

                setIsLoading(false);
                setErrorLoading(emptyErrorLoadingState);
            } catch (error) {
                setErrorLoading({
                    errorMessage: pageProps.languageContent.General.errorMessage || 'An error occurred',
                    messageType: warning,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [pageProps.leagueType, lastXGws]);

    function updateTeamNameAndIds(data: any[]): TeamNameAndIdModel[] {
        return data.map((team: any) => {
            const parsed = JSON.parse(team);
            return {
                team_name: parsed.team_name,
                team_id: parsed.id
            };
        });
    }

    return { isLoading, errorLoading, playerStats };
};

export default usePlayerStatistics;
