import React, { useState, useEffect, FunctionComponent } from 'react';

import Pagination from 'rc-pagination';
import axios from 'axios';

import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { PlayerOwnershipModel } from '../../../models/playerOwnership/PlayerOwnershipModel';
import { TeamNameAndIdModel } from '../../../models/playerOwnership/TeamNameAndIdModel';
import { ChipUsageModel } from '../../../models/playerOwnership/ChipUsageModel';
import { TableSortHead } from '../../Shared/TableSortHead/TableSortHead';
import { Spinner } from '../../Shared/Spinner/Spinner';
import Popover from '../../Shared/Popover/Popover';
import '../../Shared/Pagination/Pagination.scss';
import { store } from '../../../store/index';
import './LiveFixtures.scss';
import { content_json } from '../../../language/languageContent';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type LanguageProps = {
    content: any;
    league_type: string;
}

type StatsModel = {
    identifier: string;
    points: number;
    value: number;
}

type PlayerModel = {
    name: string;
    minutes: number;
    opta_index: number;
    total_points: number;
    position_id: number;
    team_id: number;
    stats: StatsModel[];
}

type BonusModel = {
    home_player_name: string;
    home_opta: number;
    away_player_name: string;
    away_opta: number;
}

type FixtureModel = {
    team_a_name: string;
    team_h_name: string;
    team_a_score: number;
    team_h_score: number;
    is_live: boolean;
    id: string;
    started: boolean;
    finished: boolean;
    kickoff_time: string;
    stats: any;
    players_h: PlayerModel[];
    players_a: PlayerModel[];
    bonus_list: BonusModel[];
}

type GwFixturesModel = {
    previous_gw: number;
    next_gw: number;
    current_gameweek: number;
    fixture_data: FixtureModel[];
}

