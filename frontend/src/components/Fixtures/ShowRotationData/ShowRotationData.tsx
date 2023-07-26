import { RotationPlannerTeamInfoModel } from '../../../models/fixturePlanning/RotationPlannerTeamInfo';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { lowerCaseText } from '../../../utils/lowerCaseText';
import React, { FunctionComponent, useState } from 'react';
import '../ShowFDRData/ShowFDRData.scss';
import Pagination from 'rc-pagination';
import './ShowRotationData.scss';

type ShowRotationProps = {
    content: any;
    fdrData: RotationPlannerTeamInfoModel[];
    kickOffTimes: KickOffTimesModel[];
    fdrToColor?: any;
}

export const ShowRotationData : FunctionComponent<ShowRotationProps> = ({
    content,
    fdrData,
    kickOffTimes,
    fdrToColor = null
}) => {

    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const [ numberOfHitsPerPagination, setNumberOfHitsPerPagination ] = useState(10);
    const [ numberOfHits, setNumberOfHits ] = useState(fdrData?.length);
    
    function paginationUpdate(pageNumber: number) {
        setPaginationNumber(pageNumber);
    }
    
    return <>
    <div id="data-box" className="text-center mt-3">
        <div className="big-container">
            <div className="container-rotation fdr">
                <div>
                    { fdrData.slice( (pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination).map(row =><>
                        <table className="rotation">
                            <tbody>
                                <tr className="fdr-row-gws">
                                    <td className="name-column-top-corner">
                                        {content.Fixture.team}
                                    </td>
                                    { kickOffTimes.map(gw =>
                                        <th>{content.General.round_short}{gw.gameweek}
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
                                                <td className="name-column">
                                                    { lowerCaseText(JSON.parse(team_i_j[0]).team_name) }
                                                </td>
                                            )}
                                            { team_i_j.length == 1 ?
                                                <td 
                                                    scope="col" 
                                                    className={" double-border-" + JSON.parse(team_i_j[0]).Use_Not_Use}>
                                                    { team_i_j.map( (team: any) => {
                                                        var num_teams = team_i_j.length;
                                                        var json_team_data = JSON.parse(team); 
                                                        return <div 
                                                            className={"color-" + json_team_data.difficulty_score + " height-" + num_teams.toString() + (num_teams > 1 ? ' multiple-fixtures' : '') }>
                                                            { json_team_data.opponent_team_name == '-' ? "Blank" : 
                                                                json_team_data.opponent_team_name + " (" + json_team_data.H_A + ")"
                                                            }
                                                        </div>

                                                    })}
                                                </td> :
                                                <td 
                                                    scope="col" 
                                                    className={" no-padding double-border-" + JSON.parse(team_i_j[0]).Use_Not_Use}>
                                                    { team_i_j.map( (team: any) => {
                                                        var num_teams = team_i_j.length;
                                                        var json_team_data = JSON.parse(team); 
                                                        return <div className={"color-" + json_team_data.difficulty_score + " height-" + num_teams.toString() + (num_teams > 1 ? ' multiple-fixtures' : '') }>
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
                        <caption style={{display: 'block'}}>
                            <p> {content.Fixture.RotationPlanner.avg_fdr_score} <b> {row.avg_Score} </b></p>
                        </caption>
                    </>)}
                    <Pagination 
                        className="ant-pagination" 
                        onChange={(number) => paginationUpdate(number)}
                        defaultCurrent={1} 
                        defaultPageSize={numberOfHitsPerPagination}  
                        total={numberOfHits} /> 
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default ShowRotationData;