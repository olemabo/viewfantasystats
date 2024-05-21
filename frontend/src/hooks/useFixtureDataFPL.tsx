import { useState, useEffect } from 'react';
import axios from 'axios';
import { FDRData, FDR_GW_i, SimpleTeamFDRDataModel } from '../models/fixturePlanning/TeamFDRData';
import { KickOffTimesModel } from '../models/fixturePlanning/KickOffTimes';
import { FixturePlanningType, fdrRotation } from '../models/shared/PageProps';
import { RotationPlannerTeamInfoModel } from '../models/fixturePlanning/RotationPlannerTeamInfo';
import { RotationPlannerTeamModel } from '../models/fixturePlanning/RotationPlannerTeam';
import { FDRFormInput } from '../models/fixturePlanning/FDRFormInput';

const useFixtureDataFPL = (
    searchQuery: string,
    setFormInput: React.Dispatch<React.SetStateAction<FDRFormInput>>,
    fixturePlanningType: FixturePlanningType,
) => {
    const fixturePlannerApiPath = "/fixture-planner/get-all-fdr-data/";
    
    const [fdrRotationData, setFdrRotationData] = useState<RotationPlannerTeamModel[]>([]);
    const [fdrData, setFdrData] = useState<SimpleTeamFDRDataModel[]>([]); 
    const [kickOffTimes, setKickOffTimes] = useState<KickOffTimesModel[]>([]);

    const [errorLoading, setErrorLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {      
                const response = await axios.get(`${fixturePlannerApiPath}?${searchQuery}`);
                const data = JSON.parse(response.data);
                
                setFormInput((prevFormInput) => ({
                    ...prevFormInput,
                    startGw: data.gw_start,
                    endGw: data.gw_end,
                }));

                const updatedKickOffTimes = data?.gws_and_dates?.map((kickoff: string) => JSON.parse(kickoff)) || [];
                setKickOffTimes(updatedKickOffTimes);

                if (fixturePlanningType === fdrRotation) {
                    const RotationPlannerTeamInfoList: RotationPlannerTeamInfoModel[] = [];
                    data?.fdr_data.forEach((team: any) => {
                        const team_i_json = JSON.parse(team);
                        const temp: RotationPlannerTeamInfoModel = { 
                            avg_Score: team_i_json.avg_Score, 
                            id_list: team_i_json.id_list, 
                            team_name_list: team_i_json.team_name_list, 
                            extra_fixtures: team_i_json.extra_fixtures, 
                            home_games: team_i_json.home_games,
                            fixture_list: team_i_json.fixture_list
                        };

                        RotationPlannerTeamInfoList.push(temp);
                    });

                    setFdrRotationData(RotationPlannerTeamInfoList);
                } else {
                    const apiFDRList: SimpleTeamFDRDataModel[] = [];
                    data?.fdr_data.forEach((team: any[]) => {
                        const team_name = JSON.parse(team[0][0][0]).team_name;
        
                        const FDR_gw_i: FDR_GW_i[] = [];
                        var fdr_total_score = 0;
                        team.forEach((fdr_for_each_gw: any[]) => {
                            const temp: FDRData[] = [];
                            fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                                const fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                                fdr_total_score = fdr_in_gw_i_json.FDR_score;
                                temp.push({
                                    opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                                    difficulty_score: fdr_in_gw_i_json.difficulty_score,
                                    H_A: fdr_in_gw_i_json.H_A,
                                    double_blank: fdr_in_gw_i_json.double_blank,
                                    Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use})
                            });
                            FDR_gw_i.push({fdr_gw_i: temp})
                        });
                        
                        const tempTeamData = { team_name: team_name, FDR: FDR_gw_i, checked: true, fdr_total_score: fdr_total_score}
                        apiFDRList.push(tempTeamData);
                    });

                    setFdrData(apiFDRList);
                }

                setErrorLoading(false);
            } catch (error) {
                setErrorLoading(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchQuery]);

    return { isLoadingFixturedata: isLoading, errorLoading, fdrData, kickOffTimes, fdrRotationData };
};

export default useFixtureDataFPL;
