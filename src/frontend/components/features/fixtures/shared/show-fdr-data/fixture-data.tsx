import { TeamNamePlayerName } from "../../../../../models/fixturePlanning/TeamNamePlayerName";
import { fdrNumber } from "../../../../../constants/fdr";
import React, { FunctionComponent } from "react";
import Popover from "../../../../shared/popover/popover";
import Button from "../../../../shared/ui/button/button";

import "./show-fdr-data.css";
import { useTranslations } from "next-intl";
import { TeamIdFDRModel } from "@/models/fixturePlanning/TeamFDRData";

type FixtureDataProps = {
  playerData: TeamNamePlayerName[];
  fixtureData: TeamIdFDRModel[][];
  allowToggleBorder?: boolean;
  gwStart: number;
  postionName: string;
  gwEnd: number;
  positionNumber: number;
  defaultFdrType?: number;
  rowKey?: number;
  openModal: (position: number) => void;
  removePlayer: (position: number, playerName: string) => void;
};

export const FixtureData: FunctionComponent<FixtureDataProps> = ({
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
  const g = useTranslations("General");
  const f = useTranslations("Fixture");

  function toggleBorderLine(
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
  ) {
    if (!allowToggleBorder) {
      return;
    }
    const classList = e.currentTarget.classList;

    const temp: any = e.target;
    if (temp?.tagName == "svg" || temp?.tagName == "path") return;

    if (classList.contains("show-color")) {
      e.currentTarget.classList.replace("show-color", "greyed-out");
    } else if (classList.contains("greyed-out")) {
      e.currentTarget.classList.replace("greyed-out", "hide-game");
    } else if (classList.contains("hide-game")) {
      e.currentTarget.classList.replace("hide-game", "show-color");
    }
  }

  function getFixtureData(team_id: string): TeamIdFDRModel["fdr"] {
    for (let i = 0; i < fixtureData[defaultFdrType].length; i++) {
      if (
        fixtureData[defaultFdrType][i].teamId.toString() === team_id.toString()
      )
        return fixtureData[defaultFdrType][i].fdr;
    }

    return fixtureData[defaultFdrType][fdrNumber].fdr;
  }

  return (
    <>
      <div key={`fixture-data-${rowKey}`} className="fixed-column">
        <div className="postition-container">
          <span className="text">{postionName}</span>
          <div className="button-group">
            <div>
              <Button
                buttonText={g("add_player")}
                iconClass="fa fa-plus"
                color="white"
                small={true}
                onclick={() => openModal(positionNumber)}
              />
            </div>
          </div>
        </div>
      </div>
      {playerData.map((player) => (
        <>
          <tr key={player.player_name} id={`fdr-row-${player.team_id}`}>
            <td className="fixed-column">
              <span>
                {player.player_name.length > 12
                  ? player.player_name.substring(0, 11) + "..."
                  : player.player_name}
              </span>
              {/* <button title={content.General.removePlayer} className='fa fa-arrow-up remove-player-btn' onClick={ () => removePlayer(positionNumber ,player.player_name) }></button> */}
              <button
                title={g("removePlayer")}
                className="fa fa-minus remove-player-btn"
                onClick={() => removePlayer(positionNumber, player.player_name)}
              ></button>
              {/* <button title={content.General.removePlayer} className='fa fa-arrow-down remove-player-btn' onClick={ () => removePlayer(positionNumber ,player.player_name) }></button> */}
            </td>
            {getFixtureData(player.team_id)
              .slice(gwStart - 1, gwEnd)
              .map((team, idx) => (
                <td
                  key={`td-fixture-${idx}-${player.player_name}-${team.length}`}
                  onClick={(e) => toggleBorderLine(e)}
                  scope="col"
                  className={
                    "" +
                    (team.length == 1
                      ? " color-" +
                        Number(team[0].difficultyScore).toFixed(0) +
                        " "
                      : " multiple no-padding ") +
                    " show-color"
                  }
                >
                  {team.map((g) => (
                    <>
                      <div
                        style={{ position: g.message ? "relative" : "inherit" }}
                        className={`height-${team.length} color-${Number(g.difficultyScore).toFixed(0)}
                                ${team.length > 1 ? " multiple-fixtures" : ""} 
                                ${team[0].doubleBlank?.includes("-") ? "possible-blank" : ""}`}
                      >
                        {g.message && (
                          <Popover
                            id={`rotations-planner-id-${g.opponentTeamName}-${g.H_A}-${player.player_name}`}
                            title=""
                            htmlTitle={f("uncertain_match")}
                            alignLeft={false}
                            popoverTitle={""} // fdr.team_name + ' - ' + g.opponent_team_name
                            iconSize={14}
                            topRightCornerInDiv={true}
                            className={
                              positionNumber === 3 ? "bottom-position" : ""
                            }
                            iconPosition={[0, 0, 0, 0]}
                            popoverText={g.message}
                          ></Popover>
                        )}

                        {g.opponentTeamName == "-"
                          ? "Blank"
                          : `${g.opponentTeamName} (${g.H_A})`}
                      </div>
                    </>
                  ))}
                </td>
              ))}
          </tr>
        </>
      ))}
    </>
  );
};

export default FixtureData;
