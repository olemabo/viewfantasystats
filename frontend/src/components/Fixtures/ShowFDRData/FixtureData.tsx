import { TeamNamePlayerName } from '../../../models/fixturePlanning/TeamNamePlayerName';
import { FDR_GW_i, TeamIdFDRModel } from '../../../models/fixturePlanning/TeamFDRData';
import { defenceNumber, fdrNumber, offenceNumber } from '../../../constants/fdr';
import ToggleButton from '../../Shared/ToggleButton/ToggleButton';
import React, { FunctionComponent, useState } from 'react';
import Popover from '../../Shared/Popover/Popover';
import Button from '../../Shared/Button/Button';
import './ShowFDRData.scss';

type FixtureDataProps = {
    content: any;
    playerData: TeamNamePlayerName[];
    fixtureData: TeamIdFDRModel[][];
    allowToggleBorder?: boolean;
    gwStart: number;
    postionName: string;
    gwEnd: number;
    positionNumber: number;
    defaultFdrType?: number;
    rowKey?: number,
    openModal: (position: number) => void;
    removePlayer: (position: number, playerName: string) => void,
}

export const FixtureData : FunctionComponent<FixtureDataProps> = ({
    content,
    playerData,
    fixtureData,
    gwStart,
    gwEnd,
    postionName,
    rowKey,
    allowToggleBorder = true,
    defaultFdrType = fdrNumber,
    positionNumber,
    openModal,
    removePlayer,
}) => {
    const [ fdrType, SetFdrType ] = useState(defaultFdrType);
    
    function toggleBorderLine(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) {
        if (!allowToggleBorder) { return; }
        let classList = e.currentTarget.classList;

        const temp: any = e.target;
        if (temp?.tagName == "svg" || temp?.tagName == "path" ) return;
        
        if (classList.contains("show-color")) {
            e.currentTarget.classList.replace("show-color", "greyed-out")
        }
        else if (classList.contains("greyed-out")) {
            e.currentTarget.classList.replace("greyed-out", "hide-game")
        }
        else if (classList.contains("hide-game")) {
            e.currentTarget.classList.replace("hide-game", "show-color")
        }
    }

    function getFixtureData(team_id: string): FDR_GW_i[] {
        for (let i = 0; i < fixtureData[fdrType].length; i++) {
            if (fixtureData[fdrType][i].team_id.toString() === team_id.toString()) return fixtureData[fdrType][i].FDR;
        }

        return fixtureData[fdrType][fdrNumber].FDR;
    }

    const hasOnlyOneFdrType = fixtureData[defenceNumber].length === 0 && fixtureData[offenceNumber].length === 0;

    return <>
        <div key={`fixture-data-${rowKey}`} className='fixed-column'>
            <div className='postition-container'>
                <span className='text'>{postionName}</span>
                <div className='button-group'>
                    {/* { !hasOnlyOneFdrType && 
                        <ToggleButton 
                            small={true}
                            onclick={(fdrType: string) => SetFdrType(parseInt(fdrType))} 
                            toggleButtonName="FDR-toggle"
                            defaultToggleList={[ 
                                { name: content.General.defence, value: defence_number.toString(), checked: fdrType===defence_number, classname: "defensiv" },
                                { name: "FDR", value: fdrNumber.toString(), checked: fdrType===fdrNumber, classname: "fdr" },
                                { name: content.General.offence, value: ofence_number.toString(), checked: fdrType===ofence_number, classname: "offensiv"}
                            ]} /> } */}
                <div> 
                    <Button 
                        buttonText={content.General.add_player} 
                        iconClass='fa fa-plus'
                        color='white'
                        small={true}
                        onclick={() => openModal(positionNumber)}/>
                </div>
            </div>
        </div>
        </div>
        { playerData.map(player => (<>
            <tr key={player.player_name} id={`fdr-row-${player.team_id}`}>
                <td className='fixed-column'>
                    <span>{player.player_name.length > 12 ? player.player_name.substring(0, 11) + "..." : player.player_name}</span>
                    {/* <button title={content.General.removePlayer} className='fa fa-arrow-up remove-player-btn' onClick={ () => removePlayer(positionNumber ,player.player_name) }></button> */}
                    <button title={content.General.removePlayer} className='fa fa-minus remove-player-btn' onClick={ () => removePlayer(positionNumber ,player.player_name) }></button>
                    {/* <button title={content.General.removePlayer} className='fa fa-arrow-down remove-player-btn' onClick={ () => removePlayer(positionNumber ,player.player_name) }></button> */}
                </td>
            { getFixtureData(player.team_id).slice(gwStart - 1, gwEnd).map((team, idx) => (
                    <td
                        key={`td-fixture-${idx}-${player.player_name}-${team.fdr_gw_i.length}`}
                        onClick={(e) => toggleBorderLine(e)} 
                        scope='col' 
                        className={''
                    + (team.fdr_gw_i.length == 1 ? " color-" + Number(team.fdr_gw_i[0].difficulty_score).toFixed(0) + " " : " multiple no-padding ") + ' show-color' }>
                        { team.fdr_gw_i.map(g => (<>
                            <div 
                                style={{ position: g.message ? "relative" : "inherit" }}
                                className={`height-${team.fdr_gw_i.length} color-${Number(g.difficulty_score).toFixed(0)}
                                ${(team.fdr_gw_i.length > 1 ? ' multiple-fixtures' : '')} 
                                ${(team.fdr_gw_i[0].double_blank?.includes("-") ? "possible-blank" : "")}`}>
                                
                                { g.message && 
                                    <Popover 
                                        id={`rotations-planner-id-${g.opponent_team_name}-${g.H_A}-${player.player_name}`}
                                        title=""
                                        htmlTitle={content.Fixture.uncertain_match}
                                        alignLeft={false}
                                        popoverTitle={""} // fdr.team_name + ' - ' + g.opponent_team_name  
                                        iconSize={14}
                                        topRightCornerInDiv={true}
                                        className={ positionNumber === 3 ? 'bottom-position' : ''}
                                        iconPosition={[0, 0, 0, 0]}
                                        popoverText={ g.message }>
                                    </Popover> }
                                
                                { g.opponent_team_name == '-' ? "Blank" : `${g.opponent_team_name} (${g.H_A})`}
                            </div>
                        </>))}
                    </td>
                ))}
            </tr>
            </>
        ))}
    </>
};

export default FixtureData;