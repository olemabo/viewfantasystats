"use client";

import { TeamNamePlayerName } from "../../../../models/fixturePlanning/TeamNamePlayerName";
import ShowTeamIDFDRData from "../shared/show-fdr-data/show-teamId-fdr-data";
import { useState } from "react";
import { esf } from "../../../../models/shared/PageProps";
import TextInput from "../../../shared/ui/text-input/TextInput";
import Button from "../../../shared/ui/button/button";
import "../../../shared/ui/text-input/text-input.css";
import Modal from "../../../shared/modal/modal";
import { minGwEsf, minGwFpl } from "../../../../constants/gws";
import { LeagueType } from "../../../../types/league";
import { useTranslations } from "next-intl";
import "../fixture-planner/fixture-planner.css";
import { KickOffTime } from "../types/kickoff-times.types";
import { FixturePlannerResult } from "@/app/[locale]/eliteserien/fdr-planner-team-id/api";
import { useRouter } from "next/dist/client/components/navigation";

type FixturePlannerTeamIdProps = {
  leagueType: LeagueType;
  data: FixturePlannerResult;
  teamIdFromSearch?: string;
  kickoffTimes: KickOffTime[];
  initialPlayers: TeamNamePlayerName[][];
};

export function FixturePlannerTeamIdPage({
  leagueType,
  data,
  teamIdFromSearch,
  kickoffTimes,
  initialPlayers,
}: FixturePlannerTeamIdProps) {
  const { maxGw, playerList, fixtureData } = data;
  const g = useTranslations("General");
  const f = useTranslations("Fixture");
  const router = useRouter();

  const [gwStart, setGwStart] = useState(data.currentGw);
  const [gwEnd, setGwEnd] = useState(data.gwEnd);
  const [teamID, setTeamId] = useState(
    teamIdFromSearch ? parseInt(teamIdFromSearch) : 0,
  );
  const [teamIDCorrect, setTeamIdCorrect] = useState(
    teamIdFromSearch ? parseInt(teamIdFromSearch) : 0,
  );
  const [openModal, setOpenModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerTeam, setNewPlayerTeam] = useState("");
  const [newPlayerPositionNumber, setNewPlayerPositionNumber] = useState(0);
  const [goalKeepers, setGoalkeepers] = useState<TeamNamePlayerName[]>(
    initialPlayers ? initialPlayers[0] : [],
  );
  const [defenders, setDefenders] = useState<TeamNamePlayerName[]>(
    initialPlayers ? initialPlayers[1] : [],
  );
  const [midfielders, setMidfielders] = useState<TeamNamePlayerName[]>(
    initialPlayers ? initialPlayers[2] : [],
  );
  const [forwards, setForwards] = useState<TeamNamePlayerName[]>(
    initialPlayers ? initialPlayers[3] : [],
  );

  function toggleModal(postionNumber: number) {
    setNewPlayerPositionNumber(postionNumber);
    setOpenModal(true);
  }

  const handleAddPlayer = () => {
    const selector = document.getElementById(
      "player_dropdown",
    ) as HTMLSelectElement;
    const [player, team_id] = selector.value.split(",");
    const newPlayer = { team_id, player_name: player };

    if (newPlayerPositionNumber === 0)
      setGoalkeepers([...goalKeepers, newPlayer]);
    if (newPlayerPositionNumber === 1) setDefenders([...defenders, newPlayer]);
    if (newPlayerPositionNumber === 2)
      setMidfielders([...midfielders, newPlayer]);
    if (newPlayerPositionNumber === 3) setForwards([...forwards, newPlayer]);

    setNewPlayerName("");
    setNewPlayerTeam("");
    setNewPlayerPositionNumber(0);
    setOpenModal(false);
  };

  const handleRemovePlayer = (position: number, playerName: string) => {
    if (position === 0)
      setGoalkeepers(
        goalKeepers.filter((player) => player.player_name !== playerName),
      );
    if (position === 1)
      setDefenders(
        defenders.filter((player) => player.player_name !== playerName),
      );
    if (position === 2)
      setMidfielders(
        midfielders.filter((player) => player.player_name !== playerName),
      );
    if (position === 3)
      setForwards(
        forwards.filter((player) => player.player_name !== playerName),
      );
  };

  const handleUpdateFDRData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!teamID || teamID < 1) return;

    router.push(`?team_id=${teamID}`);
  };

  const playerNames = [
    g("goalkeeper"),
    g("defender"),
    g("midfielder"),
    g("forward"),
  ];
  const initMinGw = leagueType === esf ? minGwEsf : minGwFpl;

  return (
    <div className="team-id-wrapper">
      <div className="team-id-container">
        {maxGw > 0 && (
          <div className="input-row-container">
            <form onSubmit={handleUpdateFDRData}>
              <TextInput
                htmlFor="input-form-start-gw"
                min={initMinGw}
                max={maxGw}
                onInput={(e: number) => setGwStart(e)}
                defaultValue={gwStart}
              >
                {f("gw_start")}
              </TextInput>

              <TextInput
                htmlFor="input-form-end-gw"
                min={gwStart}
                max={maxGw}
                onInput={(e: number) => setGwEnd(e)}
                defaultValue={gwEnd}
              >
                {f("gw_end")}
              </TextInput>

              <TextInput
                htmlFor="input-form-team-id"
                min={0}
                max={10000000}
                minWidth={80}
                onInput={(e: number) => setTeamId(e)}
                defaultValue={teamID}
              >
                {f("teamId")}
              </TextInput>

              <input
                className="submit"
                type="submit"
                value={g("search_button_name")}
              />
            </form>
          </div>
        )}

        {
          <Modal
            toggleModal={(showModal: boolean) => setOpenModal(showModal)}
            openModal={openModal}
            title={`${g("add")} ${g("new")} ${playerNames[newPlayerPositionNumber]}`}
          >
            <div className="text-input-container border">
              <label htmlFor="team_short_name_dropdown">{f("team")}</label>
              <select
                onChange={(e) => {
                  setNewPlayerTeam(e.target.value);
                }}
                id="team_short_name_dropdown"
                name="team_short_name_dropdown"
                defaultValue={newPlayerTeam}
              >
                <option value="">{g("all_teams")}</option>
                {fixtureData[0]?.map((x) => (
                  <option key={x.team_id} value={x.team_id}>
                    {x.team_name_short}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-input-container border">
              <label htmlFor="player_dropdown">{g("player")}</label>
              <select
                onChange={(e) => {
                  setNewPlayerName(e.target.value);
                }}
                id="player_dropdown"
                name="player_dropdown"
              >
                {playerList.length > 0 &&
                  playerList
                    .filter(
                      (player) =>
                        player.player_position_id - 1 ===
                        newPlayerPositionNumber,
                    )
                    .filter(
                      (player) =>
                        player.player_team_id.toString() === newPlayerTeam ||
                        newPlayerTeam === "",
                    )
                    .map((player) => (
                      <option
                        key={`${player.player_web_name}-${player.player_team_id}`}
                        value={[
                          player.player_web_name,
                          player.player_team_id.toString(),
                        ]}
                      >
                        {player.player_web_name}
                      </option>
                    ))}
              </select>
            </div>
            <Button
              onclick={handleAddPlayer}
              buttonText={g("add_player")}
              iconClass="fa fa-plus"
            />
          </Modal>
        }

        {fixtureData.length > 0 && kickoffTimes.length > 0 && (
          <ShowTeamIDFDRData
            playerData={[goalKeepers, defenders, midfielders, forwards]}
            fixtureData={fixtureData}
            gwStart={gwStart}
            gwEnd={gwEnd}
            kickOffTimes={kickoffTimes}
            allowToggleBorder
            openModal={(postionNumber: number) => toggleModal(postionNumber)}
            removePlayer={(positionNumber: number, playerName: string) =>
              handleRemovePlayer(positionNumber, playerName)
            }
          />
        )}
      </div>
    </div>
  );
}

export default FixturePlannerTeamIdPage;
