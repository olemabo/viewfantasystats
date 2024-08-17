import { FunctionComponent } from "react";
import { BonusModel, FixtureModel } from "../../../models/liveFixtures/FixtureModel";
import Popover from "../../Shared/Popover/Popover";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../../Shared/Table/Table";
import { LeagueType, esf, fpl } from "../../../models/shared/LeagueType";
import * as urls from '../../../staticUrls/internalUrls';
import { convertIdentifierToReadableName, convertListToString } from "./liveFixturesUtils";

export const FixtureDetails: FunctionComponent<{ fixture: FixtureModel, fixtureInfoId: string, playerNameMinWidth: number, hasOwnershipData: boolean, leagueType: LeagueType, gameWeeks: any, propsContent: any }> = ({ fixture, fixtureInfoId, playerNameMinWidth, hasOwnershipData, leagueType, gameWeeks, propsContent }) => {
    const renderPlayerData = (players: any[], isHome: boolean) => {
        return (
            <Table tableLayoutType={leagueType}>
                <TableHead tableHeight="compact">
                    <TableRow>
                        <TableCell cellType="head" minWidth={playerNameMinWidth}>{propsContent.General.player}</TableCell>
                        <TableCell cellType="head">
                            <Popover
                                adjustLeftPx="-100px"
                                id={isHome ? 'Mp-home' : 'Mp-away'}
                                title="MP"
                                popoverTitle="Minutes Played"
                                popoverText={propsContent.Popover.minutesPlayed}
                            />
                        </TableCell>
                        <TableCell cellType="head">
                            <Popover
                                adjustLeftPx="-200px"
                                id={isHome ? 'Opta-home' : 'Opta-away'}
                                title={leagueType === fpl ? 'BPS' : 'Bonus'}
                                popoverTitle={leagueType === fpl ? 'BPS' : 'Bonus'}
                                popoverText={leagueType === fpl ? 'Bonus Point System' : 'Bonus'}
                            />
                        </TableCell>
                        <TableCell cellType="head">
                            <Popover
                                adjustLeftPx="-300px"
                                id={isHome ? 'Pts-home' : 'Pts-away'}
                                title="Pts"
                                popoverTitle="Points"
                                popoverText={propsContent.Popover.points}
                            />
                        </TableCell>
                        {hasOwnershipData && (
                            <TableCell cellType="head">
                                <Popover
                                    id={isHome ? 'EO-home' : 'EO-away'}
                                    title="EO"
                                    popoverTitle="Effective Ownership"
                                    popoverText={`${propsContent.Popover.EO} ${gameWeeks.currentGW}.`}
                                >
                                    {propsContent.Popover.moreInfoEO}
                                    <a href={`/${leagueType === esf ? urls.url_eliteserien_player_ownership : urls.url_premier_league_player_ownership}`}>{propsContent.General.here}</a>.
                                </Popover>
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players.filter(p => p.minutes > 0).map(p => (
                        <TableRow key={p.id}>
                            <TableCell cellType="data" minWidth={playerNameMinWidth}>{p.name}</TableCell>
                            <TableCell cellType="data">{p.minutes}</TableCell>
                            <TableCell cellType="data">{p.opta_index.toFixed(leagueType === fpl ? 0 : 0)}</TableCell>
                            <TableCell cellType="data">{p.total_points}</TableCell>
                            {hasOwnershipData && <TableCell cellType="data">{p.EO}</TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    const renderStats = (stats: any[]) => {
        return (
            <Table tableLayoutType={leagueType} className="stats">
                <TableHead tableHeight="compact">
                    <TableRow>
                        <TableCell cellType="head" className="team-col">{fixture.team_h_name}</TableCell>
                        <TableCell cellType="head" />
                        <TableCell cellType="head" className="team-col">{fixture.team_a_name}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stats.map(stat => (
                        (stat?.h?.length > 0 || stat?.a?.length > 0) && stat?.identifier !== 'bps' && (
                            <TableRow key={stat.identifier}>
                                <TableCell cellType="data" className="h">{convertListToString(stat.h)}</TableCell>
                                <TableCell cellType="data" className="identifier">{convertIdentifierToReadableName(stat.identifier, propsContent)}</TableCell>
                                <TableCell cellType="data" className="a">{convertListToString(stat.a)}</TableCell>
                            </TableRow>
                        )
                    ))}
                </TableBody>
            </Table>
        );
    };

    const renderBonus = (bonusList: BonusModel[]) => {
        return (
            <Table tableLayoutType={leagueType} className="bonus-list">
                <TableHead tableHeight="compact">
                    <TableRow>
                        <TableCell cellType="head">{fixture.team_h_name}</TableCell>
                        <TableCell cellType="head">{fixture.team_a_name}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bonusList.map(bonus => (
                        <TableRow key={bonus.home_player_name + bonus.away_player_name}>
                            { bonus.home_opta > 0 && <TableCell cellType="data" className="h">{`${bonus.home_player_name} (${bonus.home_opta.toFixed(0)})`}</TableCell> }
                            { bonus.away_opta > 0 && <TableCell cellType="data" className="a">{`${bonus.away_player_name} (${bonus.away_opta.toFixed(0)})`}</TableCell> }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <>
            <div className="fixture-info-container">
                <div className="home-players">
                    {renderPlayerData(fixture.players_h, true)}
                </div>
                <div className="game-stats">
                    {renderStats(fixture.stats)}
                    {renderBonus(fixture.bonus_list)}
                </div>
                <div className="away-players">
                    {renderPlayerData(fixture.players_a, false)}
                </div>
            </div>
        </>
    );
};
