import { SimpleTeamFDRDataModel, TeamFDRDataModel } from '../../../models/fixturePlanning/TeamFDRData';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import React, { FunctionComponent } from 'react';

type ShowFDRProps = {
    content: any;
    fdrData: SimpleTeamFDRDataModel[] | TeamFDRDataModel[];
    kickOffTimes: KickOffTimesModel[];
    toggleBorder: any;
}

export const ShowFDRData : FunctionComponent<ShowFDRProps> = (props) => {
    
    return <>
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
                            { props.fdrData.map(fdr => (
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
                                { props.kickOffTimes.map(gw =>
                                    <th>{props.content.General.round_short}{ gw.gameweek}
                                        <div className="day_month">
                                            { gw.day_month }
                                        </div>
                                    </th>
                                )}
                            </tr>
                            { props.fdrData.map(fdr => 
                                <>
                                    { fdr.checked && (
                                    <tr id={"fdr-row-" + fdr.team_name}>
                                        { fdr.FDR.map(f => (
                                            <td onClick={(e) => props.toggleBorder(e)} scope='col' className={'min-width'
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
    </>
};

export default ShowFDRData;