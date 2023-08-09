import { RotationPlannerTeamInfoModel } from '../../../models/fixturePlanning/RotationPlannerTeamInfo';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { lowerCaseText } from '../../../utils/lowerCaseText';
import React, { FunctionComponent, useState } from 'react';
import '../ShowFDRData/ShowFDRData.scss';
import Pagination from 'rc-pagination';
import './ShowRotationData.scss';
import { FDRData } from '../../../models/fixturePlanning/TeamFDRData';

type ShowRotationProps = {
    content: any;
    fdrData: RotationPlannerTeamInfoModel[];
    kickOffTimes: KickOffTimesModel[];
}

export const ShowRotationData : FunctionComponent<ShowRotationProps> = ({
    content,
    fdrData,
    kickOffTimes,
}) => {

    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const numberOfHitsPerPagination = 10;
    const numberOfHits = fdrData?.length;
    
    function paginationUpdate(pageNumber: number) {
        setPaginationNumber(pageNumber);
    }

    function getFDRDiv(fdrData: FDRData, num_teams: number) {
        return <div className={ "color-" + Number(fdrData.difficulty_score).toFixed(0) + " height-" + num_teams.toString() + (num_teams > 1 ? ' multiple-fixtures' : '') }>
            { fdrData.opponent_team_name == '-' ? "Blank" : 
                fdrData.opponent_team_name + " (" + fdrData.H_A + ")"
            }
        </div>
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
                                        {/* {content.Fixture.team} */}
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
                                                        return getFDRDiv(json_team_data, num_teams);
                                                    })}
                                                </td> :
                                                <td 
                                                    scope="col" 
                                                    className={" no-padding double-border-" + JSON.parse(team_i_j[0]).Use_Not_Use}>
                                                    { team_i_j.map( (team: any) => {
                                                        var num_teams = team_i_j.length;
                                                        var json_team_data = JSON.parse(team); 
                                                        return getFDRDiv(json_team_data, num_teams);
                                                    })}
                                                </td>}
                                            </>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <caption>
                            {content.Fixture.RotationPlanner.avg_fdr_score} <b> {row.avg_Score.toFixed(2)} </b>
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