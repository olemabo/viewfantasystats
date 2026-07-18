"use client";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../shared/ui/table/Table";
import {
  Increasing,
  TableSortHead,
} from "../../shared/ui/tableSortHead/TableSortHead";
import { useState } from "react";
import { Pagination } from "../../shared/pagination/pagination";
import Message from "../../shared/messages/messages";
import { defaultFormValueAllSelected } from "../../../constants/formValue";
import usePriceChange from "../../../hooks/usePriceChange";
import { sortAndFilterPriceChange } from "./sortAndFilter";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { LeagueProps } from "../../../types/league";
import { useTranslations } from "next-intl";
import "../player-ownership/player-ownership.css";
import { TeamModel } from "../../../lib/api/teamData/teamData";
import { PriceChangeRaw } from "../../../lib/api/get-price-change";
import { useRouter, useSearchParams } from "next/navigation";

type FixturePlannerProps = {
  teamData: TeamModel[];
  priceChangeData: PriceChangeRaw[];
  gwList: number[];
  currentGw: number;
} & LeagueProps;

export function PriceChange({
  leagueType,
  teamData,
  priceChangeData,
  gwList,
  currentGw,
}: FixturePlannerProps) {
  const g = useTranslations("General");
  const f = useTranslations("Fixture");
  const s = useTranslations("Statistics.PlayerOwnership");
  const t = useTranslations("Statistics.PriceChange");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortingTeamId, setSortingTeamId] = useState(
    defaultFormValueAllSelected,
  );
  const [sortingPositionId, setSortingPositionId] = useState(
    defaultFormValueAllSelected,
  );

  const [query, setQuery] = useState("");
  const [sortType, setSortType] = useState("NetTransfers");
  const [decreasing, setDecreasing] = useState(true);

  const priceChangeSorted = sortAndFilterPriceChange(
    priceChangeData,
    query,
    sortingTeamId,
    sortingPositionId,
    sortType,
    decreasing,
  );

  const [pagingationNumber, setPaginationNumber] = useState(1);
  const numberOfHitsPerPagination = 15;

  const sortPriceChangeData = (sortType: string, increase: boolean) => {
    setSortType(sortType);
    setDecreasing(increase);
    setCurrentSorted(sortType);
  };

  const handleGwChange = (gw: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("gw", gw.toString());

    router.push(`?${params.toString()}`);
  };

  const [currentSorted, setCurrentSorted] = useState("NetTransfers");

  const latestGw = Math.max(...gwList) + 1;
  const isLatestGw = currentGw === -1 || currentGw === latestGw;

  return (
    <>
      <form className="form-stuff price-change text-center">
        <div className="box-1">
          <label>{g("view")}</label>
          <select
            onChange={(e) => setSortingPositionId(e.target.value)}
            className="input-box"
            id="sort_players_dropdown"
            name="sort_players"
          >
            <option
              key={defaultFormValueAllSelected}
              selected={sortingPositionId == defaultFormValueAllSelected}
              value={defaultFormValueAllSelected}
            >
              {g("all_positions")}
            </option>
            <option
              key="Goalkeepers"
              selected={sortingPositionId == "Goalkeepers"}
              value="Goalkeepers"
            >
              {g("goalkeepers")}
            </option>
            <option
              key="Defenders"
              selected={sortingPositionId == "Defenders"}
              value="Defenders"
            >
              {g("defenders")}
            </option>
            <option
              key="Midfielders"
              selected={sortingPositionId == "Midfielders"}
              value="Midfielders"
            >
              {g("midfielders")}
            </option>
            <option
              key="Forwards"
              selected={sortingPositionId == "Forwards"}
              value="Forwards"
            >
              {g("forwards")}
            </option>
          </select>
        </div>

        <div className="box-2">
          <label>{f("team")}</label>
          <select
            onChange={(e) => setSortingTeamId(e.target.value)}
            className="input-box"
            id="sort_players_dropdown"
            name="sort_players"
          >
            <option
              selected={sortingTeamId == defaultFormValueAllSelected}
              value={defaultFormValueAllSelected}
            >
              {g("all_teams")}
            </option>
            {teamData.length > 0 &&
              teamData.map((x) => (
                <option
                  key={x.team_id}
                  selected={x.team_name === sortingTeamId}
                  value={x.team_id}
                >
                  {x.team_name}
                </option>
              ))}
          </select>
        </div>

        <div className="box-3">
          <label>{g("gw")}</label>
          <select
            onChange={(e) => handleGwChange(parseInt(e.target.value))}
            defaultValue={currentGw > 0 ? currentGw : -1}
            className="input-box"
            id="last_x_dropdown"
            name="last_x"
          >
            {gwList.map((gw) => (
              <option key={gw} value={gw}>
                {gw}
              </option>
            ))}
            <option key="current-gw" value={-1}>
              {latestGw}
            </option>
          </select>
        </div>

        <div className="box-4"></div>

        <div className="box-5">
          <label htmlFor="site-search" className="hidden">
            Search bar
          </label>
          <input
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            placeholder={s("search_text")}
            className="input-box"
            type="search"
            id="site-search"
            name="q"
          ></input>
        </div>
      </form>

      {priceChangeSorted?.length > 0 && (
        <div className="container-player-stats">
          <Table tableLayoutType={leagueType} className="stat-table">
            <TableHead>
              <TableRow>
                <TableCell cellType="head" minWidth={144}>
                  {g("player")}
                </TableCell>
                {isLatestGw && (
                  <TableCell cellType="head" minWidth={80}>
                    <TableSortHead
                      text={t("status")}
                      popover_title={t("status")}
                      // popover_text={props.languageContent.Statistics.PriceChange.Popover.status}
                      reset={currentSorted !== "Status"}
                      onclick={(increase: boolean) =>
                        sortPriceChangeData("Status", increase)
                      }
                    />
                  </TableCell>
                )}
                <TableCell cellType="head" minWidth={90}>
                  <TableSortHead
                    text={t("price")}
                    popover_title={t("price")}
                    // popover_text={props.languageContent.Statistics.PriceChange.Popover.price}
                    reset={currentSorted !== "Price"}
                    onclick={(increase: boolean) =>
                      sortPriceChangeData("Price", increase)
                    }
                  />
                </TableCell>
                <TableCell cellType="head" minWidth={105}>
                  <TableSortHead
                    text={t("percentage")}
                    popover_title={t("percentage")}
                    // popover_text={props.languageContent.Statistics.PriceChange.Popover.ownership}
                    reset={currentSorted != "Percentage"}
                    onclick={(increase: boolean) =>
                      sortPriceChangeData("Percentage", increase)
                    }
                  />
                </TableCell>
                <TableCell cellType="head">
                  <TableSortHead
                    text={t("cost_change_event")}
                    popover_title={t("cost_change_event")}
                    // popover_text={props.languageContent.Statistics.PriceChange.Popover.pricechange}
                    reset={currentSorted != "Change"}
                    onclick={(increase: boolean) =>
                      sortPriceChangeData("Change", increase)
                    }
                  />
                </TableCell>
                <TableCell cellType="head" minWidth={145}>
                  <TableSortHead
                    text={t("nettransfer")}
                    popover_title={t("nettransfer")}
                    // popover_text={props.languageContent.Statistics.PriceChange.Popover.nettransfers}
                    reset={currentSorted !== "NetTransfers"}
                    defaultSortType={Increasing}
                    onclick={(increase: boolean) =>
                      sortPriceChangeData("NetTransfers", increase)
                    }
                  />
                </TableCell>
                {isLatestGw && (
                  <>
                    <TableCell
                      cellType="head"
                      minWidth={105}
                      className="last-element"
                    >
                      <TableSortHead
                        text={t("transfers_in")}
                        popover_title={t("transfers_in")}
                        // popover_text={props.languageContent.Statistics.PriceChange.Popover.transfersin}
                        reset={currentSorted !== "TransfersIn"}
                        onclick={(increase: boolean) =>
                          sortPriceChangeData("TransfersIn", increase)
                        }
                      />
                    </TableCell>
                    <TableCell
                      cellType="head"
                      minWidth={120}
                      className="last-element"
                    >
                      <TableSortHead
                        text={t("transfers_out")}
                        popover_title={t("transfers_out")}
                        // popover_text={props.languageContent.Statistics.PriceChange.Popover.transfersout}
                        reset={currentSorted !== "TransfersOut"}
                        onclick={(increase: boolean) =>
                          sortPriceChangeData("TransfersOut", increase)
                        }
                      />
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {priceChangeSorted
                .slice(
                  (pagingationNumber - 1) * numberOfHitsPerPagination,
                  (pagingationNumber - 1) * numberOfHitsPerPagination +
                    numberOfHitsPerPagination,
                )
                .map((player, index) => (
                  <TableRow key={`ownership-key-${index}-${currentGw}`}>
                    <TableCell cellType="data" minWidth={144}>
                      <div>{player.web_name}</div>{" "}
                    </TableCell>
                    {isLatestGw && (
                      <TableCell
                        cellType="data"
                        minWidth={80}
                        className={currentSorted == "Status" ? "selected" : ""}
                      >
                        {player.status.toUpperCase()}
                      </TableCell>
                    )}
                    <TableCell
                      cellType="data"
                      minWidth={90}
                      className={currentSorted == "Price" ? "selected" : ""}
                    >
                      {(player.now_cost / 10).toFixed(1)}
                    </TableCell>
                    <TableCell
                      cellType="data"
                      minWidth={105}
                      className={
                        currentSorted == "Percentage" ? "selected" : ""
                      }
                    >
                      {player.selected_by_percent}
                    </TableCell>
                    <TableCell
                      cellType="data"
                      className={currentSorted == "Change" ? "selected" : ""}
                    >
                      {(player.cost_change_event / 10).toFixed(1)}
                    </TableCell>
                    <TableCell
                      cellType="data"
                      minWidth={145}
                      className={
                        currentSorted == "NetTransfers" ? "selected" : ""
                      }
                    >
                      {
                        <>
                          {player.net_transfers.toFixed(0)}
                          {player.net_transfers === 0 ? (
                            <></>
                          ) : player.net_transfers > 0 ? (
                            <ExpandLess
                              style={{
                                position: "relative",
                                top: "3px",
                                left: "5px",
                              }}
                              color="success"
                              fontSize={"inherit"}
                            />
                          ) : (
                            <ExpandMore
                              style={{
                                position: "relative",
                                top: "3px",
                                left: "5px",
                              }}
                              color="error"
                              fontSize={"inherit"}
                            />
                          )}
                        </>
                      }
                    </TableCell>
                    {isLatestGw && (
                      <>
                        <TableCell
                          cellType="data"
                          minWidth={105}
                          className={
                            currentSorted == "TransfersIn" ? "selected" : ""
                          }
                        >
                          {player.transfers_in_event.toFixed(0)}{" "}
                        </TableCell>
                        <TableCell
                          cellType="data"
                          minWidth={120}
                          className={
                            currentSorted == "TransfersOut" ? "selected" : ""
                          }
                        >
                          {player.transfers_out_event.toFixed(0)}{" "}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

      {priceChangeSorted.length === 0 && query && (
        <Message messageType="info" messageText={g("noHitsMessage")} />
      )}

      {priceChangeSorted.length > 0 && (
        <Pagination
          className="ant-pagination"
          onChange={(number) => setPaginationNumber(number)}
          defaultCurrent={1}
          total={priceChangeSorted.length}
        />
      )}
    </>
  );
}
