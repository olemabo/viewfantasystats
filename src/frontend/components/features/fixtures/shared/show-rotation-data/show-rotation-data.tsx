import { RotationPlannerTeamInfoModel } from "../../../../../models/fixturePlanning/RotationPlannerTeamInfo";
import { lowerCaseText } from "../../../../../utils/lowerCaseText";
import { FunctionComponent, useState } from "react";
import { FDRData } from "../../../../../models/fixturePlanning/TeamFDRData";
import { useTranslations } from "next-intl";
import "../show-fdr-data/show-fdr-data.css";
import "./show-rotation-data.css";
import { Pagination } from "../../../../shared/pagination/pagination";
import { KickOffTime } from "../../types/kickoff-times.types";

type ShowRotationProps = {
  fdrData: RotationPlannerTeamInfoModel[];
  kickOffTimes: KickOffTime[];
};

export const ShowRotationData: FunctionComponent<ShowRotationProps> = ({
  fdrData,
  kickOffTimes,
}) => {
  console.log(fdrData, "fdrData");
  const t = useTranslations("General");
  const f = useTranslations("Fixture.RotationPlanner");

  const [pagingationNumber, setPaginationNumber] = useState(1);
  const numberOfHitsPerPagination = 10;
  const numberOfHits = fdrData?.length;

  function paginationUpdate(pageNumber: number) {
    setPaginationNumber(pageNumber);
  }

  function getFDRDiv(fdrData: FDRData, num_teams: number) {
    return (
      <div
        className={
          "color-" +
          Number(fdrData.difficultyScore).toFixed(0) +
          " height-" +
          num_teams?.toString() +
          (num_teams > 1 ? " multiple-fixtures" : "")
        }
      >
        {fdrData.opponentTeamName == "-"
          ? "Blank"
          : fdrData.opponentTeamName + " (" + fdrData.homeAway + ")"}
      </div>
    );
  }

  console.log("kickOffTimes", fdrData);

  return (
    <>
      <div id="data-box" className="text-center mt-3">
        <div className="big-container">
          <div className="container-rotation fdr">
            <div>
              {fdrData
                .slice(
                  (pagingationNumber - 1) * numberOfHitsPerPagination,
                  (pagingationNumber - 1) * numberOfHitsPerPagination +
                    numberOfHitsPerPagination,
                )
                .map((row) => (
                  <>
                    <table className="rotation">
                      <tbody>
                        <tr className="fdr-row-gws">
                          <td className="name-column-top-corner" />
                          {kickOffTimes.map((gw) => (
                            <th key={gw.gameweek}>
                              {t("round_short")}
                              {gw.gameweek}
                              <div className="day-month">{gw.dayMonth}</div>
                            </th>
                          ))}
                        </tr>
                        {row.fixture_list.map(
                          (fixtureCombination: FDRData[][]) => (
                            <tr
                              key={fixtureCombination
                                .map((team) => team[0]?.teamName)
                                .join("-")}
                            >
                              {fixtureCombination.map(
                                (gwFixtures: FDRData[], index) => (
                                  <>
                                    {index == 0 && gwFixtures[0].teamName && (
                                      <td className="name-column">
                                        {lowerCaseText(gwFixtures[0].teamName)}
                                      </td>
                                    )}
                                    {gwFixtures.length == 1 ? (
                                      <td
                                        scope="col"
                                        className={
                                          " double-border-" +
                                          gwFixtures[0].useNotUse
                                        }
                                      >
                                        {gwFixtures.map((team: FDRData) => {
                                          const num_teams = gwFixtures.length;
                                          return getFDRDiv(team, num_teams);
                                        })}
                                      </td>
                                    ) : (
                                      <td
                                        scope="col"
                                        className={
                                          " no-padding double-border-" +
                                          gwFixtures[0].useNotUse
                                        }
                                      >
                                        {gwFixtures.map((fixture: FDRData) => {
                                          const num_teams = gwFixtures.length;
                                          return getFDRDiv(fixture, num_teams);
                                        })}
                                      </td>
                                    )}
                                  </>
                                ),
                              )}
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                    <caption>
                      {f("avg_fdr_score")}
                      <b> {row.avg_Score.toFixed(2)} </b>
                    </caption>
                  </>
                ))}
              <Pagination
                className="ant-pagination"
                onChange={(number) => paginationUpdate(number)}
                defaultCurrent={1}
                defaultPageSize={numberOfHitsPerPagination}
                total={numberOfHits}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowRotationData;
