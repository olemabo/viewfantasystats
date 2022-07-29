import React, { useState, useEffect, FunctionComponent } from 'react';
import { FDRData } from "./FdrModel";
import "./fixturePlanner.scss";
import axios from 'axios';
import { FilterButton } from '../../Shared/FilterButton/FilterButton';
import { Button } from '../../Shared/Button/Button';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
    FDR: FDR_gw_i [];
}

interface TeamName {
    team_name: string;
    checked: boolean;
}

type LanguageProps = {
    content: any;
}

export const FixturePlanner : FunctionComponent<LanguageProps> = (props) => {
    const fixture_planner_kickoff_time_api_path = "/fixture-planner/get-kickoff-times/";
    const fixture_planner_api_path = "/fixture-planner/get-all-fdr-data/";
    const min_gw = 1;
    const max_gw = 38;

    const empty: TeamData[] = [ { team_name: "-", FDR: [], checked: true}];
    const emptyFDRList: FDRData[] = [{ gw: "0", oppTeamDifficultyScore: "0", oppTeamHomeAwayList: "0", oppTeamNameList: "0", team_name: "0", team_short_name: "0" }];
    const emptyGwDate: KickOffTimes[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];
    const emptyTeamNames: TeamName[] = [{team_name: "empty", checked: false}];

    const [ teamNames, setTeamNames ] = useState(emptyTeamNames);
    const [ fdrDataAllTeams, setFdrDataAllTeams ] = useState(emptyFDRList);
    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty);
    const [ fdrDataAllTeamsNew, setFdrDataAllTeamsNew] = useState(empty);
    
    const [ kickOffTimes, setKickOffTimes ] = useState(emptyGwDate);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);


    const [ gwStart, setGwStart ] = useState(min_gw);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);

    useEffect(() => {
        // Get kickoff time data from the API
        axios.get(fixture_planner_kickoff_time_api_path).then(x => {
            if (x.data?.length > 0) {
                let temp_KickOffTimes: KickOffTimes[] = [];
                x.data.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimes(temp_KickOffTimes);
                setKickOffTimesToShow(temp_KickOffTimes);
            }
        })

        // Get fdr data from the API
        let body = { 
            start_gw: min_gw,
            end_gw: max_gw,
            min_num_fixtures: '1',
            combinations: 'FDR'
        };
        
        extractFDRData(body)
    }, []);


    function updateFDRData() {
        var body = {
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: '1',
            combinations: 'FDR'
        };

        extractFDRData(body);
    }

    function extractFDRData(body: any) {

        setKickOffTimesToShow(kickOffTimes.slice(gwStart - 1, gwEnd));

        // Get fdr data from api
        axios.post(fixture_planner_api_path, body).then(x => {
            let apiFDRList: TeamData[] = [];
            let tempTeamNames: TeamName[] = [];

            x.data.forEach((team: any[]) => {
                let team_name = JSON.parse(team[0][0][0]).team_name;
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
                let tempTeamData = { team_name: team_name, FDR: FDR_gw_i, checked: true}
                apiFDRList.push(tempTeamData);
            });

            setFdrDataAllTeamsNew(apiFDRList);
            setFdrDataToShow(apiFDRList);
            setTeamNames(tempTeamNames);
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
            temp.push({ team_name: x.team_name, FDR: x.FDR, checked: checked});
        });
        // setTeamNames(tempTeamNames);
        setFdrDataToShow(temp);
    }

    return <>
    <div className='fixture-planner-container' id="fixture-planner-container">
        <h1>{props.content.Fixture.FixturePlanner.title}</h1>
        <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
            {props.content.Fixture.gw_start}
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
            {props.content.Fixture.gw_end}
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
            <input className="submit" type="submit" value={props.content.General.search_button_name}>
            </input>
        </form>

        <Button buttonText={props.content.Fixture.filter_button_text} 
                    icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
                    onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} />


        { fdrDataToShow != null && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "empty" && showTeamFilters &&
            <div className='filter-teams-container'>
                <div className='filter-teams-list'>
                { fdrDataToShow.map(team_name =>
                    <FilterButton fontColor={"1"} backgroundColor={"0"}  onclick={(e: any) => toggleCheckbox(e)} buttonText={team_name.team_name} checked={team_name.checked} />
                )}
                </div>
            </div>
        }

        { fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "-" && kickOffTimesToShow.length > 0 && kickOffTimesToShow[0].gameweek != 0 && (
            <div>
                <div className="container-fdr">
                    <div id="fdr-table" className="container-rotation">
                        <div id="fdr-team-names">
                            <table>
                                <tbody id="fdr-names">
                                    <tr>
                                        <td className="name-column min-width">
                                            {props.content.Fixture.team}
                                        </td>
                                    </tr>
                                    { fdrDataToShow.map(fdr => (
                                        <>
                                        { fdr.checked && (
                                            <tr>
                                                <td className='name-column min-width'>
                                                    {fdr.team_name}
                                                </td>
                                            </tr>
                                        )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div id="fdr-team-difficulty">
                            <table>
                                <tbody id="fdr-gws">
                                    <tr id="fdr-row-gws">
                                        { kickOffTimesToShow.map(gw =>
                                            <th>{props.content.General.round_short}{ gw.gameweek}
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
                                                    <td scope='col' className={'min-width'
                                                    + (f.fdr_gw_i.length == 1 ? " color-" + f.fdr_gw_i[0].difficulty_score + " " : " no-padding ") + 'double-border-' + f.fdr_gw_i[0].Use_Not_Use  }>

                                                        { f.fdr_gw_i.map(g => (
                                                            <div className={'min-width color-' + g.difficulty_score + ' multiple-fixtures height-' + f.fdr_gw_i.length}>
                                                                { g.opponent_team_name == '-' ? "Blank" : (g.opponent_team_name + " (" + g.H_A + ")") }
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

export default FixturePlanner;




// axios.post(fixture_planner_api_path, body).then(x => {
        //     console.log(x.data);
        //     var apiFDRList: FDRData[] = [];
        //     x.data.forEach((x: { fields: any; })  => apiFDRList.push( {gw: x.fields.gw,
        //         oppTeamDifficultyScore: x.fields.oppTeamDifficultyScore,
        //         oppTeamHomeAwayList: x.fields.oppTeamHomeAwayList,
        //         oppTeamNameList: x.fields.oppTeamNameList,
        //         team_name: x.fields.team_name,
        //         team_short_name: x.fields.team_short_name}));
        //     setFdrDataAllTeams(apiFDRList);
        //     setFdrDataToShow(apiFDRList);
        //     setgwNumbers([{gw: 1, day_month: "21. Jan"}, {gw: 2, day_month: "21. Jan"}, {gw: 3, day_month: "21. Jan"} ]);
        // })