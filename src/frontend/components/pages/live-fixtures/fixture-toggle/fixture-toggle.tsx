"use client";

import { useState } from "react";
import { convertDateToTimeString } from "../utils";
import { FixtureModel } from "@/models/liveFixtures/FixtureModel";

type Props = {
  children: React.ReactNode;
  fixture: FixtureModel;
};

export default function FixtureToggle({ fixture, children }: Props) {
  const {
    started,
    is_live,
    team_h_name,
    team_h_score,
    team_a_score,
    team_a_name,
  } = fixture;
  const [open, setOpen] = useState(is_live);

  return (
    <>
      <div
        className={
          started ? "fixture-container" : "fixture-container not-started"
        }
        onClick={() => started && setOpen(!open)}
      >
        <div className="home">{team_h_name}</div>

        <div className="result">
          {started
            ? `${team_h_score} | ${team_a_score}`
            : convertDateToTimeString(fixture.kickoff_time)}
        </div>

        <div className="away">{team_a_name}</div>
      </div>

      {open && children}
    </>
  );
}
