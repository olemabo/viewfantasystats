import { FixtureModel } from '../../../models/liveFixtures/FixtureModel';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { useState, FunctionComponent } from 'react';
import { PageProps,  fpl } from '../../../models/shared/PageProps';
import { Spinner } from '../../Shared/Spinner/Spinner';
import Popover from '../../Shared/Popover/Popover';
import './LiveFixtures.scss';
import { convertDateToTimeString} from './liveFixturesUtils';
import useLiveFixtureData from '../../../hooks/useLiveFixtures';
import { FixtureDetails } from './FixtureDetails';
import GameWeekToggle from './GameweekToggle';

export const LiveFixturesPage : FunctionComponent<PageProps> = (props) => {
    const [ gw, setGw ] = useState(0);

    const { gameWeeks, isLoading, fixtureData, fixtureInfoId, hasOwnershipData, setFixtureInfoId } = useLiveFixtureData(props.league_type, gw);

    function toggleFixtureBox(id: string) {
        setFixtureInfoId(id === fixtureInfoId ? "" : id);
    }

    if (isLoading) {
        return <Spinner />;
    }

    const playerNameMinWidth = 120;

    const description = props.league_type === fpl ? props.content.LongTexts.liveFixturesDescriptionFPL : props.content.LongTexts.liveFixturesDescription;

    return <>
    <DefaultPageContainer 
        pageClassName='live-fixtures-container'
        leagueType={props.league_type}
        heading={props.content.Statistics.LiveFixtures.title} 
        description={description}
    >
        <h1>
            {props.content.Statistics.LiveFixtures.title}
            <Popover 
                id='live-fixture-id'
                alignLeft={true}
                popoverTitle={props.content.Statistics.LiveFixtures.title} 
                iconSize={14}
                iconPosition={[-10, 0, 0, 3]}
            >
                {description}
            </Popover>
        </h1>
        {fixtureData?.length > 0 && <>
            <GameWeekToggle gameWeeks={gameWeeks} setGw={setGw} content={props.content} />
            <div className='fixture-boxes-container'>
                { fixtureData.map((fixture_date: any[]) => (
                    <div>
                        <div className='fixture-date'>{fixture_date[0]}</div>
                        { fixture_date[1].map((fixture: FixtureModel) => (
                            <>
                                <div 
                                    className={fixture?.started ? 'fixture-container' : 'fixture-container not-started'} 
                                    onClick={() => { if (fixture?.started) { toggleFixtureBox(fixture?.id)} } }
                                >
                                    <div className='home'>{fixture.team_h_name}</div>
                                    <div className="result">
                                        {fixture.started
                                            ? `${fixture.team_h_score} | ${fixture.team_a_score}`
                                            : convertDateToTimeString(fixture.kickoff_time)
                                        }
                                    </div>
                                    <div className='away'>{fixture.team_a_name}</div>
                                </div>
                                {fixtureInfoId === fixture?.id &&
                                    <FixtureDetails
                                        fixture={fixture}
                                        fixtureInfoId={fixtureInfoId}
                                        playerNameMinWidth={playerNameMinWidth}
                                        hasOwnershipData={hasOwnershipData}
                                        leagueType={props.league_type}
                                        gameWeeks={gameWeeks}
                                        propsContent={props.content}
                                    />
                                }
                            </>
                        )) }
                    </div>
                ))}
            </div></>
        }
    </DefaultPageContainer>
    </>
};

export default LiveFixturesPage;
