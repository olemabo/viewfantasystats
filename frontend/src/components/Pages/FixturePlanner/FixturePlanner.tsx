import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { useState, FunctionComponent } from 'react';
import { ShowFDRData } from '../../Fixtures/ShowFDRData/ShowFDRData';
import FilterTeamBox from '../../Shared/FilterTeamBox/FilterTeamBox';
import * as external_urls from '../../../static_urls/externalUrls';
import { FixturePlanningProps, PageProps, fdrPeriode } from '../../../models/shared/PageProps';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import { Button } from '../../Shared/Button/Button';
import Popover from '../../Shared/Popover/Popover';
import Spinner from '../../Shared/Spinner/Spinner';
import { getTitleAndDescriptionFPL } from '../../Fixtures/fixtureTitleDescriptionUtils';
import useFixtureDataFPL from '../../../hooks/useFixtureDataFPL';
import { createSearchQueryFromForminput, filterFdrData } from '../../Fixtures/fixtureUtils';
import { maxGwFpl, minGwFpl, minNumberOfFixture } from '../../../constants/gws';
import { FDRFormInput } from '../../../models/fixturePlanning/FDRFormInput';

export const FixturePlannerPage : FunctionComponent<PageProps & FixturePlanningProps> = (props) => {
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ toggleTeams, SetToggleTeams ] = useState<string[]>([]);
    const [ formInput, setFormInput ] = useState<FDRFormInput>({
        startGw: -1,
        endGw: maxGwFpl,
        minNumFixtures: 3,
        fdrType: '',
        fixturePlanningType: props.fixturePlanningType
    });
    const [ fixturePlannerSearchQuery, setFixturePlannerSearchQuery ] = useState<string>(
        createSearchQueryFromForminput(formInput)
    );
    
    const { 
        isLoadingFixturedata,
        kickOffTimes,
        fdrData,
    } = useFixtureDataFPL(fixturePlannerSearchQuery, setFormInput, props.fixturePlanningType);

    function updateFDRData() {
        const query = createSearchQueryFromForminput(formInput);
        setFixturePlannerSearchQuery(query);
    }

    const filteredFdrData = filterFdrData(fdrData, toggleTeams);

    if (isLoadingFixturedata) {
        return <Spinner />;
    }

    const { title, description } = getTitleAndDescriptionFPL(props.content, props.fixturePlanningType);

    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container'
        leagueType={props.league_type}
        description={description}
        heading={title}>
        <h1>
            {title}
            <Popover 
                id='rotations-planner-id'
                alignLeft={true}
                popoverTitle={title} 
                iconSize={14}
                iconPosition={[-10, 0, 0, 3]}
                popoverText={description}
            >
                { props.content.LongTexts.fixtureAreFrom }
                <a href={external_urls.url_offical_fantasy_premier_league}>Fantasy Premier League.</a>
                <FdrBox content={props.content} />
            </Popover>
        </h1>
        
        <div className='input-row-container'>
            <Button 
                buttonText={props.content.Fixture.filter_button_text} 
                iconClass={`fa fa-chevron-${showTeamFilters ? "up" : "down"}`}
                onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} 
                color='white' 
            />
            
            <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
                <TextInput 
                    htmlFor='input-form-start-gw'
                    min={minGwFpl}
                    max={maxGwFpl}
                    onInput={(e: number) => setFormInput((prevFormInput) => ({
                        ...prevFormInput,
                        startGw: e,
                    }))} 
                    defaultValue={formInput.startGw}>
                    {props.content.Fixture.gw_start}
                </TextInput>
                <TextInput 
                    htmlFor='input-form-end-gw'
                    min={formInput.startGw}
                    max={maxGwFpl}
                    onInput={(e: number) => setFormInput((prevFormInput) => ({
                        ...prevFormInput,
                        endGw: e,
                    }))} 
                    defaultValue={formInput.endGw}>
                    {props.content.Fixture.gw_end}
                </TextInput>

                { props.fixturePlanningType === fdrPeriode && 
                    <TextInput 
                        onInput={(e: number) => setFormInput((prevFormInput) => ({
                            ...prevFormInput,
                            minNumFixtures: e,
                        }))}
                        defaultValue={formInput.minNumFixtures}
                        min={minNumberOfFixture}
                        htmlFor='min-num-fixtures'
                        max={formInput.endGw - formInput.startGw}>
                        {props.content.Fixture.min_fixtures.split(/(\s+)/)[0]}<br/>
                        {props.content.Fixture.min_fixtures.split(/(\s+)/)[2]}
                    </TextInput>
                }

                <input className="submit" type="submit" value={props.content.General.search_button_name} />
            </form>
        </div>

        { filteredFdrData.length > 0 && showTeamFilters &&
            <FilterTeamBox
                removeAllText={props.content.Fixture.removeAllText} 
                addAllText={props.content.Fixture.addAllText} 
                setToggleTeams={SetToggleTeams}
                fdrData={filteredFdrData}
                displayUncheckAll={true}
            />
        }

        { filteredFdrData.length > 0 && kickOffTimes.length > 0 && (
            <ShowFDRData 
                warningMessage={props.content.Fixture.noTeamsChosen}
                kickOffTimes={kickOffTimes}
                fdrData={filteredFdrData}
                allowToggleBorder={true}
                content={props.content}
            />
        )}
    </DefaultPageContainer>
    </>
};

export default FixturePlannerPage;