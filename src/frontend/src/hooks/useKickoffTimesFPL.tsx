import { useState, useEffect } from 'react';
import axios from 'axios';
import { KickOffTimesModel } from '../models/fixturePlanning/KickOffTimes';

const useKickoffTimesFPL = () => {
    const kickoffTimesFPLApiPath = "/fixture-planner/get-kickoff-times/";

    const [kickOffTimes, setKickOffTimes] = useState<KickOffTimesModel[]>([]);
    const [errorLoading, setErrorLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {      
                const response = await axios.get(kickoffTimesFPLApiPath);
                if (response.data?.length > 0) {
                    const parsedKickOffTimes = response.data.map((kickoff: string) => JSON.parse(kickoff));
                    setKickOffTimes(parsedKickOffTimes);
                }
                setErrorLoading(false);
            } catch (error) {
                setErrorLoading(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { isLoading, errorLoading, kickOffTimes };
};

export default useKickoffTimesFPL;
