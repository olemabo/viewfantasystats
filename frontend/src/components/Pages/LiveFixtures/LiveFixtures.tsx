import { StatsModel, BonusModel, PlayerModel, FixtureModel } from '../../../models/liveFixtures/FixtureModel';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import Table, { TableBody, TableRow, TableCell, TableHead } from '../../Shared/Table/Table';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { PageProps, fpl } from '../../../models/shared/PageProps';
import ArrowForward from '@mui/icons-material/ArrowForward';
import * as urls from '../../../static_urls/internalUrls';
import { Spinner } from '../../Shared/Spinner/Spinner';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Popover from '../../Shared/Popover/Popover';
import { store } from '../../../store/index';
import './LiveFixtures.scss';
import axios from 'axios';


export const LiveFixturesPage : FunctionComponent<PageProps> = (props) => {
    const live_fixtures_api_path = "/statistics/live-fixtures-api/";

    const [ currentGW, setCurrentGW ] = useState(0);
    const [ previousGW, setPreviousGW ] = useState(0);
    const [ nextGW, setNextGW ] = useState(0);

    const emptyAvailableGws: any[] = []
    const [ fixtureData, setFixtureData ] = useState(emptyAvailableGws);
    const [ fixtureInfoId, setFixtureInfoId ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);
    const [ hasOwnershipData, setHasOwnershipData ] = useState(false);

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
            setHasOwnershipData(data?.has_ownership_data);

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
        if (identifier === "bps") return props.content.Statistics.PlayerStatistics.bps;
        return identifier;
    }

    console.log(fixtureData)
    const playerNameMinWidth = 120;

    return <>
    <DefaultPageContainer 
        pageClassName='live-fixtures-container' 
        heading={props.content.Statistics.LiveFixtures.title + " - " + (store.getState().league_type === "fpl" ? "Premier League" : "Eliteserien")} 
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
                                        <Table tableLayoutType={props.league_type}>
                                            <TableHead tableHeight='compact'>
                                                <TableRow>
                                                    <TableCell cellType='head' minWidth={playerNameMinWidth}>Player</TableCell>
                                                    <TableCell cellType='head'>
                                                        <Popover
                                                            id={'Mp-home'}
                                                            title={'MP'}
                                                            popover_title={'Minutes Played'}
                                                            popover_text={`Antall minutter spilt. Antall minutter oppdateres live mens kampene spilles. `} 
                                                        /> 
                                                    </TableCell>
                                                    <TableCell cellType='head'>
                                                        <Popover
                                                            id={'Opta-home'}
                                                            title={props.league_type === fpl ? 'BPS' : 'Opta'}
                                                            popover_title={props.league_type === fpl ? 'BPS' : 'Opta Index'}
                                                            popover_text={``} 
                                                        />
                                                    </TableCell>
                                                    <TableCell cellType='head'>
                                                        <Popover
                                                            id={'Pts-home'}
                                                            title={'Pts'}
                                                            popover_title={'Points'}
                                                            popover_text={`Antall poeng spilleren har fått denne runden. Poengene oppdateres live mens kampene spilles. `} 
                                                        /> 
                                                    </TableCell>
                                                    { hasOwnershipData && 
                                                        <TableCell cellType='head'><Popover
                                                                id={'EO-home'}
                                                                title={'EO'}
                                                                popover_title={'Effective Ownership'}
                                                                popover_text={`EO (%) for topp 1000 managere fra runde ${currentGW}.`}> 
                                                                For mer info og fullstendig statistikk, se
                                                                <a href={urls.url_eliteserien_player_ownership}>her</a>.     
                                                            </Popover>
                                                        </TableCell>
                                                    }
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                { fixture.players_h.map(h => (
                                                    <TableRow>
                                                        <TableCell cellType='data' minWidth={playerNameMinWidth}>{h.name}</TableCell>
                                                        <TableCell cellType='data'>{h.minutes}</TableCell>
                                                        <TableCell cellType='data'>{h.opta_index.toFixed(props.league_type === fpl ? 0 : 1)}</TableCell>
                                                        <TableCell cellType='data'>{h.total_points}</TableCell>
                                                        { hasOwnershipData && <TableCell cellType='data'>{h.EO}</TableCell> }
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className='game-stats'>
                                        <Table tableLayoutType={props.league_type} className='stats'>
                                            <TableHead tableHeight='compact'>
                                                <TableRow>
                                                    <TableCell cellType='head' className='team-col'>{fixture.team_h_name}</TableCell>
                                                    <TableCell cellType='head' />
                                                    <TableCell cellType='head' className='team-col'>{fixture.team_a_name}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                { fixture.stats.map((stat: any) => (
                                                    <>
                                                    { (stat?.h?.length > 0 || stat?.a?.length > 0) && stat?.identifier !== 'bps' && (
                                                        <TableRow>
                                                            <TableCell cellType='data' className='h'>{convertListToString(stat?.h)}</TableCell>
                                                            <TableCell cellType='data' className='identifier'>{convertIdentifierToReadableName(stat?.identifier)}</TableCell>
                                                            <TableCell cellType='data' className='a'>{convertListToString(stat?.a)}</TableCell>
                                                        </TableRow>
                                                        )
                                                    }
                                                    </>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <Table tableLayoutType={props.league_type} className='bonus-list'>
                                            <TableHead tableHeight='compact'>
                                                <TableRow>
                                                    <TableCell cellType='head'>{fixture.team_h_name}</TableCell>
                                                    <TableCell cellType='head'>{fixture.team_a_name}</TableCell>
                                                    {/* <div className='opta-box'><p>Opta index</p></div> */}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                { fixture.bonus_list.map((bonus: BonusModel) => ( <>
                                                    <TableRow>
                                                        <TableCell cellType='data' className='h'>{bonus.home_player_name+" ("+bonus.home_opta.toFixed(1) +")"}</TableCell>
                                                        <TableCell cellType='data' className='a'>{bonus.away_player_name+" ("+bonus.away_opta.toFixed(1) +")"}</TableCell>
                                                    </TableRow>
                                                </>))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className='away-players'>
                                        <Table tableLayoutType={props.league_type}>
                                            <TableHead tableHeight='compact'>
                                                <TableRow>
                                                    <TableCell cellType='head' minWidth={playerNameMinWidth}>Player</TableCell>
                                                    <TableCell cellType='head'>
                                                        <Popover
                                                            id={'Mp-away'}
                                                            title={'MP'}
                                                            popover_title={'Minutes Played'}
                                                            popover_text={`Antall minutter spilt. Antall minutter oppdateres live mens kampene spilles. `} 
                                                        /> 
                                                    </TableCell>
                                                    <TableCell cellType='head'>
                                                        <Popover
                                                            id={'Opta-away'}
                                                            title={props.league_type === fpl ? 'BPS' : 'Opta'}
                                                            popover_title={props.league_type === fpl ? 'BPS' : 'Opta Index'}
                                                            popover_text={``} 
                                                        />
                                                    </TableCell>
                                                    <TableCell cellType='head'>
                                                        <Popover
                                                            id={'Pts-away'}
                                                            title={'Pts'}
                                                            popover_title={'Points'}
                                                            popover_text={`Antall poeng spilleren har fått denne runden. Poengene oppdateres live mens kampene spilles. `} 
                                                        />     
                                                    </TableCell>
                                                    { hasOwnershipData && 
                                                        <TableCell cellType='head'><Popover
                                                                id={'EO-away'}
                                                                title={'EO'}
                                                                popover_title={'Effective Ownership'}
                                                                popover_text={`EO (%) for topp 1000 managere fra runde ${currentGW}.`}> 
                                                                For mer info og fullstendig statistikk, se
                                                                <a href={urls.url_eliteserien_player_ownership}>her</a>.     
                                                            </Popover>
                                                        </TableCell> 
                                                    }
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                { fixture.players_a.map(a => (
                                                    <TableRow>
                                                        <TableCell cellType='data' minWidth={playerNameMinWidth}>{a.name}</TableCell>
                                                        <TableCell cellType='data'>{a.minutes}</TableCell>
                                                        <TableCell cellType='data'>{a.opta_index.toFixed(props.league_type === fpl ? 0 : 1)}</TableCell>
                                                        <TableCell cellType='data'>{a.total_points}</TableCell>
                                                        { hasOwnershipData && <TableCell cellType='data'>{a.EO}</TableCell> }
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
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
