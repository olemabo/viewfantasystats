import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FDRData } from "./FdrModel"
import "./FixturePlanner.scss";

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
    FDR: FDR_gw_i [];
}

export const FixturePlanner = () => {
    const fixture_planner_api_path = "/fixture-planner/get-all-fdr-data/";
    const fixture_planner_kickoff_time_api_path = "/fixture-planner/get-kickoff-times/";

    const empty: TeamData[] = [ { team_name: "-", FDR: []}];
    const emptyFDRList: FDRData[] = [{ gw: "0", oppTeamDifficultyScore: "0", oppTeamHomeAwayList: "0", oppTeamNameList: "0", team_name: "0", team_short_name: "0" }];
    const emptyGwDate : KickOffTimes[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];

    const [ fdrDataAllTeams, setFdrDataAllTeams ] = useState(emptyFDRList);
    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty);
    const [ kickOffTimes, setKickOffTimes ] = useState(emptyGwDate);
    const [ fdrDataAllTeamsNew, setFdrDataAllTeamsNew] = useState(empty);

    useEffect(() => {

        // Get kickoff time data from api
        axios.get(fixture_planner_kickoff_time_api_path).then(x => {
            if (x.data?.length > 0) {
                var temp_KickOffTimes: KickOffTimes[] = [];
                x.data.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimes(temp_KickOffTimes);
            }
        })

        var body = {
            start_gw: '1',
            end_gw: '38',
            min_num_fixtures: '1',
            combinations: 'FDR'
        };
        // Get fdr data from api
        axios.post(fixture_planner_api_path, body).then(x => {
            var apiFDRList: TeamData[] = [];
            x.data.forEach((team: any[]) => {
                var team_name = JSON.parse(team[0][0][0]).team_name;
                var FDR_gw_i: FDR_gw_i[] = [];
                team.forEach((fdr_for_each_gw: any[]) => {
                    var temp: FDRDataNew[] = [];
                    fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                        var fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                        temp.push({
                            opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                            difficulty_score: fdr_in_gw_i_json.difficulty_score,
                            H_A: fdr_in_gw_i_json.H_A,
                            Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use})
                    });
                    FDR_gw_i.push({fdr_gw_i: temp})
                });
                var tempTeamData = { team_name: team_name, FDR: FDR_gw_i}
                apiFDRList.push(tempTeamData);
            });
            setFdrDataAllTeamsNew(apiFDRList);
            setFdrDataToShow(apiFDRList);
        })
    }, [])

    console.log(kickOffTimes, fdrDataAllTeamsNew, "fdrDataAllTeamsNew", fdrDataToShow.length);

    return <>
     <div className='fixture-planner-container' id="fixture-planner-container">
         <h1>Fixture Planner</h1>
        { fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "-" && kickOffTimes.length > 0 && kickOffTimes[0].gameweek != 0 && (
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
                                    { fdrDataToShow.map(fdr => (
                                        <tr>
                                            <td className='name-column min-width'>
                                                {fdr.team_name}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div id="fdr-team-difficulty">
                            <table>
                                <tbody id="fdr-gws">
                                    <tr id="fdr-row-gws">
                                        { kickOffTimes.map(gw =>
                                            <th className="min-width"> GW { gw.gameweek}
                                                <div className="day_month">
                                                    { gw.day_month }
                                                </div>
                                            </th>
                                        )}
                                    </tr>
                                    { fdrDataToShow.map(fdr => (
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )}
     </div>  </>

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