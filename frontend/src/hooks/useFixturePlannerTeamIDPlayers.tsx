import { useState, useEffect } from 'react';
import axios from 'axios';
import { FDRData, FDR_GW_i, TeamIdFDRModel } from '../models/fixturePlanning/TeamFDRData';
import { KickOffTimesModel } from '../models/fixturePlanning/KickOffTimes';
import { PlayerModel } from '../models/fixturePlanning/PlayerModel';
import { PageProps, esf } from '../models/shared/PageProps';
import { url_get_fdr_data_from_team_id_eliteserien, url_get_fdr_data_from_team_id_premier_league } from '../static_urls/APIUrls';
import { ErrorLoading, emptyErrorLoadingState } from '../models/shared/errorLoading';
import { warning } from '../components/Shared/Messages/Messages';

const useFixturePlannerTeamIDMetaData = (
    pageProps: PageProps,
    setGwStart: React.Dispatch<React.SetStateAction<number>>,
    setGwEnd: React.Dispatch<React.SetStateAction<number>>,
) => {
    const fixturePlannerApiPath = pageProps.leagueType === esf
    ? url_get_fdr_data_from_team_id_eliteserien 
            : url_get_fdr_data_from_team_id_premier_league;

    const [ maxGw, setMaxGw ] = useState(-1);
    const [kickOffTimes, setKickOffTimes] = useState<KickOffTimesModel[]>([]);
    const [playerList, setPlayerList] = useState<PlayerModel[]>([]);
    const [fixtureData, setFixtureData] = useState<TeamIdFDRModel[][]>([]);

    const [errorLoading, setErrorLoading] = useState<ErrorLoading>(emptyErrorLoadingState);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function convertFixtureData(fdr_data: any): TeamIdFDRModel[] {
        if (!fdr_data || fdr_data?.length < 1) return [];
        var temp: TeamIdFDRModel[] = [];

        fdr_data.forEach((team: any) => {
            const team_i = JSON.parse(team);
            const team_name_short = team_i["team_name_short"];
            const team_id = team_i["team_id"];

            const FDR_gw_i: FDR_GW_i[] = [];
            
            team_i.fdr.forEach((fdr_for_each_gw: any[]) => {
                let temp: FDRData[] = [];
                fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                    let fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                    temp.push({
                        opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                        difficulty_score: fdr_in_gw_i_json.difficulty_score,
                        H_A: fdr_in_gw_i_json.H_A,
                        Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use ?? 0,
                        message: fdr_in_gw_i_json.message,
                    })
                });
                FDR_gw_i.push({fdr_gw_i: temp})
            });
                
            temp.push({ team_name_short: team_name_short, team_id: team_id, FDR: FDR_gw_i });
        });
        
        return temp;
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {      
                const response = await axios.get(fixturePlannerApiPath);

                if (response.data?.length == 0) {
                    setErrorLoading({ 
                        errorMessage: pageProps.languageContent.Fixture?.TeamPlanner?.errorLoadingDataMessage,
                        messageType: warning,
                    });
                    return;
                }

                const data = JSON.parse(response.data);
                
                setGwStart(data.current_gw); 
                setGwEnd(data.gw_end);

                if (maxGw < 0) { 
                    setMaxGw(data.max_gw); 
                }

                if (data?.gws_and_dates?.length > 0) {
                    const tempKickOffTimes: KickOffTimesModel[] = data.gws_and_dates.map((kickoff: string) => JSON.parse(kickoff));
                    setKickOffTimes(tempKickOffTimes);
                }

                if (data?.player_list?.length > 0) {
                    const playerList: PlayerModel[] = data.player_list.map((player: any) => {
                        const playerData = JSON.parse(player);
                        return {
                            player_position_id: playerData.player_position_id,
                            player_web_name: playerData.player_web_name,
                            player_team_id: playerData.player_team_id,
                        };
                    });
                    setPlayerList(playerList);
                }

                const fdrData = convertFixtureData(data.fdr_data);
                const fdrDataOff = convertFixtureData(data.fdr_data_offensive);
                const fdrDataDef = convertFixtureData(data.fdr_data_defensive);

                setFixtureData([fdrData, fdrDataDef, fdrDataOff]);

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
    }, [pageProps.leagueType]);

    return {
        maxGw,
        kickOffTimes,
        playerList,
        fixtureData,
        isLoading,
        errorLoading
    };
};

export default useFixturePlannerTeamIDMetaData;