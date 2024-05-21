import { useState, useEffect } from 'react';
import axios from 'axios';
import { FixturePlanningType, fdrRotation } from '../models/shared/PageProps';
import { FDRData, FDR_GW_i, TeamFDRDataModel } from '../models/fixturePlanning/TeamFDRData';
import { KickOffTimesModel } from '../models/fixturePlanning/KickOffTimes';
import { RotationPlannerTeamModel } from '../models/fixturePlanning/RotationPlannerTeam';
import { TeamCheckedModel } from '../models/fixturePlanning/TeamChecked';
import { FDRFormInput } from '../models/fixturePlanning/FDRFormInput';

const useFixtureDataESF = (
    searchQuery: string, 
    setFormInput: React.Dispatch<React.SetStateAction<FDRFormInput>>,
    fixturePlanningType: FixturePlanningType,
    setTeamData?: React.Dispatch<React.SetStateAction<TeamCheckedModel[]>>,
) => {
    const fixturePlannerApiPath = '/fixture-planner-eliteserien/get-all-eliteserien-fdr-data/';

    const [fdrData, setFdrData] = useState<TeamFDRDataModel[]>([]);
    const [fdrRotationData, setFdrRotationData] = useState<RotationPlannerTeamModel[]>([]);
    const [kickOffTimes, setKickOffTimes] = useState<KickOffTimesModel[]>([]);
    const [maxGw, setMaxGw ] = useState(-1);
    const [teamData, setTeamDataLocal] = useState<TeamCheckedModel[]>([]);

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

                if (maxGw < 0) { 
                    setMaxGw(data.max_gw);
                }
                
                const updatedKickOffTimes = data?.gws_and_dates?.map((kickoff: string) => JSON.parse(kickoff)) || [];
                setKickOffTimes(updatedKickOffTimes);
                
                if (fixturePlanningType === fdrRotation) {
                    const RotationPlannerTeamInfoList: RotationPlannerTeamModel[] = [];
                    data.fdr_data.forEach((team: any) => {
                
                        const team_i_json = JSON.parse(team);
                        const temp: RotationPlannerTeamModel = { 
                            avg_Score: team_i_json.avg_Score, 
                            id_list: team_i_json.id_list, 
                            team_name_list: team_i_json.team_name_list, 
                            extra_fixtures: team_i_json.extra_fixtures, 
                            home_games: team_i_json.home_games,
                            fixture_list: team_i_json.fixture_list
                        };

                        RotationPlannerTeamInfoList.push(temp);
                    });

                    var emptyTeamData: TeamCheckedModel[] = teamData;
                    if (data?.team_name_color?.length > 0 && emptyTeamData.length < 1) {
                        data?.team_name_color.forEach( (x: string[]) => {
                            emptyTeamData.push({ team_name: x[0], checked: true, checked_must_be_in_solution: false })
                        });
                        setTeamDataLocal(emptyTeamData);
                        if (setTeamData) {
                            setTeamData(emptyTeamData);
                        }
                    };

                    setFdrRotationData(RotationPlannerTeamInfoList)
                }
                else {
                    const updatedFdrData = data?.fdr_data?.map((team: any[]) => {
                        const team_name = JSON.parse(team[0][0][0]).team_name;
                        var fdr_total_score = 0;
                        const FDR_gw_i: FDR_GW_i[] = [];
    
                        team.forEach(fdr_for_each_gw => {
                            const temp: FDRData[] = fdr_for_each_gw.map((fdr_in_gw_i: any) => {
                                const fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                                fdr_total_score = fdr_in_gw_i_json.FDR_score;
                                return {
                                    opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                                    difficulty_score: fdr_in_gw_i_json.difficulty_score,
                                    H_A: fdr_in_gw_i_json.H_A,
                                    Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use,
                                    message: fdr_in_gw_i_json.message,
                                };
                            });
                            FDR_gw_i.push({ fdr_gw_i: temp });
                        });
    
                        var font_color = "black";
                        var background_color = "white";
    
                        if (data?.team_name_color?.length > 0) {
                            data.team_name_color.forEach((team: any[]) => {
                                if (team_name === team[0]) {
                                    font_color = team[2];
                                    background_color = team[1];
                                }
                            });
                        }
    
                        return { 
                            team_name, 
                            FDR: FDR_gw_i, 
                            checked: true, 
                            font_color, 
                            background_color, 
                            fdr_total_score 
                        };
                    }) || [];
                    
                    setFdrData(updatedFdrData);
                }

                setIsLoading(false);
                setErrorLoading(false);
            } catch (error) {
                setErrorLoading(true);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, fixturePlanningType]);

    return { isLoading, errorLoading, fdrData, kickOffTimes, maxGw, fdrRotationData };
};

export default useFixtureDataESF;
