import { TeamNamePlayerName } from '../../../models/fixturePlanning/TeamNamePlayerName';
import { FDR_GW_i, TeamIdFDRModel } from '../../../models/fixturePlanning/TeamFDRData';
import React, { FunctionComponent, useState } from 'react';
import './ShowFDRData.scss';
import ToggleButton from '../../Shared/ToggleButton/ToggleButton';
import Button from '../../Shared/Button/Button';

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
    allowToggleBorder = true,
    defaultFdrType = 0,
    positionNumber,
    openModal,
    removePlayer,
}) => {
    const [ fdrType, SetFdrType ] = useState(defaultFdrType);
    
    function toggleBorderLine(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) {
        if (!allowToggleBorder) { return; }
        let classList = e.currentTarget.classList;
        
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

    function getFixtureData(team_short_name: string): FDR_GW_i[] {
        for (let i = 0; i < fixtureData[fdrType].length; i++) {
            if (fixtureData[fdrType][i].team_name_short === team_short_name) return fixtureData[fdrType][i].FDR;
        }

        return fixtureData[fdrType][0].FDR;
    }


    return <>
        <div className='fixed-column'>
            <div className='postition-container'>
                <span className='text'>{postionName}</span>
                <div className='button-group'>
                    <ToggleButton 
                        small={true}
                        onclick={(fdrType: string) => SetFdrType(parseInt(fdrType))} 
                        toggleButtonName="FDR-toggle"
                        defaultToggleList={[ 
                            { name: "Defensivt", value: "1", checked: fdrType===1, classname: "defensiv" },
                            { name: "FDR", value: "0", checked: fdrType===0, classname: "fdr" },
                            { name: "Offensivt", value: "2", checked: fdrType===2, classname: "offensiv"}
                        ]}
                    />
                    <div>
                    <Button 
                        buttonText={content.General.add_player} 
                        icon_class='fa fa-plus'
                        color='white'
                        small={true}
                        onclick={() => openModal(positionNumber)}/></div>
                </div>
            </div>
        </div>
        { playerData.map(player => (<>
            <tr id={`fdr-row-${player.team_name_short}`}>
                <td className='fixed-column'>
                    <span>{player.player_name.length > 12 ? player.player_name.substring(0, 11) + "..." : player.player_name}</span>
                    {/* <button title={content.General.removePlayer} className='fa fa-arrow-up remove-player-btn' onClick={ () => removePlayer(positionNumber ,player.player_name) }></button> */}
                    <button title={content.General.removePlayer} className='fa fa-minus remove-player-btn' onClick={ () => removePlayer(positionNumber ,player.player_name) }></button>
                    {/* <button title={content.General.removePlayer} className='fa fa-arrow-down remove-player-btn' onClick={ () => removePlayer(positionNumber ,player.player_name) }></button> */}
                </td>
            { getFixtureData(player.team_name_short).slice(gwStart - 1, gwEnd).map(team => (
                    <td onClick={(e) => toggleBorderLine(e)} scope='col' className={''
                    + (team.fdr_gw_i.length == 1 ? " color-" + team.fdr_gw_i[0].difficulty_score + " " : " multiple no-padding ") + ' show-color' }>
                        { team.fdr_gw_i.map(g => (
                            <div 
                                className={`height-${team.fdr_gw_i.length} 
                                ${(team.fdr_gw_i.length > 1 ? ' multiple-fixtures' : '')} 
                                ${(team.fdr_gw_i[0].double_blank?.includes("-") ? "possible-blank" : "")}`}>
                                { g.opponent_team_name == '-' ? "Blank" : `${g.opponent_team_name} (${g.H_A})`}
                            </div>
                        ))}
                    </td>
                ))}
            </tr>
            </>
        ))}
    </>
};

export default FixtureData;