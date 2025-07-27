import { useState, useEffect } from 'react';
import axios from 'axios';

type TeamCheckedModel = {
    team_name: string;
    checked: boolean;
    checked_must_be_in_solution: boolean;
};

const useFetchTeamData = () => {
    const [teamData, setTeamData] = useState<TeamCheckedModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const response = await axios.get('/fixture-planner/data-fdr-ui/');
                if (response?.data && response.data.length > 0) {
                    const teams = response.data.map((team_i: any) => ({
                        team_name: team_i.team_name,
                        checked: true,
                        checked_must_be_in_solution: false,
                    }));
                    setTeamData(teams);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch team data');
                setLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    return { teamData, setTeamData, loadingTeamData: loading, error };
};

export default useFetchTeamData;