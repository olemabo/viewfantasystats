import { contrastingColor } from '../../../utils/findContrastColor';
import { FDRData } from "../../FPL/fixturePlanner/FdrModel";
import "../../FPL/fixturePlanner/fixturePlanner.scss";
import React, { useState, useEffect } from 'react';
import store from '../../../store/index';
import axios from 'axios';
import { FilterButton } from '../../Shared/FilterButton/FilterButton';
import { Button } from '../../Shared/Button/Button';
import { Spinner } from '../../Shared/Spinner/Spinner';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


interface KickOffTimes {
    gameweek: number;
    kickoff_time: string;
    day_month: string;
}

interface FDRDataNew {
    opponent_team_name: string;
    difficulty_score: string;
    H_A: string;
    Use_Not_Use: boolean;
}

interface FDR_gw_i {
    fdr_gw_i: FDRDataNew[];
}

interface TeamData {
    team_name: string;
    background_color: string;
    font_color: string;
    checked: boolean;
    FDR: FDR_gw_i [];
}

interface TeamName {
    team_name: string;
    checked: boolean;
}

export const EliteserienPeriodePlanner = () => {
    const fixture_planner_kickoff_time_api_path = "/fixture-planner-eliteserien/get-eliteserien-kickoff-times/";
    const fixture_planner_api_path = "/fixture-planner-eliteserien/get-all-eliteserien-fdr-data/";
    const min_gw = 1;
    const max_gw = 30;

    const empty: TeamData[] = [ { team_name: "-", FDR: [], checked: true, font_color: "FFF", background_color: "FFF" }];
    const emptyFDRList: FDRData[] = [{ gw: "0", oppTeamDifficultyScore: "0", oppTeamHomeAwayList: "0", oppTeamNameList: "0", team_name: "0", team_short_name: "0" }];
    const emptyGwDate: KickOffTimes[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];
    const emptyTeamNames: TeamName[] = [{team_name: "empty", checked: false}];

    const [ teamNames, setTeamNames ] = useState(emptyTeamNames);
    const [ fdrDataAllTeams, setFdrDataAllTeams ] = useState(emptyFDRList);
    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty);
    const [ fdrDataAllTeamsNew, setFdrDataAllTeamsNew] = useState(empty);
    
    const [ kickOffTimes, setKickOffTimes ] = useState(emptyGwDate);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);
    const [ fdrToColor, setFdrToColor ] = useState({0.5: "0.5", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5"});


    const [ gwStart, setGwStart ] = useState(min_gw);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ maxGw, setMaxGw ] = useState(-1);
    const [ minNumFixtures, setMinNumFixtures ] = useState(1);
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        console.log(store.getState()?.league_type, store.getState()?.league_type != "Eliteserien");
        if (store.getState()?.league_type != "Eliteserien") {
            store.dispatch({type: "league_type", payload: "Eliteserien"});
            console.log(store.getState().league_type);
        }

        // Get fdr data from the API
        let body = { 
            start_gw: 1,
            end_gw: 30,
            min_num_fixtures: minNumFixtures,
            combinations: 'FDR-best'
        };
        
        extractFDRData(body);
    }, []);


    function updateFDRData() {
        var body = {
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: minNumFixtures,
            combinations: 'FDR-best'
        };

        extractFDRData(body);
    }

    function isEmpty(obj: {}) {
        return Object.keys(obj).length === 0;
      }

    function extractFDRData(body: any) {
        // Get fdr data from api
        setLoading(true);
        axios.post(fixture_planner_api_path, body).then((x: any) => {
            let apiFDRList: TeamData[] = [];
            let tempTeamNames: TeamName[] = [];
            let data = JSON.parse(x.data);

            if (maxGw < 0) { 
                setMaxGw(data.gws_and_dates.length); 
                setGwEnd(data.gws_and_dates.length); 
            }
            
            setFdrToColor(data.fdr_to_colors_dict);
            
            if (data?.gws_and_dates?.length > 0) {
                let temp_KickOffTimes: KickOffTimes[] = [];
                data?.gws_and_dates.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimes(temp_KickOffTimes);
                setKickOffTimesToShow(temp_KickOffTimes.slice(gwStart - 1, gwEnd));
            }

            
            let index = 0;
            data.fdr_data.forEach((team: any[]) => {
                let team_name = JSON.parse(team[0][0][0]).team_name;
                console.log(team_name, team)
                tempTeamNames.push({ team_name: team_name, checked: false});

                let FDR_gw_i: FDR_gw_i[] = [];
                team.forEach((fdr_for_each_gw: any[]) => {
                    let temp: FDRDataNew[] = [];
                    fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                        let fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                        temp.push({
                            opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                            difficulty_score: fdr_in_gw_i_json.difficulty_score,
                            H_A: fdr_in_gw_i_json.H_A,
                            Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use})
                    });
                    FDR_gw_i.push({fdr_gw_i: temp})
                });
                let font_color = "black";
                let background_color = "white";
                if (data?.team_name_color?.length > 0) {
                    data?.team_name_color.forEach((team: string[]) => {
                        if (team_name == team[0]) {
                            font_color = team[2];
                            background_color = team[1];
                        }
                    }    
                    );
                }
                let tempTeamData = { team_name: team_name, FDR: FDR_gw_i, checked: true, font_color: font_color, background_color: background_color }
                apiFDRList.push(tempTeamData);
                index += 1;
            });

            console.log("team_name_color: ", data.team_name_color);

            setFdrDataAllTeamsNew(apiFDRList);
            setFdrDataToShow(apiFDRList);
            setTeamNames(tempTeamNames);
            setLoading(false);
        })
    }

    function toggleCheckbox(e: any) {
        let tempTeamNames: TeamName[] = [];
        let temp: TeamData[] = [];
        fdrDataToShow.forEach(x => {
            let checked = x.checked;
            if (x.team_name == e.currentTarget.value) {
                checked = !x.checked;
            }
            // tempTeamNames.push({ team_name: x.team_name, checked: checked});
            console.log("x: ", x, checked, e.currentTarget.value);
            temp.push({ team_name: x.team_name, FDR: x.FDR, checked: checked, font_color: x.font_color, background_color: x.background_color });
        });
        // setTeamNames(tempTeamNames);
        console.log(temp);
        setFdrDataToShow(temp);
    }

    function convertFDRtoHex(fdr: string) {
        if (isEmpty(fdrToColor)) return fdr;
        var float = parseFloat(fdr);
        if (float == 0.5) return "#" + fdrToColor[0.5].substring(2);
        var int = parseInt(fdr);
        if (int == 1) return "#" + fdrToColor[1].substring(2);
        if (int == 2) return "#" + fdrToColor[2].substring(2);
        if (int == 3) return "#" + fdrToColor[3].substring(2);
        if (int == 4) return "#" + fdrToColor[4].substring(2);
        if (int == 5) return "#" + fdrToColor[5].substring(2);
        return "#000";
    }

    console.log(showTeamFilters)

    return <>
    <div className='fixture-planner-container' id="fixture-planner-container">
        <h1>Eliteserien Fixture Planner</h1>
        { maxGw > 0 && 
            <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
                GW start:
                <input 
                    className="form-number-box" 
                    type="number" 
                    min={min_gw}
                    max={gwEnd}
                    onInput={(e) => setGwStart(parseInt(e.currentTarget.value))} 
                    value={gwStart} 
                    id="input-form-start-gw" 
                    name="input-form-start-gw">
                </input>
                GW end:
                <input 
                    className="form-number-box" 
                    type="number" 
                    min={gwStart}
                    max={maxGw}
                    onInput={(e) => setGwEnd(parseInt(e.currentTarget.value))} 
                    value={gwEnd} 
                    id="input-form-start-gw" 
                    name="input-form-start-gw">
                </input>
                <br />
                Minimum fixtures:
                <input 
                    className="box" 
                    type="number" 
                    min={1} 
                    max={gwEnd}
                    value={minNumFixtures} 
                    onInput={(e) => setMinNumFixtures(parseInt(e.currentTarget.value))} 
                    id="min_num_fixtures" 
                    name="min_num_fixtures" />
        
                <input className="submit" type="submit" value="Search">
                </input>
            </form> 
        }
     
        <Button buttonText={'Filter teams'} 
            icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
            onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} />

        { fdrDataToShow != null && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "empty" && showTeamFilters &&
            <div className='filter-teams-container'>
                <div className='filter-teams-list'>
                { fdrDataToShow.map(team_name => 
                    <FilterButton fontColor={team_name.font_color} backgroundColor={team_name.background_color}  onclick={(e: any) => toggleCheckbox(e)} buttonText={team_name.team_name} checked={team_name.checked} />
                )}
                </div>
            </div>
        }

        { loading && 
            <div style={{ backgroundColor: "#E8E8E8"}}><Spinner /></div>
        }

        <br ></br>

        { !loading && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "-" && kickOffTimesToShow.length > 0 && kickOffTimesToShow[0].gameweek != 0 && (
            <div>
                <div className="container-fdr">
                    <div id="fdr-table" className="container-rotation">
                        <div id="fdr-team-names">
                            <table>
                                <tbody id="fdr-names">
                                    <tr>
                                        <td className="name-column min-width">
                                            Name
                                        </td>
                                    </tr>
                                    { fdrDataToShow.map(fdr => (<>
                                        { fdr.checked && (
                                            <tr>
                                                <td className='name-column min-width'>
                                                    {fdr.team_name}
                                                </td>
                                            </tr>
                                        )}</>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div id="fdr-team-difficulty">
                            <table>
                                <tbody id="fdr-gws">
                                    <tr id="fdr-row-gws">
                                        { kickOffTimesToShow.map(gw =>
                                            <th className="min-width"> GW { gw.gameweek}
                                                <div className="day_month">
                                                    { gw.day_month }
                                                </div>
                                            </th>
                                        )}
                                    </tr>
                                    { fdrDataToShow.map(fdr => 
                                        <>
                                         { fdr.checked && (
                                            <tr id={"fdr-row-" + fdr.team_name}>
                                                { fdr.FDR.map(f => (
                                                    <td scope='col' style={{backgroundColor: convertFDRtoHex(f.fdr_gw_i[0].difficulty_score)}} className={'min-width'
                                                    + (f.fdr_gw_i.length == 1 ? " color-" + f.fdr_gw_i[0].difficulty_score + " " : " no-padding ") + 'double-border-' + f.fdr_gw_i[0].Use_Not_Use  }>

                                                        { f.fdr_gw_i.map(g => (
                                                            <div style={{backgroundColor: convertFDRtoHex(f.fdr_gw_i[0].difficulty_score), color: contrastingColor(convertFDRtoHex(f.fdr_gw_i[0].difficulty_score))}} className={'min-width color-' + g.difficulty_score + ' multiple-fixtures height-' + f.fdr_gw_i.length}>
                                                                { g.opponent_team_name == '-' ? "Blank" : (g.opponent_team_name.toUpperCase() + " (" + g.H_A + ")") }
                                                            </div>
                                                        ))}
                                                    </td>
                                                ))}
                                            </tr>
                                        )}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )}
     </div> </>
};

export default EliteserienPeriodePlanner;