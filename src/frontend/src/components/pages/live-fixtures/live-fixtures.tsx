"use client"

import { useState } from 'react';
import { convertDateToTimeString} from './liveFixturesUtils';
import { FixtureDetails } from './fixture-details';
import GameWeekToggle from './GameweekToggle';
import { LeagueType } from '@/types/league';
import { useTranslations } from 'next-intl';
import { LiveFixturePageData } from './api';
import { useRouter } from 'next/navigation';
import './live-fixtures.css';

type LiveFixtureProps = {
  leagueType: LeagueType;
  data: LiveFixturePageData;
};

export function LiveFixturePage({ leagueType, data }: LiveFixtureProps) {
  const router = useRouter();
  const g = useTranslations('General');
  const [fixtureInfoId, setFixtureInfoId] = useState(data.liveMatchId);

  const setGw = (newGw: number) => {
  router.replace(`?gw=${newGw}`, { scroll: false });
};

  function toggleFixtureBox(id: number) {
    setFixtureInfoId(id === fixtureInfoId ? 0 : id);
  }

  const playerNameMinWidth = 120;

  if (data.fixtureData.length === 0) return null;

  return <>
    <GameWeekToggle
      gameWeeks={{
        current: data.currentGameweek,
        previous: data.previousGameweek,
        next: data.nextGameweek
      }}
      setGw={setGw}
      gwName={g("gw")}
    />
    <div className='fixture-boxes-container'>
      {data.fixtureData.map((fixture_date: any[], dateIndex: number) => (
        <div key={`date-${dateIndex}`}>
          <div className='fixture-date'>{fixture_date[0]}</div>
          {fixture_date[1].map((fixture: any) => (
            <div key={fixture.id}>
              <div
                className={fixture?.started ? 'fixture-container' : 'fixture-container not-started'}
                onClick={() => { if (fixture?.started) { toggleFixtureBox(fixture?.id) } }}
              >
                <div className='home'>{fixture.team_h_name}</div>
                <div className="result">
                  {fixture.started
                    ? `${fixture.team_h_score} | ${fixture.team_a_score}`
                    : convertDateToTimeString(fixture.kickoff_time)}
                </div>
                <div className='away'>{fixture.team_a_name}</div>
              </div>
              {fixtureInfoId === fixture?.id &&
                <FixtureDetails
                  fixture={fixture}
                  playerNameMinWidth={playerNameMinWidth}
                  hasOwnershipData={data.hasOwnershipData}
                  leagueType={leagueType}
                  gameWeeks={{
                    current: data.currentGameweek,
                    previous: data.previousGameweek,
                    next: data.nextGameweek
                  }}
                />}
            </div>
          ))}
        </div>
      ))}
    </div>
  </>;
}

// type LiveFixtureProps = {
//     leagueType: LeagueType;
// }

// export function LiveFixturePage({ 
//     leagueType
// }: LiveFixtureProps) {
//     const [ gw, setGw ] = useState(0);
//     const g = useTranslations('General');

//     const { gameWeeks, isLoading, fixtureData, fixtureInfoId, hasOwnershipData, setFixtureInfoId, errorLoading } = 
//     useLiveFixtureData(leagueType, gw, props.languageContent);

//     function toggleFixtureBox(id: string) {
//         setFixtureInfoId(id === fixtureInfoId ? "" : id);
//     }

//     const playerNameMinWidth = 120;

//     if (fixtureData?.length === 0) {
//         return null;
//     }
//     return <>
//         <GameWeekToggle gameWeeks={gameWeeks} setGw={setGw} gwName={g("gw")} />
//         <div className='fixture-boxes-container'>
//             {fixtureData.map((fixture_date: any[], dateIndex: number) => (
//                 <div key={`date-${dateIndex}`}>
//                     <div className='fixture-date'>{fixture_date[0]}</div>
//                     { fixture_date[1].map((fixture: FixtureModel) => (
//                         <div key={fixture.id}>
//                             <div 
//                                 className={fixture?.started ? 'fixture-container' : 'fixture-container not-started'} 
//                                 onClick={() => { if (fixture?.started) { toggleFixtureBox(fixture?.id)} } }
//                             >
//                                 <div className='home'>{fixture.team_h_name}</div>
//                                 <div className="result">
//                                     {fixture.started
//                                         ? `${fixture.team_h_score} | ${fixture.team_a_score}`
//                                         : convertDateToTimeString(fixture.kickoff_time)
//                                     }
//                                 </div>
//                                 <div className='away'>{fixture.team_a_name}</div>
//                             </div>
//                             {fixtureInfoId === fixture?.id &&
//                                 <FixtureDetails
//                                     fixture={fixture}
//                                     // fixtureInfoId={fixtureInfoId}
//                                     playerNameMinWidth={playerNameMinWidth}
//                                     hasOwnershipData={hasOwnershipData}
//                                     leagueType={leagueType}
//                                     gameWeeks={gameWeeks}
//                                 />
//                             }
//                         </div>
//                     )) }
//                 </div>
//             ))}
//         </div>
//     </>
// };