"use client";

import { TeamNamePlayerName } from "../../../../models/fixturePlanning/TeamNamePlayerName";
import ShowTeamIDFDRData from "../shared/show-fdr-data/show-teamId-fdr-data";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/dist/client/components/navigation";
import { FixturePlannerResult } from "@/lib/api/fixture-planner/fdr-and-player/get-fdr-and-player";

type FixturePlannerTeamIdProps = {
  leagueType: LeagueType;
  data: FixturePlannerResult;
  teamIdFromSearch?: string;
  kickoffTimes: KickOffTime[];
  initialPlayers: TeamNamePlayerName[][];
};

export default function FixturePlannerTeamIdPage({
  leagueType,
  data,
  teamIdFromSearch,
  kickoffTimes,
  initialPlayers,
}: FixturePlannerTeamIdProps) {
  const { maxGw, playerList, fdrData, fdrDataDefensive, fdrDataOffensive } =
    data;

  const fixtureDataAll = [
    fdrData ?? [],
    fdrDataDefensive ?? [],
    fdrDataOffensive ?? [],
  ];

  const g = useTranslations("General");
  const f = useTranslations("Fixture");
  const router = useRouter();

  const [gwStart, setGwStart] = useState(data.currentGw);
  const [gwEnd, setGwEnd] = useState(data.gwEnd);
  const [teamID, setTeamId] = useState(
    teamIdFromSearch ? parseInt(teamIdFromSearch) : 0,
  );
  const [openModal, setOpenModal] = useState(false);
  const [newPlayerTeam, setNewPlayerTeam] = useState("");
  const [newPlayerPositionNumber, setNewPlayerPositionNumber] = useState(0);
  const [playerData, setPlayerData] = useState<TeamNamePlayerName[][]>(
    initialPlayers ?? [[], [], [], []],
  );

  useEffect(() => {
    const nextTeamId = teamIdFromSearch ? parseInt(teamIdFromSearch) : 0;

    setTeamId(nextTeamId);
    setPlayerData(initialPlayers ?? [[], [], [], []]);
    setOpenModal(false);
    setNewPlayerTeam("");
    setNewPlayerPositionNumber(0);
  }, [initialPlayers, teamIdFromSearch]);

  function toggleModal(postionNumber: number) {
    setNewPlayerPositionNumber(postionNumber);
    setOpenModal(true);
  }

  function updatePlayersAtPosition(
    position: number,
    updater: (players: TeamNamePlayerName[]) => TeamNamePlayerName[],
  ) {
    setPlayerData((currentPlayerData) =>
      currentPlayerData.map((players, index) =>
        index === position ? updater(players) : players,
      ),
    );
  }

  const handleAddPlayer = () => {
    const selector = document.getElementById(
      "player_dropdown",
    ) as HTMLSelectElement;
    const [player, team_id] = selector.value.split(",");
    const newPlayer = { team_id, player_name: player };

    updatePlayersAtPosition(newPlayerPositionNumber, (players) => [
      ...players,
      newPlayer,
    ]);

    setNewPlayerTeam("");
    setNewPlayerPositionNumber(0);
    setOpenModal(false);
  };

  const handleRemovePlayer = (position: number, playerName: string) => {
    updatePlayersAtPosition(position, (players) =>
      players.filter((player) => player.player_name !== playerName),
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
                {fixtureDataAll[0]?.map((x) => (
                  <option key={x.teamId} value={x.teamId}>
                    {x.teamNameShort}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-input-container border">
              <label htmlFor="player_dropdown">{g("player")}</label>
              <select id="player_dropdown" name="player_dropdown">
                {playerList.length > 0 &&
                  playerList
                    .filter(
                      (player) =>
                        player.playerPositionId - 1 === newPlayerPositionNumber,
                    )
                    .filter(
                      (player) =>
                        player.playerTeamId.toString() === newPlayerTeam ||
                        newPlayerTeam === "",
                    )
                    .map((player) => (
                      <option
                        key={`${player.playerWebName}-${player.playerTeamId}`}
                        value={[
                          player.playerWebName,
                          player.playerTeamId.toString(),
                        ]}
                      >
                        {player.playerWebName}
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

        {fixtureDataAll.length > 0 && kickoffTimes.length > 0 && (
          <ShowTeamIDFDRData
            playerData={playerData}
            fixtureData={fixtureDataAll}
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
