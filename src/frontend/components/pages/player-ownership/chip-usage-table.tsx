"use client";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../shared/ui/table/Table";
import { LeagueType, LeagueTypes } from "../../../types/page";
import { useTranslations } from "next-intl";

interface ChipsStatsProps {
  chipUsageRound: number[];
  chipUsageTotal: number[];
  currentGW: number;
  topXPlayers: number;
  leagueType: LeagueType;
}

const ChipsStats = ({
  chipUsageRound,
  chipUsageTotal,
  currentGW,
  topXPlayers,
  leagueType,
}: ChipsStatsProps) => {
  if (!chipUsageRound?.length || chipUsageRound?.length < 6) {
    return null;
  }

  const playerOwnership = useTranslations("Statistics.PlayerOwnership");
  const general = useTranslations("General");

  const chipsRoundTableWidth = 145;
  const chipsAllRoundsTableWidth = 175;
  const chipsTeamInfoTableWidthCol1 = 180;
  const chipsTeamInfoTableWidthCol2 = 80;

  return (
    <div className="chips-section">
      <div>
        <Table tableLayoutType={leagueType} className="chips-table">
          <TableHead>
            <TableRow>
              <TableCell cellType="head" minWidth={chipsRoundTableWidth}>
                {playerOwnership("chip_title")} {general("round_short")}
                {currentGW}
              </TableCell>
              <TableCell cellType="head">
                {playerOwnership("percent")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell cellType="data" minWidth={chipsRoundTableWidth}>
                {playerOwnership("no_chip")}
              </TableCell>
              <TableCell cellType="data">
                {((chipUsageRound[4] / topXPlayers) * 100).toFixed(1)}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell cellType="data" minWidth={chipsRoundTableWidth}>
                {playerOwnership("wildcard")}
              </TableCell>
              <TableCell cellType="data">
                {((chipUsageRound[3] / topXPlayers) * 100).toFixed(1)}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell cellType="data" minWidth={chipsRoundTableWidth}>
                {leagueType === LeagueTypes.ESF
                  ? playerOwnership("rich_uncle")
                  : playerOwnership("free_hit")}
              </TableCell>
              <TableCell cellType="data">
                {((chipUsageRound[0] / topXPlayers) * 100).toFixed(1)}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell cellType="data" minWidth={chipsRoundTableWidth}>
                {leagueType === LeagueTypes.ESF
                  ? playerOwnership("forward_rush")
                  : playerOwnership("bench_boost")}
              </TableCell>
              <TableCell cellType="data">
                {((chipUsageRound[1] / topXPlayers) * 100).toFixed(1)}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell cellType="data" minWidth={chipsRoundTableWidth}>
                {leagueType === LeagueTypes.ESF
                  ? playerOwnership("two_captain")
                  : playerOwnership("three_captain")}
              </TableCell>
              <TableCell cellType="data">
                {((chipUsageRound[2] / topXPlayers) * 100).toFixed(1)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {chipUsageTotal?.length > 3 && (
        <div>
          <Table tableLayoutType={leagueType} className="chips-table">
            <TableHead>
              <TableRow>
                <TableCell cellType="head" minWidth={chipsAllRoundsTableWidth}>
                  {playerOwnership("chip_total_usage_title")}
                </TableCell>
                <TableCell cellType="head">
                  {playerOwnership("percent")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell cellType="data">
                  {playerOwnership("wildcard")} nr. 1
                </TableCell>
                <TableCell cellType="data">
                  {((chipUsageTotal[0] / topXPlayers) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell cellType="data">
                  {playerOwnership("wildcard")} nr. 2
                </TableCell>
                <TableCell cellType="data">
                  {((chipUsageTotal[1] / topXPlayers) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell cellType="data">
                  {leagueType === LeagueTypes.ESF
                    ? playerOwnership("rich_uncle")
                    : playerOwnership("free_hit")}
                </TableCell>
                <TableCell cellType="data">
                  {((chipUsageTotal[2] / topXPlayers) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell cellType="data">
                  {leagueType === LeagueTypes.ESF
                    ? playerOwnership("forward_rush")
                    : playerOwnership("bench_boost")}
                </TableCell>
                <TableCell cellType="data">
                  {(
                    (chipUsageTotal[leagueType === LeagueTypes.ESF ? 3 : 4] /
                      topXPlayers) *
                    100
                  ).toFixed(1)}
                  %
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell cellType="data">
                  {leagueType === LeagueTypes.ESF
                    ? playerOwnership("two_captain")
                    : playerOwnership("three_captain")}
                </TableCell>
                <TableCell cellType="data">
                  {(
                    (chipUsageTotal[leagueType === LeagueTypes.ESF ? 4 : 3] /
                      topXPlayers) *
                    100
                  ).toFixed(1)}
                  %
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
      <div>
        <Table tableLayoutType={leagueType}>
          <TableHead>
            <TableRow>
              <TableCell cellType="head" minWidth={chipsTeamInfoTableWidthCol1}>
                {playerOwnership("team_info")}
              </TableCell>
              <TableCell cellType="head" minWidth={chipsTeamInfoTableWidthCol2}>
                {playerOwnership("value")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell cellType="data" minWidth={chipsTeamInfoTableWidthCol1}>
                {playerOwnership("avg_team_value")}
              </TableCell>
              <TableCell cellType="data" minWidth={chipsTeamInfoTableWidthCol2}>
                {(chipUsageRound[5] / 10).toFixed(1)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell cellType="data" minWidth={chipsTeamInfoTableWidthCol1}>
                {playerOwnership("avg_transfers")}
              </TableCell>
              <TableCell cellType="data" minWidth={chipsTeamInfoTableWidthCol2}>
                {(chipUsageRound[6] / 10).toFixed(1)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell cellType="data" minWidth={chipsTeamInfoTableWidthCol1}>
                {playerOwnership("avg_transfer_cost")}
              </TableCell>
              <TableCell cellType="data" minWidth={chipsTeamInfoTableWidthCol2}>
                -{(chipUsageRound[7] / 10).toFixed(1)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChipsStats;
