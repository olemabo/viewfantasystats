"use client";

import {
  createSearchQueryFromForminput,
  extractTeamsToUseAndTeamsInSolution,
  filterTeamData,
  toggleFilterButton,
  validateInput,
} from "../../features/fixtures/utils/fixture-utils";
import { ShowRotationData } from "../../features/fixtures/shared/show-rotation-data/show-rotation-data";
import ThreeStateCheckbox from "../../shared/ui/filter-button/ThreeStateCheckbox";
import React, { useState } from "react";
import TextInput from "../../shared/ui/text-input/TextInput";
import { Button } from "../../shared/ui/button/button";
import { FDRFormInput } from "../../../models/fixturePlanning/FDRFormInput";
import { useTranslations } from "next-intl";
import { RotationPlannerTeamModel } from "@/models/fixturePlanning/RotationPlannerTeam";
import { useRouter } from "next/navigation";
import "../../features/fixtures/fixture-planner/fixture-planner.css";
import { TeamCheckedModel } from "@/models/fixturePlanning/TeamChecked";
import "../../shared/filter-team-box/filter-team-box.css";
import { KickOffTime } from "../../features/fixtures/types/kickoff-times.types";
import { minGwFpl } from "@/constants/gws";
import { combinations } from "@/utils/productRange";
import Spinner from "@/components/shared/ui/spinner/Spinner";
import { Message } from "@/components/shared/messages/messages";

interface RotationPlannerPageProps {
  fixtureData: RotationPlannerTeamModel[];
  kickOffTimes: KickOffTime[];
  defaultForm: FDRFormInput;
  defaultTeamData: TeamCheckedModel[];
}

export default function RotationPlannerPage({
  fixtureData,
  kickOffTimes,
  defaultForm,
  defaultTeamData,
}: RotationPlannerPageProps) {
  const f = useTranslations("Fixture");
  const g = useTranslations("General");
  const router = useRouter();

  const [showTeamFilters, setShowTeamFilters] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [longLoadingTimeText, setLongLoadingTimeText] = useState("");

  const [formInput, setFormInput] = useState<FDRFormInput>(defaultForm);
  const [isLoading, setIsLoading] = useState(false);
  const [teamData, setTeamData] = useState(defaultTeamData);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const teamsANDteamsinsolution =
      extractTeamsToUseAndTeamsInSolution(teamData);

    const body: FDRFormInput = {
      ...formInput,
      teamsInSolution: teamsANDteamsinsolution[1],
      fplTeams: teamsANDteamsinsolution[0],
      fdrType: "",
    };

    const validInput = validateInput({
      body,
      propsContent: {}, // You can pass translations or propsContent if needed here
      setValidationErrorMessage,
      setShowTeamFilters,
    });

    if (!validInput) return;

    const numComb = numberOfUniqueCombinations();
    if (numComb > 1000) {
      setLongLoadingTimeText(
        `${numComb} kombinasjoner skal sjekkes så denne utregningen kan ta litt tid. For å redusere utregningstiden kan du bruke 'Filtrer lag' til å velge lag du vet skal være i løsningen, eller fjern lag du vet ikke skal være i løsningen :)`,
      );
    } else {
      setLongLoadingTimeText("");
    }

    // Build query params to push to router
    const query = createSearchQueryFromForminput(body);

    setIsLoading(true);
    router.push(`?${query}`);
  }

  const {
    number_of_not_in_solution,
    number_of_must_be_in_solution,
    number_can_be_in_solution,
  } = filterTeamData(teamData);

  function numberOfUniqueCombinations() {
    return combinations(
      number_can_be_in_solution,
      formInput.teamsToCheck ?? 0 - number_of_must_be_in_solution,
    );
  }

  const filteredKickoffTimes = kickOffTimes.slice(
    defaultForm.startGw - 1,
    defaultForm.endGw,
  );

  return (
    <>
      <div className="input-row-container">
        <Button
          buttonText={f("filter_button_text")}
          iconClass={`fa fa-chevron-${showTeamFilters ? "up" : "down"}`}
          onclick={() => setShowTeamFilters(showTeamFilters ? false : true)}
          color="white"
        />

        <form onSubmit={handleSubmit}>
          <TextInput
            htmlFor="input-form-start-gw"
            min={minGwFpl}
            max={formInput.maxGw}
            onInput={(e: number) =>
              setFormInput((prevFormInput) => ({
                ...prevFormInput,
                startGw: e,
              }))
            }
            defaultValue={formInput.startGw}
          >
            {f("gw_start")}
          </TextInput>
          <TextInput
            htmlFor="input-form-end-gw"
            min={formInput.startGw}
            max={formInput.maxGw}
            onInput={(e: number) =>
              setFormInput((prevFormInput) => ({
                ...prevFormInput,
                endGw: e,
              }))
            }
            defaultValue={formInput.endGw}
          >
            {f("gw_end")}
          </TextInput>
          <TextInput
            htmlFor="teams_to_check"
            min={1}
            max={5}
            onInput={(e: number) =>
              setFormInput((prevFormInput) => ({
                ...prevFormInput,
                teamsToCheck: e,
              }))
            }
            defaultValue={formInput.teamsToCheck}
          >
            {f("teams_to_check_1")}
            <br />
            {f("teams_to_check_2")}
          </TextInput>
          <TextInput
            htmlFor="teams_to_play"
            min={1}
            max={5}
            onInput={(e: number) =>
              setFormInput((prevFormInput) => ({
                ...prevFormInput,
                teamsToPlay: e,
              }))
            }
            defaultValue={formInput.teamsToPlay}
          >
            {f("teams_to_play_1")}
            <br />
            {f("teams_to_play_2")}
          </TextInput>

          <input
            className="submit"
            type="submit"
            value={g("search_button_name")}
          />
        </form>
      </div>

      {validationErrorMessage && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ color: "red", maxWidth: "375px" }}>
            {validationErrorMessage}
          </span>
        </div>
      )}

      {teamData.length > 0 && showTeamFilters && (
        <div className="filter-teams-container">
          <div className="filter-teams-description">
            <div>
              <span className="dot can-be-in-solution"></span>
              {`${f("RotationPlanner.teams_can_be_in_solution")} (${number_can_be_in_solution})`}
            </div>
            <div>
              <span className="dot must-be-in-solution"></span>
              {`${f("RotationPlanner.teams_must_be_in_solution")} (${number_of_must_be_in_solution})`}
            </div>
            <div>
              <span className="dot not-in-solution"></span>
              {`${f("RotationPlanner.teams_cant_be_in_solution")} (${number_of_not_in_solution})`}
            </div>
          </div>
          <div className="filter-teams-list">
            {teamData.map(({ teamName, checked, mustBeInSolution }) => (
              <ThreeStateCheckbox
                key={teamName}
                checked={checked}
                mustBeInSolution={mustBeInSolution}
                onclick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
                  toggleFilterButton({ e, teamData, setTeamData })
                }
                buttonText={teamName}
              />
            ))}
            <div></div>
          </div>
        </div>
      )}

      {/* {isLoading && (
        <div>
          <Spinner />
          {longLoadingTimeText && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p style={{ width: "300px", textAlign: "center" }}>
                <Message messageType="info" messageText={longLoadingTimeText} />
              </p>
            </div>
          )}
        </div>
      )} */}

      {fixtureData.length > 0 && (
        <ShowRotationData
          fdrData={fixtureData}
          kickOffTimes={filteredKickoffTimes}
        />
      )}
    </>
  );
}
