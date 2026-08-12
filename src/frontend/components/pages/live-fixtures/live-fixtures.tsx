import FixtureToggle from "./fixture-toggle/fixture-toggle";
import GameWeekToggle from "./gameweek-toggle/gameweek-toggle";
import { LeagueType } from "@/types/league";
import { LiveFixturePageData } from "./api";
import "./live-fixtures.css";
import { FixtureDetails } from "./fixture-details";

export type GameWeeks = {
  current: number;
  previous: number;
  next: number;
};

type LiveFixtureProps = {
  leagueType: LeagueType;
  data: LiveFixturePageData;
};

export function LiveFixturePage({ leagueType, data }: LiveFixtureProps) {
  const {
    currentGameweek,
    previousGameweek,
    nextGameweek,
    hasOwnershipData,
    fixtureData,
  } = data;

  if (fixtureData.length === 0) return null;

  const gameWeeks: GameWeeks = {
    current: currentGameweek,
    previous: previousGameweek,
    next: nextGameweek,
  };

  return (
    <>
      <GameWeekToggle {...gameWeeks} />
      <div className="fixture-boxes-container">
        {fixtureData.map(([date, fixtures], dateIndex) => (
          <div key={`date-${dateIndex}`}>
            <div className="fixture-date">{date}</div>
            {fixtures.map((fixture) => (
              <FixtureToggle key={fixture.id} fixture={fixture}>
                <FixtureDetails
                  fixture={fixture}
                  hasOwnershipData={hasOwnershipData}
                  leagueType={leagueType}
                  gameWeeks={gameWeeks}
                />
              </FixtureToggle>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
