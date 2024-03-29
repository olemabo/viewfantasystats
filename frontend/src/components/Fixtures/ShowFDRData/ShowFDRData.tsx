import { SimpleTeamFDRDataModel, TeamFDRDataModel } from '../../../models/fixturePlanning/TeamFDRData';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { contrastingColor } from '../../../utils/findContrastColor';
import { convertFDRtoHex } from '../../../utils/convertFDRtoHex';
import { lowerCaseText } from '../../../utils/lowerCaseText';
import Message from '../../Shared/Messages/Messages';
import React, { FunctionComponent } from 'react';
import Popover from '../../Shared/Popover/Popover';
import './ShowFDRData.scss';

type ShowFDRProps = {
    content: any;
    fdrData: SimpleTeamFDRDataModel[] | TeamFDRDataModel[];
    kickOffTimes: KickOffTimesModel[];
    allowToggleBorder?: boolean;
    fdrToColor?: any;
    warningMessage: string;
}

export const ShowFDRData : FunctionComponent<ShowFDRProps> = (props) => {
    
    function toggleBorderLine(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) {
        const temp: any = e.target;

        if (temp?.tagName == "svg" || temp?.tagName == "path" ) return;

        if (!props.allowToggleBorder) { return; }
        let classList = e.currentTarget.classList;

        if (classList.contains("double-border-0")) {
            e.currentTarget.classList.replace("double-border-0", "double-border-1")
        }
        else if (classList.contains("double-border-1")) {
            e.currentTarget.classList.replace("double-border-1", "double-border-0")
        }
    }

    function checkIfAllTeamsAreToggledOff() {
        var toggledOff = 0;
        props.fdrData.map(team => {
            toggledOff += team.checked ? 1 : 0;
        })
        
        return toggledOff === 0;
    }

    return <>
        { checkIfAllTeamsAreToggledOff() ? 
        <Message messageType='warning' messageText={props.warningMessage} />
         :
        <div className="container-fdr fdr">
            <div className="fdr-table">
                <div className="fdr-team-names">
                    <table className='table-adjustment'>
                        <tbody id="fdr-names">
                            <tr>
                                <td className="name-column-top-corner">
                                    {/* {props.content.Fixture.team} */}
                                </td>
                            </tr>
                            { props.fdrData.map(fdr => (
                                <>
                                { fdr.checked && (
                                    <tr>
                                        <td className='name-column'>
                                            <div>{lowerCaseText(fdr.team_name)}</div>
                                        </td>
                                    </tr>
                                )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="fdr-team-difficulty">
                    <table className='table-adjustment'>
                        <tbody>
                            <tr className="fdr-row-gws">
                                { props.kickOffTimes.map(gw =>
                                    <th key={gw.gameweek}>{props.content.General.round_short}{ gw.gameweek}
                                        <div className="day-month">
                                            { gw.day_month }
                                        </div>
                                    </th>
                                )}
                            </tr>
                            { props.fdrData.map( (fdr, idx) => 
                                <>
                                    { fdr.checked && (
                                    <tr key={"fdr-row-" + fdr.team_name} id={"fdr-row-" + fdr.team_name}>
                                        { fdr.FDR.map(f => (
                                            <td onClick={(e) => toggleBorderLine(e)} scope='col' className={''
                                            + (f.fdr_gw_i.length == 1 ? " colors-" + f.fdr_gw_i[0].difficulty_score + " " : " no-padding ") + 'double-border-' + f.fdr_gw_i[0].Use_Not_Use  }>
                                                { f.fdr_gw_i.map(g => (
                                                    <div style={{
                                                        backgroundColor: convertFDRtoHex(f.fdr_gw_i[0].difficulty_score, props.fdrToColor),
                                                        position: g.message ? "relative" : "inherit",
                                                        color: contrastingColor(convertFDRtoHex(f.fdr_gw_i[0].difficulty_score, props.fdrToColor))}} 
                                                        className={'color-' + Number(g.difficulty_score).toFixed(0) + ' height-' + f.fdr_gw_i.length + 
                                                        (f.fdr_gw_i.length > 1 ? ' multiple-fixtures' : '') + ' ' + 
                                                        (f.fdr_gw_i[0].double_blank?.includes("-") ? "possible-blank" : "")}>
                                                        { g.message && 
                                                        <Popover 
                                                            id={`rotations-planner-id-${g.opponent_team_name}-${g.H_A}`}
                                                            title=""
                                                            html_title={props.content.Fixture.uncertain_match}
                                                            algin_left={false}
                                                            popover_title={""} // fdr.team_name + ' - ' + g.opponent_team_name  
                                                            iconSize={14}
                                                            className={ idx > (props.fdrData?.length - 4) ? 'bottom-position' : ''}
                                                            topRigthCornerInDiv={true}
                                                            iconpostition={[0, 0, 0, 0]}
                                                            popover_text={ g.message }>
                                                        </Popover> }
                                                        { g.opponent_team_name == '-' ? "Blank" : (g.opponent_team_name + " (" + g.H_A +  ")") }
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
                {/* <div className='last'>
                    <table>
                        <tbody id="fdr-names">
                                <tr>
                                    <th className="name-column-top-corner">
                                    </th>
                                </tr>
                                { props.fdrData.map(fdr => (
                                    <>
                                    { fdr.checked && (
                                        <tr>
                                            <td className='name-column'>
                                                <div>{fdr.fdr_total_score}</div>
                                            </td>
                                        </tr>
                                    )}
                                    </>
                                ))}
                            </tbody>
                    </table>
                </div> */}
            </div>
        </div>
    }
    </>
};

export default ShowFDRData;

ShowFDRData.defaultProps = {
    fdrToColor: null,
    allowToggleBorder: true,
}