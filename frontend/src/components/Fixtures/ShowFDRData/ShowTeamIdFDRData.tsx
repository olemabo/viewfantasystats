import { TeamNamePlayerName } from '../../../models/fixturePlanning/TeamNamePlayerName';
import { defence_number, fdr_number, ofence_number } from '../../../constants/fdr';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { TeamIdFDRModel } from '../../../models/fixturePlanning/TeamFDRData';
import React, { FunctionComponent } from 'react';
import FixtureData from './FixtureData';
import './ShowTeamIdFDRData.scss';

type ShowTeamIDFDRProps = {
    content: any;
    playerData: TeamNamePlayerName[][];
    fixtureData: TeamIdFDRModel[][];
    kickOffTimes: KickOffTimesModel[];
    gwStart: number;
    gwEnd: number;
    allowToggleBorder?: boolean;
    openModal: (position: number) => void;
    removePlayer: (position: number, playerName: string) => void;
};

export const ShowTeamIDFDRData : FunctionComponent<ShowTeamIDFDRProps> = ({
    content,
    playerData,
    fixtureData,
    kickOffTimes,
    gwStart,
    gwEnd,
    openModal,
    removePlayer,
    allowToggleBorder = true,
}) => {

    const postitionNames = [
        content.General.goalkeepers, 
        content.General.defenders, 
        content.General.midfielders, 
        content.General.forwards, 
    ];

    const defaultDefensive = fixtureData[defence_number].length === 0 ? fdr_number : defence_number;
    const defaultOffensive = fixtureData[ofence_number].length === 0 ? fdr_number : ofence_number;
    const defaultFdrType = [defaultDefensive, defaultDefensive, defaultOffensive, defaultOffensive];

    const positionNumber = [0, 1, 2, 3 ];

    return <>
        <div className="fdr-container">
            <table style={{ margin: "0 auto"}}>
                <thead>
                    <tr>
                        <th className='fixed-column' />
                        { kickOffTimes.slice(gwStart - 1, gwEnd).map(gw =>
                            <th>{content.General.round_short}{ gw.gameweek}
                                <span className="day-month">
                                    { gw.day_month }
                                </span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                { playerData.map( (player_i, idx) => (
                    <FixtureData 
                        gwStart={gwStart}
                        gwEnd={gwEnd}
                        content={content}
                        playerData={player_i}
                        fixtureData={fixtureData}
                        postionName={postitionNames[idx]}
                        defaultFdrType={defaultFdrType[idx]}
                        positionNumber={positionNumber[idx]}
                        allowToggleBorder={allowToggleBorder}
                        openModal={(postionNumber: number) => openModal(postionNumber)}
                        removePlayer={(postionNumber: number, playerName: string) => removePlayer(postionNumber, playerName)}
                    />
                ))}
                </tbody>
            </table>
        </div>
    </>
};

export default ShowTeamIDFDRData;