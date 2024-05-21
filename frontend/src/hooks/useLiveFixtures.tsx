import { useState, useEffect } from 'react';
import axios from 'axios';
import { BonusModel, FixtureModel, PlayerModel, StatsModel } from '../models/liveFixtures/FixtureModel';


const useLiveFixtureData = (leagueType: string, gw: number) => {
    const liveFixturesApiPath = "/statistics/live-fixtures-api/";
    
    const [gameWeeks, setGameWeeks] = useState({
        currentGW: 0,
        previousGW: 0,
        nextGW: 0,
    });

    const [fixtureData, setFixtureData] = useState<any[]>([]);
    const [fixtureInfoId, setFixtureInfoId] = useState("");
    const [hasOwnershipData, setHasOwnershipData] = useState(false);

    const [errorLoading, setErrorLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(liveFixturesApiPath + "?league_name=" + leagueType + "&gw=" + gw.toString());
                 
                const data = JSON.parse(response?.data);
                
                setGameWeeks({
                    currentGW: data?.current_gameweek,
                    previousGW: data?.previous_gw,
                    nextGW: data?.next_gw,
                });

                setHasOwnershipData(data?.has_ownership_data);
    
                let hasSetLiveStatus = false;
    
                const fixtureDataList: FixtureModel[] = data?.fixture_data.map((fixture: any) => {
                    const fixtureParsed = JSON.parse(fixture);
    
                    const tempFixture: FixtureModel = {
                        id: fixtureParsed?.id,
                        finished: fixtureParsed?.finished,
                        started: fixtureParsed?.started,
                        is_live: fixtureParsed?.is_live,
                        kickoff_time: fixtureParsed?.kickoff_time,
                        team_a_name: fixtureParsed?.team_a_name,
                        team_h_name: fixtureParsed?.team_h_name,
                        team_a_score: fixtureParsed?.team_a_score,
                        team_h_score: fixtureParsed?.team_h_score,
                        stats: fixtureParsed?.stats,
                        players_h: extractPlayerData(fixtureParsed?.players_h),
                        players_a: extractPlayerData(fixtureParsed?.players_a),
                        bonus_list: [],
                    };
    
                    if (fixtureParsed?.is_live && !hasSetLiveStatus) { 
                        setFixtureInfoId(fixtureParsed?.id);
                        hasSetLiveStatus = true; 
                    }
    
                    return tempFixture;
                });
    
                const elementsByDate: any = {};
    
                fixtureDataList.forEach(fixModel => {
                    const date = fixModel.kickoff_time.split("T")[0];
                    if (!elementsByDate[date]) {
                        elementsByDate[date] = [];
                    }
                    elementsByDate[date].push(fixModel);
    
                    fixModel.players_a.sort((player1: any, player2: any) => player1.position_id - player2.position_id);
                    fixModel.players_h.sort((player1: any, player2: any) => player1.position_id - player2.position_id);
                    
                    if (fixModel.players_a?.length > 4 && fixModel.players_h?.length > 4) {
                        const sortedAway = fixModel.players_a.slice().sort((player1: any, player2: any) => player2.opta_index - player1.opta_index);
                        const sortedHome = fixModel.players_h.slice().sort((player1: any, player2: any) => player2.opta_index - player1.opta_index);
    
                        const bonusModel: BonusModel[] = [];
                        
                        for (let i = 0; i < 5; i++) {
                            bonusModel.push({
                                home_player_name: sortedHome[i].name,
                                away_player_name: sortedAway[i].name,
                                home_opta: sortedHome[i].opta_index,
                                away_opta: sortedAway[i].opta_index,
                            });
                        }
                        
                        fixModel.bonus_list = bonusModel;
                    }
                });
    
                const listOfLists = Object.entries(elementsByDate).map(([date, fixtureDataList]) => [convertDateToString(date), fixtureDataList]);
                
                setFixtureData(listOfLists);
                setIsLoading(false);
                setErrorLoading(false);
            } catch (error) {
                setErrorLoading(true);
                setIsLoading(false);
            }
        };

        fetchData();
        
    }, [leagueType, gw]);

    function extractPlayerData(fixture_parsed: any[]) {
        let temp_players_list: PlayerModel[] = [];

        fixture_parsed.map( (player: any[]) => {
            let temp_player: PlayerModel = {
                name: player[0],
                minutes: player[1],
                opta_index: player[2],
                total_points: player[3],
                position_id: player[4],
                team_id: player[5],
                stats: extractStats(player[6]),
                EO: player[7],
            };
        
            temp_players_list.push(temp_player);
        });

        return temp_players_list;
    }

    function extractStats(stats: StatsModel[]) {
        let temp_stats_list: StatsModel[] = [];
        
        stats.map( (stat: StatsModel) => {
            let temp_stat: StatsModel = {
                identifier: stat?.identifier,
                points: stat?.points,
                value: stat?.value,
            };

            temp_stats_list.push(temp_stat);
        });

        return temp_stats_list;
    }

    function convertDateToString(date: string) {
        const dateToTime = (date: any) => date.toLocaleString('no', {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

        const localDate = new Date(date);

        return dateToTime(localDate);
    }

    return {
        gameWeeks,
        fixtureData,
        fixtureInfoId,
        isLoading,
        hasOwnershipData,
        setFixtureInfoId
    };
};

export default useLiveFixtureData;