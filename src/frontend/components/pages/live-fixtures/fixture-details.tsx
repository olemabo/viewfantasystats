"use client";

import {
  BonusModel,
  FixtureModel,
} from "../../../models/liveFixtures/FixtureModel";
import Popover from "../../shared/popover/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../shared/ui/table/Table";
import { LeagueType, esf, fpl } from "../../../models/shared/LeagueType";
import {
  convertIdentifierToReadableName,
  convertListToString,
} from "./liveFixturesUtils";
import { useTranslations } from "next-intl";
import { URLS } from "../../../constants/urls";

type FixtureDetailsProps = {
  gameWeeks: any;
  leagueType: LeagueType;
  hasOwnershipData: boolean;
  playerNameMinWidth: number;
  fixture: FixtureModel;
};

export function FixtureDetails({
  fixture,
  playerNameMinWidth,
  hasOwnershipData,
  leagueType,
  gameWeeks,
}: FixtureDetailsProps) {
  const g = useTranslations("General");
  const p = useTranslations("Popover");
  const t = useTranslations();

  const renderPlayerData = (players: any[], isHome: boolean) => {
    return (
      <Table tableLayoutType={leagueType}>
        <TableHead tableHeight="compact">
          <TableRow>
            <TableCell cellType="head" minWidth={playerNameMinWidth}>
              {g("player")}
            </TableCell>
            <TableCell cellType="head">
              <Popover
                adjustLeftPx="-100px"
                id={isHome ? "Mp-home" : "Mp-away"}
                title="MP"
                popoverTitle="Minutes Played"
                popoverText={p("minutesPlayed")}
              />
            </TableCell>
            <TableCell cellType="head">
              <Popover
                adjustLeftPx="-200px"
                id={isHome ? "Opta-home" : "Opta-away"}
                title={leagueType === fpl ? "BPS" : "Bonus"}
                popoverTitle={leagueType === fpl ? "BPS" : "Bonus"}
                popoverText={
                  leagueType === fpl ? "Bonus Point System" : "Bonus"
                }
              />
            </TableCell>
            <TableCell cellType="head">
              <Popover
                adjustLeftPx="-300px"
                id={isHome ? "Pts-home" : "Pts-away"}
                title="Pts"
                popoverTitle="Points"
                popoverText={p("points")}
              />
            </TableCell>
            {hasOwnershipData && (
              <TableCell cellType="head">
                <Popover
                  id={isHome ? "EO-home" : "EO-away"}
                  title="EO"
                  popoverTitle="Effective Ownership"
                  popoverText={`${p("EO")} ${gameWeeks.currentGW}.`}
                >
                  {p("moreInfoEO")}
                  <a
                    href={`/${leagueType === esf ? URLS.INTERNAL.ELITESERIEN.PLAYER_OWNERSHIP : URLS.INTERNAL.PREMIER_LEAGUE.PLAYER_OWNERSHIP}`}
                  >
                    {g("here")}
                  </a>
                  .
                </Popover>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {players
            .filter((p) => p.minutes > 0)
            .map((p) => (
              <TableRow key={p.id}>
                <TableCell cellType="data" minWidth={playerNameMinWidth}>
                  {p.name}
                </TableCell>
                <TableCell cellType="data">{p.minutes}</TableCell>
                <TableCell cellType="data">
                  {p.opta_index.toFixed(leagueType === fpl ? 0 : 0)}
                </TableCell>
                <TableCell cellType="data">{p.total_points}</TableCell>
                {hasOwnershipData && (
                  <TableCell cellType="data">{p.EO}</TableCell>
                )}
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
            <TableCell cellType="head" className="team-col">
              {fixture.team_h_name}
            </TableCell>
            <TableCell cellType="head" />
            <TableCell cellType="head" className="team-col">
              {fixture.team_a_name}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map(
            (stat) =>
              (stat?.h?.length > 0 || stat?.a?.length > 0) &&
              stat?.identifier !== "bps" && (
                <TableRow key={stat.identifier}>
                  <TableCell cellType="data" className="h">
                    {convertListToString(stat.h)}
                  </TableCell>
                  <TableCell cellType="data" className="identifier">
                    {convertIdentifierToReadableName(stat.identifier, t)}
                  </TableCell>
                  <TableCell cellType="data" className="a">
                    {convertListToString(stat.a)}
                  </TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
      </Table>
    );
  };

  const renderBonus = (bonusList: BonusModel[]) => {
    const hasVisibleBonus = bonusList.some(
      (bonus) => bonus.home_opta > 0 || bonus.away_opta > 0,
    );

    if (!hasVisibleBonus) return null;

    return (
      <Table tableLayoutType={leagueType} className="bonus-list">
        <TableHead tableHeight="compact">
          <TableRow>
            <TableCell cellType="head">{fixture.team_h_name}</TableCell>
            <TableCell cellType="head">{fixture.team_a_name}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bonusList.map((bonus, index) => {
            if (bonus.home_opta <= 0 && bonus.away_opta <= 0) return null;

            return (
              <TableRow
                key={`${bonus.home_player_name}-${bonus.away_player_name}-${index}`}
              >
                <TableCell cellType="data" className="h">
                  {bonus.home_opta > 0
                    ? `${bonus.home_player_name} (${bonus.home_opta.toFixed(0)})`
                    : ""}
                </TableCell>
                <TableCell cellType="data" className="a">
                  {bonus.away_opta > 0
                    ? `${bonus.away_player_name} (${bonus.away_opta.toFixed(0)})`
                    : ""}
                </TableCell>
              </TableRow>
            );
          })}
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
}
