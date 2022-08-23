import { RotationPlannerTeamInfoModel } from '../../../models/fixturePlanning/RotationPlannerTeamInfo';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import React, { FunctionComponent } from 'react';

import { contrastingColor } from '../../../utils/findContrastColor';
import { convertFDRtoHex } from '../../../utils/convertFDRtoHex';
import './ShowRotationData.scss';
import '../ShowFDRData/ShowFDRData.scss';

type ShowRotationProps = {
    content: any;
    fdrData: RotationPlannerTeamInfoModel[];
    kickOffTimes: KickOffTimesModel[];
    fdrToColor?: any;
}

export const ShowRotationData : FunctionComponent<ShowRotationProps> = (props) => {
    
    return <>
    <div id="data-box" className="text-center mt-3">
        <div className="big-container">
            <div className="container-rotation">
                <div>
                    { props.fdrData.map(row =><>
                        <table className="rotation">
                            <tbody>
                                <tr>
                                    <th className="name-column">
                                        {props.content.Fixture.team}
                                    </th>
                                    { props.kickOffTimes.map(gw =>
                                        <th>{props.content.General.round_short}{gw.gameweek}
                                            <div className="day-month">
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
                                                <td style={{backgroundColor: convertFDRtoHex(JSON.parse(team_i_j[0]).difficulty_score, props.fdrToColor), color: contrastingColor(convertFDRtoHex(JSON.parse(team_i_j[0]).difficulty_score, props.fdrToColor))}} scope="col" className={" min-width color-" + JSON.parse(team_i_j[0]).difficulty_score + " double-border-" + JSON.parse(team_i_j[0]).Use_Not_Use}>
                                                    { team_i_j.map( (team: any) => {
                                                        var num_teams = team_i_j.length;
                                                        var json_team_data = JSON.parse(team); 
                                                        return <div style={{backgroundColor: convertFDRtoHex(json_team_data.difficulty_score, props.fdrToColor), color: contrastingColor(convertFDRtoHex(json_team_data.difficulty_score, props.fdrToColor))}} className={"min-width color-" + json_team_data.difficulty_score + " multiple-fixtures height-" + num_teams.toString() }>
                                                            { json_team_data.opponent_team_name == '-' ? "Blank" : 
                                                                json_team_data.opponent_team_name + " (" + json_team_data.H_A + ")"
                                                            }
                                                        </div>

                                                    })}
                                                </td> :
                                                <td style={{backgroundColor: convertFDRtoHex(JSON.parse(team_i_j[0]).difficulty_score, props.fdrToColor), color: contrastingColor(convertFDRtoHex(JSON.parse(team_i_j[0]).difficulty_score, props.fdrToColor))}} scope="col" className={" min-width no-padding double-border-" + JSON.parse(team_i_j[0]).Use_Not_Use}>
                                                    { team_i_j.map( (team: any) => {
                                                        var num_teams = team_i_j.length;
                                                        var json_team_data = JSON.parse(team); 
                                                        return <div style={{backgroundColor: convertFDRtoHex(json_team_data.difficulty_score, props.fdrToColor), color: contrastingColor(convertFDRtoHex(json_team_data.difficulty_score, props.fdrToColor))}}  className={"min-width color-" + json_team_data.difficulty_score + " multiple-fixtures height-" + num_teams.toString() }>
                                                            { json_team_data.opponent_team_name == '-' ? "Blank" : 
                                                                json_team_data.opponent_team_name + " (" + json_team_data.H_A + ")"
                                                            }
                                                        </div>
                                                    })}
                                                </td>}
                                            </>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p> {props.content.Fixture.RotationPlanner.avg_fdr_score} <b> {row.avg_Score} </b></p>
                    </>)}
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default ShowRotationData;

ShowRotationData.defaultProps = {
    fdrToColor: null,
}