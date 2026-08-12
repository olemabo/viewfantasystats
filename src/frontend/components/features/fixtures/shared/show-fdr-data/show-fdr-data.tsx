import {
  SimpleTeamFDRDataModel,
  TeamFDRDataModel,
} from "@/models/fixturePlanning/TeamFDRData";
import { contrastingColor } from "@/utils/findContrastColor";
import { convertFDRtoHex } from "@/utils/convertFDRtoHex";
import { lowerCaseText } from "@/utils/lowerCaseText";
import React from "react";
import Popover from "@/components/shared/popover/popover";
import "./show-fdr-data.css";
import Message from "@/components/shared/messages/messages";
import { KickOffTime } from "../../types/kickoff-times.types";

type ShowFDRProps = {
  fdrData: SimpleTeamFDRDataModel[] | TeamFDRDataModel[];
  kickOffTimes: KickOffTime[];
  allowToggleBorder?: boolean;
  warningMessage: string;
};

export function ShowFDRData({
  allowToggleBorder = true,
  fdrData,
  warningMessage,
  kickOffTimes,
}: ShowFDRProps) {
  function toggleBorderLine(e: React.MouseEvent<HTMLTableCellElement>) {
    if (!allowToggleBorder) return;

    const target = e.target;

    // Don't toggle the border when clicking the Popover icon.
    if (
      target instanceof Element &&
      ["svg", "path"].includes(target.tagName.toLowerCase())
    ) {
      return;
    }

    const cell = e.currentTarget;

    if (cell.classList.contains("double-border-0")) {
      cell.classList.replace("double-border-0", "double-border-1");
    } else if (cell.classList.contains("double-border-1")) {
      cell.classList.replace("double-border-1", "double-border-0");
    }
  }

  const hasCheckedTeams = fdrData.some((team) => team.checked);

  if (!hasCheckedTeams) {
    return <Message messageType="warning" messageText={warningMessage} />;
  }

  return (
    <div className="container-fdr fdr">
      <div className="fdr-table">
        <div className="fdr-team-names">
          <table className="table-adjustment">
            <tbody id="fdr-names">
              <tr>
                <td className="name-column-top-corner" />
              </tr>

              {fdrData.map(
                (team) =>
                  team.checked && (
                    <tr key={team.teamName}>
                      <td className="name-column">
                        <div>{lowerCaseText(team.teamName)}</div>
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        </div>

        <div className="fdr-team-difficulty">
          <table className="table-adjustment">
            <tbody>
              <tr className="fdr-row-gws">
                {kickOffTimes.map((gw) => (
                  <th key={gw.gameweek}>
                    {gw.gameweek}
                    <div className="day-month">{gw.dayMonth}</div>
                  </th>
                ))}
              </tr>

              {fdrData.map(
                (team, teamIndex) =>
                  team.checked && (
                    <tr
                      key={`fdr-row-${team.teamName}`}
                      id={`fdr-row-${team.teamName}`}
                    >
                      {team.FDR.map((gameweek, gwIndex) => {
                        const firstFixture = gameweek.fixtures[0];
                        const isDoubleFixture = gameweek.fixtures.length > 1;

                        const backgroundColor = convertFDRtoHex(
                          firstFixture.difficultyScore,
                          null,
                        );

                        return (
                          <td
                            key={`${team.teamName}-${gwIndex}`}
                            onClick={toggleBorderLine}
                            scope="col"
                            className={[
                              isDoubleFixture
                                ? "no-padding"
                                : `colors-${firstFixture.difficultyScore}`,
                              `double-border-${firstFixture.useNotUse}`,
                            ].join(" ")}
                          >
                            {gameweek.fixtures.map((fixture, fixtureIndex) => (
                              <div
                                key={`${team.teamName}-${gwIndex}-${fixtureIndex}`}
                                style={{
                                  backgroundColor,
                                  position: fixture.message
                                    ? "relative"
                                    : "inherit",
                                  color: contrastingColor(backgroundColor),
                                }}
                                className={[
                                  `color-${Number(
                                    fixture.difficultyScore,
                                  ).toFixed(0)}`,
                                  `height-${gameweek.fixtures.length}`,
                                  isDoubleFixture ? "multiple-fixtures" : "",
                                  firstFixture.doubleBlank?.includes("-")
                                    ? "possible-blank"
                                    : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                              >
                                {fixture.message && (
                                  <Popover
                                    id={`rotation-planner-${team.teamName}-${gwIndex}-${fixtureIndex}`}
                                    title=""
                                    alignLeft={false}
                                    popoverTitle=""
                                    iconSize={14}
                                    className={
                                      teamIndex > fdrData.length - 4
                                        ? "bottom-position"
                                        : ""
                                    }
                                    topRightCornerInDiv={true}
                                    iconPosition={[0, 0, 0, 0]}
                                    popoverText={fixture.message}
                                  />
                                )}

                                {fixture.opponentTeamName === "-"
                                  ? "Blank"
                                  : `${fixture.opponentTeamName} (${fixture.homeAway})`}
                              </div>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShowFDRData;
