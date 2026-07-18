"use client";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../shared/ui/table/Table";
import { TableSortHead } from "../../shared/ui/tableSortHead/TableSortHead";
import { useState } from "react";
import { Pagination } from "../../shared/pagination/pagination";
import Message, { MessageErrorLoading } from "../../shared/messages/messages";
import usePlayerOwnership from "../../../hooks/usePlayerOwnership";
import {
  sortAndFilterPlayerOwnership,
  SORTING_KEYWORDS,
} from "./sort-and-filter";
import { defaultFormValueAllSelected } from "../../../constants/formValue";
import { LeagueTypes, PageProps } from "../../../types/page";
import ChipsStats from "./chip-usage-table";
import { useTranslations } from "next-intl";
import { DEFAULT_PAGINATION_SIZE } from "../../../constants/constants";
import "./player-ownership.css";
import { TeamModel } from "../../../lib/api/teamData/teamData";
import Spinner from "../../shared/ui/spinner/Spinner";
import { isEmptyErrorLoadingState } from "../../../types/errorLoading";

interface PlayerOwnershipProps extends PageProps {
  teamData: TeamModel[];
}
export default function PlayerOwnership({
  topXManagersDefault,
  teamData,
  leagueType,
}: PlayerOwnershipProps) {
  const t = useTranslations("Statistics.PlayerOwnership");
  const g = useTranslations("General");
  const p = useTranslations("Popover");

  const [currentGw, setCurrentGw] = useState(0);
  const [sortingKeyword, setSortingKeyword] = useState(
    defaultFormValueAllSelected,
  );
  const [topXPlayers, setTopXPlayers] = useState(topXManagersDefault);

  const [query, setQuery] = useState<string>("");
  const [sortIndex, setSortIndex] = useState<number>(0);
  const [decreasing, setDecreasing] = useState<boolean>(true);

  const { isLoading, errorLoading, ownershipData } = usePlayerOwnership(
    leagueType,
    currentGw,
    topXPlayers,
  );

  const { chip, metadata, ownership } = ownershipData;

  const {
    updatingGw,
    updatingPrecentage,
    topXPlayersList,
    availableGws,
    currentGW,
  } = metadata;
  const { chipUsageRound, chipUsageTotal } = chip;

  const ownershipSorted = sortAndFilterPlayerOwnership(
    ownership,
    teamData,
    query,
    sortingKeyword,
    sortIndex,
    decreasing,
  );

  const [pagingationNumber, setPaginationNumber] = useState(1);
  const numberOfHitsPerPagination = DEFAULT_PAGINATION_SIZE;

  const sortOwnershipData = (sortType: number, increase: boolean) => {
    setSortIndex(sortType);
    setDecreasing(increase);
    setCurrentSorted(sortTypeToString(sortType));
  };

  const sortTypeToString = (sortType: number) => {
    const sortStrings = [
      "EO",
      "Captaincy",
      "3xC",
      "VC",
      "Owned by",
      "Benched",
      "Total Ownership",
    ];
    return sortStrings[sortType];
  };

  const [currentSorted, setCurrentSorted] = useState("EO");

  if (isLoading) {
    return <Spinner />;
  }

  if (!isEmptyErrorLoadingState(errorLoading)) {
    return <MessageErrorLoading errorLoading={errorLoading} />;
  }

  return (
    <>
      {updatingPrecentage > 0 && updatingGw > 0 && (
        <Message
          showCross
          messageType="info"
          messageText={t("is_updating_message")
            ?.replace(
              "__PERCENTAGE__",
              updatingPrecentage?.toFixed(0)?.toString(),
            )
            ?.replace("__GW__", updatingGw?.toString())}
        />
      )}

      <form className="form-stuff text-center">
        <div className="box-1">
          <label>{g("view")}</label>
          <select
            onChange={(e) => setSortingKeyword(e.target.value)}
            defaultValue={sortingKeyword}
            className="input-box"
            id="sort_players_dropdown"
            name="sort_players"
          >
            <option value={SORTING_KEYWORDS.All}>{g("all_players")}</option>
            <option disabled style={{ fontWeight: 900 }}>
              {g("by_position")}
            </option>
            <option value={SORTING_KEYWORDS.Goalkeepers}>
              {g("goalkeepers")}
            </option>
            <option value={SORTING_KEYWORDS.Defenders}>{g("defenders")}</option>
            <option value={SORTING_KEYWORDS.Midfielders}>
              {g("midfielders")}
            </option>
            <option value={SORTING_KEYWORDS.Forwards}>{g("forwards")}</option>
            <option disabled style={{ fontWeight: 900 }}>
              {g("by_team")}
            </option>

            {teamData.map((x) => (
              <option key={x.team_name} value={x.team_id}>
                {x.team_name}
              </option>
            ))}
          </select>
        </div>

        <div className="box-2">
          {topXPlayersList.length > 0 && (
            <>
              <label>{g("top_x_managers")}</label>
              <select
                onChange={(e) => {
                  setTopXPlayers(parseInt(e.target.value));
                  setPaginationNumber(1);
                }}
                defaultValue={topXPlayers}
                className="input-box"
                id="sort_on_dropdown"
                name="sort_on"
              >
                {topXPlayersList.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="box-3">
          <label>{g("gw")}</label>
          <select
            onChange={(e) => {
              setCurrentGw(parseInt(e.target.value));
              setPaginationNumber(1);
            }}
            defaultValue={currentGW}
            className="input-box"
            id="last_x_dropdown"
            name="last_x"
          >
            {availableGws.map((x) => (
              <option selected={x === currentGW} key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="box-4"></div>

        <div className="box-5">
          <label htmlFor="site-search" className="hidden">
            Search bar
          </label>
          <input
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_text")}
            className="input-box"
            type="search"
            id="site-search"
            name="q"
          ></input>
        </div>
      </form>

      {ownershipSorted?.length > 0 && (
        <>
          <div className="container-player-stats">
            <Table tableLayoutType={leagueType} className="stat-table">
              <TableHead>
                <TableRow>
                  <TableCell cellType="head" minWidth={139}>
                    {t("player")}
                  </TableCell>
                  <TableCell cellType="head">
                    <TableSortHead
                      popover_title="Effective Ownership"
                      popover_text={p("effectiveOwnership")}
                      text={g("eo")}
                      reset={currentSorted != "EO"}
                      defaultSortType={"Increasing"}
                      onclick={(increase: boolean) =>
                        sortOwnershipData(0, increase)
                      }
                    />
                  </TableCell>
                  <TableCell cellType="head">
                    <TableSortHead
                      popover_title={t("owned_by")}
                      popover_text={p("chosenBy")}
                      text={t("owned_by")}
                      reset={currentSorted != "Owned by"}
                      defaultSortType={"Increasing"}
                      onclick={(increase: boolean) =>
                        sortOwnershipData(4, increase)
                      }
                    />
                  </TableCell>
                  <TableCell cellType="head">
                    <TableSortHead
                      popover_title={t("captain")}
                      popover_text={p("captain")}
                      text={t("captain")}
                      reset={currentSorted != "Captaincy"}
                      onclick={(increase: boolean) =>
                        sortOwnershipData(1, increase)
                      }
                    />
                  </TableCell>
                  {leagueType === LeagueTypes.FPL && (
                    <TableCell cellType="head">
                      <TableSortHead
                        text={t("three_captain")}
                        reset={currentSorted != "3xC"}
                        onclick={(increase: boolean) =>
                          sortOwnershipData(2, increase)
                        }
                      />
                    </TableCell>
                  )}
                  <TableCell cellType="head">
                    <TableSortHead
                      text={t("vice_captain")}
                      reset={currentSorted != "VC"}
                      onclick={(increase: boolean) =>
                        sortOwnershipData(3, increase)
                      }
                    />
                  </TableCell>
                  <TableCell cellType="head">
                    <TableSortHead
                      text={t("benched")}
                      reset={currentSorted != "Benched"}
                      onclick={(increase: boolean) =>
                        sortOwnershipData(5, increase)
                      }
                    />
                  </TableCell>
                  <TableCell cellType="head" className="last-element">
                    <TableSortHead
                      popover_title={t("tot_ownership")}
                      popover_text={
                        p("topOwnership") +
                        topXPlayers.toString() +
                        " " +
                        g("managers") +
                        "."
                      }
                      text={t("tot_ownership")}
                      reset={currentSorted != "Total Ownership"}
                      onclick={(increase: boolean) =>
                        sortOwnershipData(6, increase)
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {ownershipSorted
                  .slice(
                    (pagingationNumber - 1) * numberOfHitsPerPagination,
                    (pagingationNumber - 1) * numberOfHitsPerPagination +
                      numberOfHitsPerPagination,
                  )
                  .map((x, index) => (
                    <TableRow key={`ownership-key-${index}`}>
                      <TableCell cellType="data" minWidth={139}>
                        {" "}
                        <div>{x.player_name}</div>{" "}
                      </TableCell>
                      {x.ownership.length == 0 ? (
                        <>
                          <TableCell
                            cellType="data"
                            className={currentSorted == "EO" ? "selected" : ""}
                          >
                            {} {"-"}
                          </TableCell>
                          <TableCell
                            cellType="data"
                            className={
                              currentSorted == "Owned by" ? "selected" : ""
                            }
                          >
                            {} {"-"}{" "}
                          </TableCell>
                          <TableCell
                            cellType="data"
                            className={
                              currentSorted == "Captaincy" ? "selected" : ""
                            }
                          >
                            {} {"-"}{" "}
                          </TableCell>
                          {leagueType === LeagueTypes.FPL && (
                            <TableCell
                              cellType="data"
                              className={
                                currentSorted == "3xC" ? "selected" : ""
                              }
                            >
                              {} {"-"}{" "}
                            </TableCell>
                          )}
                          <TableCell
                            cellType="data"
                            className={currentSorted == "VC" ? "selected" : ""}
                          >
                            {} {"-"}{" "}
                          </TableCell>
                          <TableCell
                            cellType="data"
                            className={
                              currentSorted == "Benched" ? "selected" : ""
                            }
                          >
                            {} {"-"}{" "}
                          </TableCell>
                          <TableCell
                            cellType="data"
                            className={
                              currentSorted == "Total Ownership"
                                ? "selected"
                                : ""
                            }
                          >
                            {} {"-"}{" "}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell
                            cellType="data"
                            className={currentSorted == "EO" ? "selected" : ""}
                          >
                            {(
                              ((x.ownership[0] +
                                x.ownership[1] * 2 +
                                x.ownership[2] * 3) /
                                topXPlayers) *
                              100
                            ).toFixed(1)}{" "}
                            {"%"}{" "}
                          </TableCell>
                          <TableCell
                            cellType="data"
                            className={
                              currentSorted == "Owned by" ? "selected" : ""
                            }
                          >
                            {((x.ownership[4] / topXPlayers) * 100).toFixed(1)}{" "}
                            {"%"}{" "}
                          </TableCell>
                          <TableCell
                            cellType="data"
                            className={
                              currentSorted == "Captaincy" ? "selected" : ""
                            }
                          >
                            {((x.ownership[1] / topXPlayers) * 100).toFixed(1)}{" "}
                            {"%"}{" "}
                          </TableCell>
                          {leagueType === LeagueTypes.FPL && (
                            <TableCell
                              cellType="data"
                              className={
                                currentSorted == "3xC" ? "selected" : ""
                              }
                            >
                              {((x.ownership[2] / topXPlayers) * 100).toFixed(
                                1,
                              )}{" "}
                              {"%"}{" "}
                            </TableCell>
                          )}
                          <TableCell
                            cellType="data"
                            className={currentSorted == "VC" ? "selected" : ""}
                          >
                            {((x.ownership[3] / topXPlayers) * 100).toFixed(1)}{" "}
                            {"%"}{" "}
                          </TableCell>
                          <TableCell
                            cellType="data"
                            className={
                              currentSorted == "Benched" ? "selected" : ""
                            }
                          >
                            {((x.ownership[5] / topXPlayers) * 100).toFixed(1)}{" "}
                            {"%"}{" "}
                          </TableCell>
                          <TableCell
                            cellType="data"
                            className={
                              currentSorted == "Total Ownership"
                                ? "selected"
                                : ""
                            }
                          >
                            {(x.ownership[6] / 100).toFixed(1)} {"%"}{" "}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <Pagination
            className="ant-pagination"
            onChange={(number: number) => setPaginationNumber(number)}
            defaultCurrent={1}
            total={ownershipSorted.length}
          />
        </>
      )}

      {ownershipSorted.length === 0 && query && (
        <Message messageType="info" messageText={g("noHitsMessage")} />
      )}

      <ChipsStats
        chipUsageRound={chipUsageRound}
        chipUsageTotal={chipUsageTotal}
        currentGW={currentGW}
        topXPlayers={topXPlayers}
        leagueType={leagueType}
      />
    </>
  );
}
