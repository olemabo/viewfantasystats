import { RankModel } from '../models/RankStatistics/RankStatistics';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface RankStatisticsData {
    ranks: RankModel[];
    fantasyManagerUrl: string;
    numberOfLastYears: number;
    isLoading: boolean;
    errorLoading: boolean;
}

const useRankStatistics = (numberOfYearsBack: number): RankStatisticsData => {
    const player_ownership_api_path = "/statistics/rank-statistics-api/";

    const [ranks, setRanks] = useState<RankModel[]>([]);
    const [fantasyManagerUrl, setFantasyManagerUrl] = useState("");
    const [numberOfLastYears, setNumberOfLastYears] = useState(0);
    
    const [errorLoading, setErrorLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                var body = {
                    last_x_years: numberOfYearsBack,
                };

                const response = await axios.post(player_ownership_api_path, body);
                let json_data = JSON.parse(response.data);
                setFantasyManagerUrl(json_data.fantasy_manager_url)
                const temp: RankModel[] = [];
                json_data.list_of_ranks.map( (ins: any) => {
                    let d = JSON.parse(ins);
                    temp.push({
                        user_id: d.user_id,
                        name: d.name,
                        team_name: d.team_name,
                        avg_rank: d.avg_rank,
                        avg_points: d.avg_points,
                        avg_rank_ranking: d.avg_rank_ranking,
                        avg_points_ranking: d.avg_points_ranking,
                    })
                })
                setNumberOfLastYears(json_data.number_of_last_years);
                setRanks(temp);
                setIsLoading(false);
                setErrorLoading(false);
            } catch (error) {
                setErrorLoading(true);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [numberOfYearsBack]);

    return { ranks, fantasyManagerUrl, numberOfLastYears, isLoading, errorLoading };
};

export default useRankStatistics;
