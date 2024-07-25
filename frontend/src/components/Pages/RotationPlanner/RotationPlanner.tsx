import { createSearchQueryFromForminput, extractTeamsToUseAndTeamsInSolution, filterTeamData, toggleFilterButton, validateInput } from '../../Fixtures/fixtureUtils';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { ShowRotationData } from '../../Fixtures/ShowRotationData/ShowRotationData';
import ThreeStateCheckbox from '../../Shared/FilterButton/ThreeStateCheckbox';
import React, { useState, FunctionComponent } from 'react';
import * as external_urls from '../../../static_urls/externalUrls';
import { FixturePlanningProps, PageProps, fdrRotation } from '../../../models/shared/PageProps';
import { combinations } from '../../../utils/productRange';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Button } from '../../Shared/Button/Button';
import Popover from '../../Shared/Popover/Popover';
import useFixtureDataFPL from '../../../hooks/useFixtureDataFPL';
import { maxGwFpl, minGwFpl } from '../../../constants/gws';
import useFetchTeamData from '../../../hooks/useFixtureTeamData';
import Message from '../../Shared/Messages/Messages';
import { FDRFormInput } from '../../../models/fixturePlanning/FDRFormInput';

export const RotationPlannerPage : FunctionComponent<PageProps & FixturePlanningProps> = (props) => {
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ validationErrorMessage, setValidationErrorMessage ] = useState("");
    const [ longLoadingTimeText, setLongLoadingTimeText ] = useState('');
    const [ formInput, setFormInput ] = useState<FDRFormInput>({
        startGw: -1,
        endGw: maxGwFpl,
        minNumFixtures: 3,
        fdrType: "",
        teamsToCheck: 2,
        teamsToPlay: 1,
        fplTeams: [],
        teamsInSolution: [],
        fixturePlanningType: fdrRotation
    });
    const [ fixturePlannerSearchQuery, setFixturePlannerSearchQuery ] = useState<string>(
        createSearchQueryFromForminput(formInput)
    );

    const { teamData, setTeamData, loadingTeamData } = useFetchTeamData(); 

    const { 
        isLoadingFixturedata, 
        errorLoading,
        fdrRotationData,
        kickOffTimes,
    } = useFixtureDataFPL(fixturePlannerSearchQuery, setFormInput, props);

    function updateFDRData() {
        let teamsANDteamsinsolution = extractTeamsToUseAndTeamsInSolution(teamData);

        var body: FDRFormInput = {
            startGw: formInput.startGw,
            endGw: formInput.endGw,
            minNumFixtures: formInput.minNumFixtures,
            fixturePlanningType: fdrRotation,
            teamsToCheck: formInput.teamsToCheck,
            teamsToPlay: formInput.teamsToPlay,
            teamsInSolution: teamsANDteamsinsolution[1],
            fplTeams: teamsANDteamsinsolution[0],
            fdrType: "", // This is for changing excel sheets
            excludeGws: formInput.excludeGws,
        };

        const validInput = validateInput({
            body,
            propsContent: props.languageContent,
            setValidationErrorMessage,
            setShowTeamFilters,
        });

        if (validInput) {
            setValidationErrorMessage("");
            const searchQuery = createSearchQueryFromForminput(body);

            const numberOfCombintaions = numberOfUniqueCombinations();
            if (numberOfCombintaions > 1000) {
                setLongLoadingTimeText(numberOfCombintaions + " kombinasjoner skal sjekkes så denne utregningen kan ta litt tid."
                + " For å redusere utregningstiden kan du bruke 'Filtrer lag' til å velge lag du vet skal være i løsningen, eller fjern lag du vet ikke skal være i løsningen :)"
                )
            };

            setFixturePlannerSearchQuery(searchQuery);
        }
    }

    const { number_of_not_in_solution, number_of_must_be_in_solution, number_can_be_in_solution } = filterTeamData(teamData);

    function numberOfUniqueCombinations() {
        return combinations(number_can_be_in_solution, formInput.teamsToCheck ?? 0 - number_of_must_be_in_solution)
    }

    const popoverText = `${props.languageContent.Fixture.RotationPlanner?.title} ${props.languageContent.LongTexts.rotationPlannerDescription_first}
    ${props.languageContent.LongTexts.rotationPlannerDescription_second}'${props.languageContent.Fixture.gw_start}' ${props.languageContent.General.and} '${props.languageContent.Fixture.gw_end}' ${props.languageContent.LongTexts.becomesRes} '${props.languageContent.Fixture.teams_to_check}' ${props.languageContent.LongTexts.rotationPlannerDescription_1} '${props.languageContent.Fixture.teams_to_play}' ${props.languageContent.LongTexts.rotationPlannerDescription_2}`;

    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container'
        leagueType={props.leagueType}
        heading={props.languageContent.Fixture.RotationPlanner?.title} 
        description={props.languageContent.Fixture.RotationPlanner?.title + " - " + " Rotasjonsplanlegger viser kombinasjoner av lag som kan roteres for å gi best mulig kampprogram."}
        isLoading={isLoadingFixturedata}
        errorLoading={errorLoading}
        renderTitle={() => 
            <h1>
                {props.languageContent.Fixture.RotationPlanner?.title}
                <Popover 
                    id='rotations-planner-id'
                    alignLeft={true}
                    popoverTitle={props.languageContent.Fixture.RotationPlanner?.title} 
                    iconSize={14}
                    iconPosition={[-10, 0, 0, 3]}
                    popoverText={popoverText}
                >
                    {props.languageContent.LongTexts.fixtureAreFrom }
                    <a href={external_urls.url_offical_fantasy_premier_league}>Fantasy Premier League.</a>
                    <FdrBox content={props.languageContent} />
                </Popover>
            </h1>
        }
    >
        <div className='input-row-container'>
            <Button 
                buttonText={props.languageContent.Fixture.filter_button_text} 
                iconClass={`fa fa-chevron-${showTeamFilters ? 'up' : 'down'}`}
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
                    {props.languageContent.Fixture.gw_start}
                </TextInput>
                <TextInput 
                    htmlFor='input-form-end-gw'
                    min={formInput.startGw}
                    max={maxGwFpl}
                    onInput={(e: number) => setFormInput((prevFormInput) => ({
                        ...prevFormInput,
                        endGw: e,
                    }))} 
                    defaultValue={formInput.endGw}
                >
                    {props.languageContent.Fixture.gw_end}
                </TextInput>
                <TextInput 
                    htmlFor='teams_to_check'                    
                    min={1} 
                    max={5} 
                    onInput={(e: number) => setFormInput((prevFormInput) => ({
                        ...prevFormInput,
                        teamsToCheck: e,
                    }))} 
                    defaultValue={formInput.teamsToCheck}
                >
                    {props.languageContent.Fixture.teams_to_check_1}<br/>
                    {props.languageContent.Fixture.teams_to_check_2}
                </TextInput>
                <TextInput 
                    htmlFor='teams_to_play'                    
                    min={1} 
                    max={5} 
                    onInput={(e: number) => setFormInput((prevFormInput) => ({
                        ...prevFormInput,
                        teamsToPlay: e,
                    }))}
                    defaultValue={formInput.teamsToPlay}>
                    {props.languageContent.Fixture.teams_to_play_1}<br/>
                    {props.languageContent.Fixture.teams_to_play_2}
                </TextInput>

                <input className="submit" type="submit" value={props.languageContent.General.search_button_name} />
            </form>
        </div>
        
        { validationErrorMessage && 
            <div style={{ display: "flex", justifyContent: 'center' }}>
                <span style={{ color: "red", maxWidth: '375px' }}>{validationErrorMessage}</span>
            </div>
        }

        { teamData.length > 0 && showTeamFilters &&
            <div className='filter-teams-container'>
                <div className='filter-teams-description'>
                    <div><span className="dot can-be-in-solution"></span>{`${props.languageContent.Fixture.RotationPlanner.teams_can_be_in_solution} (${number_can_be_in_solution})`}</div>
                    <div><span className="dot must-be-in-solution"></span>{`${props.languageContent.Fixture.RotationPlanner.teams_must_be_in_solution} (${number_of_must_be_in_solution})`}</div>
                    <div><span className="dot not-in-solution"></span>{`${props.languageContent.Fixture.RotationPlanner.teams_cant_be_in_solution} (${number_of_not_in_solution})`}</div>
                </div>
                <div className='filter-teams-list'>
                    { teamData.map(team_name =>
                        <ThreeStateCheckbox 
                            checked={team_name.checked}
                            checked_must_be_in_solution={team_name.checked_must_be_in_solution}
                            onclick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => toggleFilterButton({e, teamData, setTeamData})} 
                            buttonText={team_name.team_name} />
                    )}
                    <div>
                    </div>
                </div>
            </div>
        }

        { loadingTeamData || isLoadingFixturedata && <div>
            <Spinner />
            {longLoadingTimeText && 
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <p style={{ width: '300px', textAlign: 'center'}}>
                        <Message messageType='info' messageText={longLoadingTimeText}/>
                    </p>
                </div> 
                }
        </div>}

        { !isLoadingFixturedata && fdrRotationData.length > 0 &&
            <ShowRotationData 
                content={props.languageContent}
                fdrData={fdrRotationData}
                kickOffTimes={kickOffTimes}    
            />
        }
    </DefaultPageContainer>
    </>
};

export default RotationPlannerPage;
