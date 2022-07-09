import { FDRData } from "../fixturePlanner/FdrModel";
import React, { useState, useEffect } from 'react';
import "../fixturePlanner/fixturePlanner.scss";
import "../rotationPlanner/rotationPlanner.scss";
import axios from 'axios';
import { Button } from '../../Shared/Button/Button';
import { CheckBox } from '../../Shared/CheckBox/CheckBox';
import { Spinner } from '../../Shared/Spinner/Spinner';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

interface RotationPlannerTeamInfo {
    avg_Score: number;
    id_list: string[];
    team_name_list: string[];
    extra_fixtures: number;
    home_games: number;
    fixture_list: [];
}

interface gwDate {
    gw: number;
    day_month: string;
}

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
    checked: boolean;
    checked_must_be_in_solution: boolean;
}

interface TeamName {
    team_name: string;
    checked: boolean;
}

export const RotationPlanner = () => {
    const fixture_planner_kickoff_time_api_path = "/fixture-planner/get-kickoff-times/";
    const fixture_planner_api_path = "/fixture-planner/get-all-fdr-data/";
    const min_gw = 1;
    const max_gw = 38;
    const empty: RotationPlannerTeamInfo[] = [ { avg_Score: -1, id_list: [], team_name_list: [], extra_fixtures: -1, home_games: -1, fixture_list: [] }];
    const emptyFDRList: FDRData[] = [{ gw: "0", oppTeamDifficultyScore: "0", oppTeamHomeAwayList: "0", oppTeamNameList: "0", team_name: "0", team_short_name: "0" }];
    const emptyGwDate: KickOffTimes[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];
    const emptyTeamNames: TeamName[] = [{team_name: "empty", checked: false}];

    const [ gwStart, setGwStart ] = useState(min_gw);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ teamNames, setTeamNames ] = useState(emptyTeamNames);
    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty);
    const [ fdrDataAllTeamsNew, setFdrDataAllTeamsNew] = useState(empty);
    const [ kickOffTimes, setKickOffTimes ] = useState(emptyGwDate);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);

    const [ teamsToCheck, setTeamsToCheck ] = useState(2);
    const [ teamsToPlay, setTeamsToPlay ] = useState(1);

    const [ validationErrorMessage, setValidationErrorMessage ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const emptyTeamData: TeamData[] = [ { team_name: "empty", checked: true, checked_must_be_in_solution: false }];
    const [ teamData, setTeamData ] = useState(emptyTeamData);

    useEffect(() => {
        // get all fpl teams   
        axios.get("/fixture-planner/data-fdr-ui/").then(team_data => {
            if (team_data?.data && team_data?.data?.length > 0) {
                let teams: TeamData[] = [];
                team_data.data.forEach( (team_i: any) => {
                    let temp_team_data = { team_name: team_i.team_name, checked: true, checked_must_be_in_solution: false }
                    teams.push(temp_team_data);
                });
                setTeamData(teams);
            }
        })

        var tempStart = 1;
        var tempEnd = 3;

        // Get kickoff time data from the API
        axios.get(fixture_planner_kickoff_time_api_path).then(x => {
            if (x.data?.length > 0) {
                let temp_KickOffTimes: KickOffTimes[] = [];
                x.data.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimes(temp_KickOffTimes);
                console.log(temp_KickOffTimes.slice(tempStart - 1, tempEnd));
                setKickOffTimesToShow(temp_KickOffTimes.slice(tempStart - 1, tempEnd));
            }
        })

        setGwStart(tempStart);
        setGwEnd(tempEnd);
        console.log(gwStart, gwEnd, kickOffTimes.slice(tempStart, tempEnd));
        // Get fdr data from the API
        let body = { 
            start_gw: tempStart,
            end_gw: tempEnd,
            min_num_fixtures: '1',
            combinations: 'Rotation',
            teams_to_check: teamsToCheck,
            teams_to_play: teamsToPlay,
            teams_in_solution: [],
            fpl_teams: [-1],
        };
        // setKickOffTimesToShow(kickOffTimes.slice(37, 38));

        extractFDRData(body)
    }, []);

    function extractFDRData(body: any) {
        setLoading(true);
        // Get fdr data from api
        axios.post(fixture_planner_api_path, body).then(x => {
            let RotationPlannerTeamInfoList: RotationPlannerTeamInfo[] = [];
            console.log("x: ", x);
            x.data.forEach((team: any) => {
                let team_i_json = JSON.parse(team);
                let temp: RotationPlannerTeamInfo = { avg_Score: team_i_json.avg_Score, 
                    id_list: team_i_json.id_list, team_name_list: team_i_json.team_name_list, 
                    extra_fixtures: team_i_json.extra_fixtures, home_games: team_i_json.home_games,
                    fixture_list: team_i_json.fixture_list}
                // console.log(temp, team_i_json, team_i_json.fixture_list);
                // MULIG JEG MÅ LAGE EGNE OBJECT FOR FIXTURELIST, ITERERE GJENNOM og LEGGE TIL PÅ NYTT,
                // SATSER PÅ å gjøre det i html istedenfor for å unngå å gå gjennom to ganger
                RotationPlannerTeamInfoList.push(temp);
                // let arrray = team_i_json.fixture_list;
                // dimensions [ teams_to_check x number_of_gws]
            })

            console.log("RotationPlannerTeamInfoList: ", RotationPlannerTeamInfoList);
            console.log("slice: ", kickOffTimes, kickOffTimes.slice(body['start_gw'] - 1, body['end_gw']));
            if (kickOffTimes.length > 1) {
                setKickOffTimesToShow(kickOffTimes.slice(body['start_gw'] - 1, body['end_gw']));
            }
            setFdrDataAllTeamsNew(RotationPlannerTeamInfoList);
            setFdrDataToShow(RotationPlannerTeamInfoList);
            setLoading(false);
        })
    }

    function toggleCheckboxMustBeInSolution(e: any) {
        let temp: TeamData[] = [];
        teamData.forEach(x => {
            let checked_must_be_in_solution = x.checked_must_be_in_solution;
            let checked = x.checked;
            if (x.team_name == e.currentTarget.value) {
                checked_must_be_in_solution = !x.checked_must_be_in_solution;
                if (checked_must_be_in_solution) { checked = true; }
            }
            temp.push({ team_name: x.team_name, checked: checked, checked_must_be_in_solution: checked_must_be_in_solution});
        });
        setTeamData(temp);
    }

    function toggleCheckbox(e: any) {
        let temp: TeamData[] = [];
        teamData.forEach(x => {
            let checked = x.checked;
            if (x.team_name == e.currentTarget.value) {
                checked = !x.checked;
            }
            temp.push({ team_name: x.team_name, checked: checked, checked_must_be_in_solution: x.checked_must_be_in_solution });
        });
        setTeamData(temp);
    }

    function extractTeamsToUseAndTeamsInSolution() {
        let teamsToCheck: any[] = [];
        let teamsMustBeInSolution: any[] = [];
        teamData.forEach(x => {
            if (x.checked) { teamsToCheck.push(x.team_name); }
            if (x.checked_must_be_in_solution) { teamsMustBeInSolution.push(x.team_name); }
        });

        if (teamsToCheck.length == 0) { teamsToCheck = [-1]; }

        return [teamsToCheck, teamsMustBeInSolution]
    }

    function validateInput(body: any) {
        if (body.start_gw > body.end_gw) { 
            setValidationErrorMessage("GW start must be smaller than GW end");
            return false;
        }
        if (body.teams_to_play > body.teams_to_check) { 
            setValidationErrorMessage("'Teams to play' must be smaller than 'Teams to check'");
            return false;
        }
        console.log(body.teams_in_solution.length, body.teams_to_check)
        if (body.teams_in_solution.length > body.teams_to_check) {
            setValidationErrorMessage("'teams_in_solution' must be smaller og equal to 'Teams to check'");
            return false;
        }
        return true;
    }
    
    function updateFDRData() {
        let teamsANDteamsinsolution = extractTeamsToUseAndTeamsInSolution();

        var body = {
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: '1',
            combinations: 'Rotation',
            teams_to_check: teamsToCheck,
            teams_to_play: teamsToPlay,
            // teams_in_solution: teamsANDteamsinsolution[1],
            // fpl_teams: teamsANDteamsinsolution[0],
            teams_in_solution: teamsANDteamsinsolution[1],
            fpl_teams: teamsANDteamsinsolution[0],
        };

        if (validateInput(body)) {
            setValidationErrorMessage("");
            extractFDRData(body);
        }

    }

    return <>
     <div className='fixture-planner-container' id="rotation-planner-container">
         <h1>Rotation Planner</h1>
         <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
            GW start:
            <input 
                className="form-number-box" 
                type="number" 
                min={min_gw}
                max={max_gw}
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
                max={max_gw}
                onInput={(e) => setGwEnd(parseInt(e.currentTarget.value))} 
                value={gwEnd} 
                id="input-form-start-gw" 
                name="input-form-start-gw">
            </input>

            <br />
            Teams to check:
            <input 
                className="box" 
                type="number" 
                min={1} 
                max={5} 
                onInput={(e) => setTeamsToCheck(parseInt(e.currentTarget.value))} 
                value={teamsToCheck} 
                id="teams_to_check" 
                name="teams_to_check" />
            
            Teams to play:
            <input 
                className="box" 
                type="number" 
                min={1} 
                max={5} 
                onInput={(e) => setTeamsToPlay(parseInt(e.currentTarget.value))} 
                value={teamsToPlay}
                id="teams_to_play" 
                name="teams_to_play" />

            <input className="submit" type="submit" value="Search">
            </input>
        </form>

        <div style={{ color: "red" }}>{validationErrorMessage}</div>
        
        <Button buttonText={'Filter teams'} 
            icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
            onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} />

        { teamData != null && teamData.length > 0 && teamData[0].team_name != "empty" && showTeamFilters &&
            <div className='filter-teams-container'>
                <div className='filter-teams-list'>
                { teamData.map(team_name =>
                    <CheckBox 
                    buttonText={team_name.team_name} 
                    checked1={team_name.checked} 
                    checked2={team_name.checked_must_be_in_solution} 
                    onclickBox1={(e: any) => toggleCheckbox(e)} 
                    onclickBox2={(e: any) => toggleCheckboxMustBeInSolution(e)} 
                    useTwoCheckBoxes={true} />
                )}
                </div>
            </div>
        }

        { loading && 
            <div style={{ backgroundColor: "#E8E8E8"}}><Spinner /></div>
        }

        <br ></br>

        <div id="data-box" className="text-center mt-3">
            <div className="big-container">
                <div className="container-rotation">
                    <div id="fdr-rotation">
                        { !loading && fdrDataToShow.length > 0 && fdrDataToShow[0].avg_Score != -1 &&
                            fdrDataToShow.map(row => 
                                <>
                                    <table className="rotation">
                                        <tbody>
                                            <tr>
                                                <th className="name-col-rotation">
                                                    Name
                                                </th>
                                                { kickOffTimesToShow.map(gw =>
                                                    <th className="min-width"> GW { gw.gameweek}
                                                        <div className="day_month">
                                                            { gw.day_month }
                                                        </div>
                                                    </th>
                                                )}
                                            </tr>
                                            { row.fixture_list.map( (team_i: any[]) => (
                                                <tr>
                                                    { team_i.map( (team_i_j: any, index) => (
                                                        <>
                                                        { index == 0 && JSON.parse(team_i_j[0]).team_name && (
                                                            <td className="name-column min-width">
                                                                { JSON.parse(team_i_j[0]).team_name }
                                                            </td>
                                                        )}
                                                        { team_i_j.length == 1 ?
                                                            <td scope="col" className={" min-width color-" + JSON.parse(team_i_j[0]).difficulty_score + " double-border-" + JSON.parse(team_i_j[0]).Use_Not_Use}>
                                                                { team_i_j.map( (team: any) => {
                                                                    var num_teams = team_i_j.length;
                                                                    var json_team_data = JSON.parse(team); 
                                                                    return <div className={"min-width color-" + json_team_data.difficulty_score + " multiple-fixtures height-" + num_teams.toString() }>
                                                                        { json_team_data.opponent_team_name == '-' ? "Blank" : 
                                                                            json_team_data.opponent_team_name + " (" + json_team_data.H_A + ")"
                                                                        }
                                                                    </div>

                                                                })}
                                                            </td> :
                                                            <td scope="col" className={" min-width no-padding double-border-" + JSON.parse(team_i_j[0]).Use_Not_Use}>
                                                                { team_i_j.map( (team: any) => {
                                                                    var num_teams = team_i_j.length;
                                                                    var json_team_data = JSON.parse(team); 
                                                                    return <div className={"min-width color-" + json_team_data.difficulty_score + " multiple-fixtures height-" + num_teams.toString() }>
                                                                        { json_team_data.opponent_team_name == '-' ? "Blank" : 
                                                                            json_team_data.opponent_team_name + " (" + json_team_data.H_A + ")"
                                                                        }
                                                                    </div>

                                                                })}
                                                            </td>
                                                        }
                                                        </>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p> Avg. FDR score: <b> {row.avg_Score} </b></p>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>

     </div>  </>

};

export default RotationPlanner;
