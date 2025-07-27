import { RankModel } from '../models/RankStatistics/RankStatistics';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorLoading, emptyErrorLoadingState } from '../models/shared/errorLoading';
import { warning } from '../components/Shared/Messages/Messages';

const useRankStatistics = (numberOfYearsBack: number, languageContent: any) => {
    const playerOwnershipApiPath = "/statistics/rank-statistics-api/";

    const [ranks, setRanks] = useState<RankModel[]>([]);
    const [fantasyManagerUrl, setFantasyManagerUrl] = useState<string>("");
    const [numberOfLastYears, setNumberOfLastYears] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorLoading, setErrorLoading] = useState<ErrorLoading>(emptyErrorLoadingState);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(playerOwnershipApiPath, {
                    params: { last_x_years: numberOfYearsBack.toString() }
                });
                
                const data = JSON.parse(response.data);
                
                const rankModel: RankModel[] = [];
                data.list_of_ranks.map((rank: string) => {
                    const parsedData: RankModel = JSON.parse(rank);
                    rankModel.push({
                        user_id: parsedData.user_id,
                        name: parsedData.name,
                        team_name: parsedData.team_name,
                        avg_rank: parsedData.avg_rank,
                        avg_points: parsedData.avg_points,
                        avg_rank_ranking: parsedData.avg_rank_ranking,
                        avg_points_ranking: parsedData.avg_points_ranking,
                    });
                })
                
                setFantasyManagerUrl(data.fantasy_manager_url)
                setNumberOfLastYears(data.number_of_last_years);
                setRanks(rankModel);
                
                setIsLoading(false);
                setErrorLoading(emptyErrorLoadingState);
            } catch (error) {
                setErrorLoading({
                    errorMessage: languageContent.General.errorMessage || 'An error occurred',
                    messageType: warning,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [numberOfYearsBack]);

    return { ranks, fantasyManagerUrl, numberOfLastYears, isLoading, errorLoading };
};

export default useRankStatistics;
