import { SimpleTeamFDRDataModel, TeamFDRDataModel } from '../../../models/fixturePlanning/TeamFDRData';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import React, { FunctionComponent } from 'react';
import { contrastingColor } from '../../../utils/findContrastColor';
import { convertFDRtoHex } from '../../../utils/convertFDRtoHex';
import './ShowFDRData.scss';

type ShowFDRProps = {
    content: any;
    fdrData: SimpleTeamFDRDataModel[] | TeamFDRDataModel[];
    kickOffTimes: KickOffTimesModel[];
    allowToggleBorder?: boolean;
    fdrToColor?: any;
}

export const ShowFDRData : FunctionComponent<ShowFDRProps> = (props) => {
    
    function toggleBorderLine(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) {
        if (!props.allowToggleBorder) { return; }
        let classList = e.currentTarget.classList;
        if (classList.contains("double-border-0")) {
            e.currentTarget.classList.replace("double-border-0", "double-border-1")
        }
        else if (classList.contains("double-border-1")) {
            e.currentTarget.classList.replace("double-border-1", "double-border-0")
        }
    }

    return <>
        <div className="container-fdr">
            <div className="fdr-table">
                <div className="fdr-team-names">
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
                <div className="fdr-team-difficulty">
                    <table>
                        <tbody>
                            <tr className="fdr-row-gws">
                                { props.kickOffTimes.map(gw =>
                                    <th>{props.content.General.round_short}{ gw.gameweek}
                                        <div className="day-month">
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
                                            <td onClick={(e) => toggleBorderLine(e)} scope='col' style={{backgroundColor: convertFDRtoHex(f.fdr_gw_i[0].difficulty_score, props.fdrToColor)}} className={'min-width'
                                            + (f.fdr_gw_i.length == 1 ? " color-" + f.fdr_gw_i[0].difficulty_score + " " : " no-padding ") + 'double-border-' + f.fdr_gw_i[0].Use_Not_Use  }>
                                                { f.fdr_gw_i.map(g => (
                                                    <div style={{backgroundColor: convertFDRtoHex(f.fdr_gw_i[0].difficulty_score, props.fdrToColor), color: contrastingColor(convertFDRtoHex(f.fdr_gw_i[0].difficulty_score, props.fdrToColor))}} className={'min-width color-' + g.difficulty_score + ' multiple-fixtures height-' + f.fdr_gw_i.length}>
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

ShowFDRData.defaultProps = {
    fdrToColor: null,
    allowToggleBorder: true,
}