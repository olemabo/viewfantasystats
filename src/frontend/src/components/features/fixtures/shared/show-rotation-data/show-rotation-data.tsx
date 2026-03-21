import { RotationPlannerTeamInfoModel } from '../../../../../models/fixturePlanning/RotationPlannerTeamInfo';
import { lowerCaseText } from '../../../../../utils/lowerCaseText';
import { FunctionComponent, useState } from 'react';
import { FDRData } from '../../../../../models/fixturePlanning/TeamFDRData';
import { useTranslations } from 'next-intl';
import '../show-fdr-data/show-fdr-data.css'; 
import './show-rotation-data.css';
import { Pagination } from '@/components/shared/pagination/pagination';
import { KickOffTime } from '../../types/kickoff-times.types';

type ShowRotationProps = {
    fdrData: RotationPlannerTeamInfoModel[];
    kickOffTimes: KickOffTime[];
}

export const ShowRotationData : FunctionComponent<ShowRotationProps> = ({
    fdrData,
    kickOffTimes,
}) => {
    const t = useTranslations('General');
    const f = useTranslations('Fixture.RotationPlanner');
    
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
                                    <td className="name-column-top-corner" />
                                    { kickOffTimes.map(gw =>
                                        <th>
                                            {t("round_short")}
                                            {gw.gameweek}
                                            <div className="day-month">
                                                { gw.dayMonth }
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
                            {f("avg_fdr_score")} 
                            <b> {row.avg_Score.toFixed(2)} </b>
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