export const LiveFixturesPage : FunctionComponent<LanguageProps> = (props) => {
    const live_fixtures_api_path = "/statistics/live-fixtures-api/";

    const [ currentGW, setCurrentGW ] = useState(0);
    const [ previousGW, setPreviousGW ] = useState(0);
    const [ nextGW, setNextGW ] = useState(0);

    const emptyChipModel: FixtureModel[] = []
    const emptyAvailableGws: any[] = []
    const [ fixtureData, setFixtureData ] = useState(emptyAvailableGws);
    const [ fixtureInfoId, setFixtureInfoId ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        store.dispatch({type: "league_type", payload: props.league_type});
        
        getLiveFixtureData(0);

    }, [props.league_type]);


    function getLiveFixtureData(gw: number) {
        setIsLoading(true);

        var body = {
            league_name: props.league_type,
            gw: gw,
        };

        axios.post(live_fixtures_api_path, body).then(x => { 
            let data = JSON.parse(x?.data);
            
            setPreviousGW(data?.previous_gw); 
            setCurrentGW(data?.current_gameweek);
            setNextGW(data?.next_gw); 

            let fixture_data_list: FixtureModel[] = [];

            let hasSetLiveStatus = false;

            data?.fixture_data.map( (fixture: any) => {
                let fixture_parsed = JSON.parse(fixture);

                let temp_fixture: FixtureModel = {
                    id: fixture_parsed?.id,
                    finished: fixture_parsed?.finished,
                    started: fixture_parsed?.started,
                    is_live: fixture_parsed?.is_live,
                    kickoff_time: fixture_parsed?.kickoff_time,
                    team_a_name: fixture_parsed?.team_a_name,
                    team_h_name: fixture_parsed?.team_h_name,
                    team_a_score: fixture_parsed?.team_a_score,
                    team_h_score: fixture_parsed?.team_h_score,
                    stats: fixture_parsed?.stats,
                    players_h: extractPlayerData(fixture_parsed?.players_h),
                    players_a: extractPlayerData(fixture_parsed?.players_a),
                    bonus_list: [],
                };

                if (fixture_parsed?.is_live && !hasSetLiveStatus) { 
                    setFixtureInfoId(fixture_parsed?.id);
                    hasSetLiveStatus = true; 
                }

                fixture_data_list.push(temp_fixture);
            });
            

            let fixture_data_list_date: any[] = [];
            let current_date = fixture_data_list[0].kickoff_time.split("T")[0];
            let temp_list: FixtureModel[] = [fixture_data_list[0]];
            fixture_data_list.map(fix_model => {
                
                if (current_date != fix_model.kickoff_time.split("T")[0]) {
                    fixture_data_list_date.push([convertDateToString(fix_model.kickoff_time), temp_list]);
                    temp_list = [];
                    current_date = fix_model.kickoff_time.split("T")[0];
                }

                temp_list.push(fix_model)
            });

            const elementsByDate: any = {};

            fixture_data_list.forEach(fix_model => {
                var date = fix_model.kickoff_time.split("T")[0];
                if (!elementsByDate[date]) {
                  elementsByDate[date] = [];
                }
                elementsByDate[date].push(fix_model);

                fix_model.players_a.sort((player1: any, player2: any) => {
                    return player1.position_id - player2.position_id;
                });

                fix_model.players_h.sort((player1: any, player2: any) => {
                    return player1.position_id - player2.position_id;
                });
                
                if (fix_model.players_a?.length > 4 && fix_model.players_h?.length > 4) {
                    const sortedAway = fix_model.players_a.slice().sort((player1: any, player2: any) => {
                        return player2.opta_index - player1.opta_index;
                    });
    
                    const sortedHome = fix_model.players_h.slice().sort((player1: any, player2: any) => {
                        return player2.opta_index - player1.opta_index;
                    });
    
                    let bonusModel: BonusModel[] = [];
                    
                    for (let i = 0; i < 5; i++) {
                        bonusModel.push({
                            home_player_name: sortedHome[i].name,
                            away_player_name: sortedAway[i].name,
                            home_opta: sortedHome[i].opta_index,
                            away_opta: sortedAway[i].opta_index,
                        })
                    }
                    
                    fix_model.bonus_list = bonusModel;
                }

            });
              
            const listOfLists = Object.entries(elementsByDate).map(([date, fixture_data_list]) => [convertDateToString(date), fixture_data_list]);
            
            setFixtureData(listOfLists);
            setIsLoading(false);
        });
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

    function convertDateToTimeString(date: string) {
        const dateToTime = (date: any) => date.toLocaleString('no', {
            hour: "numeric",
            minute: "numeric",
          });

        const localDate = new Date(date);

        return dateToTime(localDate);
    }

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
            };
        
            temp_players_list.push(temp_player);
        });

        return temp_players_list;
    }

    function extractStats(stats: any[]) {
        let temp_stats_list: StatsModel[] = [];
        
        stats.map( (stat: any) => {
            let temp_stat: StatsModel = {
                identifier: stat?.identifier,
                points: stat?.points,
                value: stat?.value,
            };

            temp_stats_list.push(temp_stat);
        });

        return temp_stats_list;
    }

    function toggleFixtureBox(id: string) {
        setFixtureInfoId(id === fixtureInfoId ? "" : id);
    }

    function convertListToString(list: any[]) {
        let temp: string[] = [];

        list.map(el => {
            temp.push(el?.element + " (" + el?.value + ")")
        })

        const myString = temp.join(", ");

        return myString;
    }

    function convertIdentifierToReadableName(identifier: string) {
        if (identifier === "goals_scored") return props.content.General.goal;
        if (identifier === "assists") return props.content.General.assists;
        if (identifier === "yellow_cards") return props.content.General.yellow_cards;
        if (identifier === "red_cards") return props.content.General.red_cards;
        if (identifier === "saves") return props.content.General.saves;
        if (identifier === "bonus") return props.content.General.bonus;
        if (identifier === "penalties_saved") return props.content.General.penalties_saved;
        if (identifier === "penalties_missed") return props.content.General.penalties_missed;
        if (identifier === "own_goals") return props.content.General.own_goals;
        return identifier;
    }

    return <>
    <DefaultPageContainer 
        pageClassName='live-fixtures-container' 
        heading={props.content.Statistics.LiveFixtures.title + " - " + store.getState().league_type} 
        description={'Live statistikk for blant annet opta index, minutter spilt og poeng for spillere i de ulike kampene.'}>
        <h1>{props.content.Statistics.LiveFixtures.title}
        <Popover 
            id={"live-fixture-id"}
            title=""
            algin_left={true}
            popover_title={props.content.Statistics.LiveFixtures.title} 
            iconSize={14}
            iconpostition={[-10, 0, 0, 3]}
            popover_text=''>
            Statistikk rundt blant annet opta index, minutter spilt og poeng for spillere i de ulike kampene.
        </Popover>
        </h1>
        { isLoading && 
            <Spinner />
        }
        { !isLoading && fixtureData?.length > 0 && <>
            <div className='round-container'>
                <div className='toggle-button left'>
                { previousGW > 0 && 
                    <button onClick={() => getLiveFixtureData(previousGW)}>
                        <ArrowBack />
                        <span>{props.content.General.gw} {previousGW}</span>
                    </button>
                }
                </div> 
                <h2>{props.content.General.gw} {currentGW}</h2>
                <div className='toggle-button right'>
                { nextGW > 0 && 
                    <button onClick={() => getLiveFixtureData(nextGW)}>
                        <span>{props.content.General.gw} {nextGW}</span>
                        <ArrowForward />
                    </button>
                }
                </div> 
            </div>
            <div className='fixture-boxes-container'>
                { fixtureData.map( (fixture_date: any[]) => (
                    <div>
                        <div className='fixture-date'>{fixture_date[0]}</div>
                        { fixture_date[1].map((fixture: FixtureModel) => (
                            <>
                            <div className={fixture?.started ? 'fixture-container' : 'fixture-container not-started'} onClick={() => { if (fixture?.started) { toggleFixtureBox(fixture?.id)} } }>
                                <div className='home'>{fixture.team_h_name}</div>
                                { fixture.started ? 
                                    <div className='result'>
                                        {fixture.team_h_score} | {fixture.team_a_score}
                                    </div> : 
                                    <div className='result'>
                                        {convertDateToTimeString(fixture.kickoff_time)}
                                    </div>
                                }
                                <div className='away'>{fixture.team_a_name}</div>
                            </div>
                            <>
                            { (fixtureInfoId === fixture?.id) &&
                            <div>
                                <div className='fixture-info-container'>
                                    <div className='home-players'>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th className='name'>Player</th>
                                                    <th>MP</th>
                                                    <th>Opta</th>
                                                    <th>Pts</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { fixture.players_h.map(h => (
                                                    <tr>
                                                        <td className='name'>{h.name}</td>
                                                        <td>{h.minutes}</td>
                                                        <td>{h.opta_index.toFixed(2)}</td>
                                                        <td>{h.total_points}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='game-stats'>
                                        <table className='stats'>
                                            <thead>
                                                <tr>
                                                    <th className='team-col'>{fixture.team_h_name}</th>
                                                    <th></th>
                                                    <th className='team-col'>{fixture.team_a_name}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { fixture.stats.map((stat: any) => (
                                                    <>
                                                    { (stat?.h?.length > 0 || stat?.a?.length) > 0 && (
                                                        <>
                                                            <tr>
                                                                <td className='h'>{convertListToString(stat?.h)}</td>
                                                                <td className='identifier'>{convertIdentifierToReadableName(stat?.identifier)}</td>
                                                                <td className='a'>{convertListToString(stat?.a)}</td>
                                                            </tr>
                                                        </>)
                                                    }
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                        <table className='bonus-list'>
                                            <thead>
                                                <tr>
                                                    <th>{fixture.team_h_name}</th>
                                                    <th>{fixture.team_a_name}</th>
                                                    {/* <div className='opta-box'><p>Opta index</p></div> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { fixture.bonus_list.map((bonus: BonusModel) => (
                                                    <>
                                                        <tr>
                                                            <td className='h'>{bonus.home_player_name+" ("+bonus.home_opta.toFixed(1) +")"}</td>
                                                            <td className='a'>{bonus.away_player_name+" ("+bonus.away_opta.toFixed(1) +")"}</td>
                                                        </tr>
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='away-players'>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th className='name'>Player</th>
                                                    <th>MP</th>
                                                    <th>Opta</th>
                                                    <th>Pts</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { fixture.players_a.map(a => (
                                                    <tr>
                                                        <td className='name'>{a.name}</td>
                                                        <td>{a.minutes}</td>
                                                        <td>{a.opta_index.toFixed(2)}</td>
                                                        <td>{a.total_points}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                </div>
                            }
                            </>
                            </>
                        )) }
                    </div>
                ))}
            </div></>
        }
    </DefaultPageContainer>
    </>
};

export default LiveFixturesPage;
