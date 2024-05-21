import { TeamCheckedModel } from '../../../models/fixturePlanning/TeamChecked';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { ShowRotationData } from '../../Fixtures/ShowRotationData/ShowRotationData';
import ThreeStateCheckbox from '../../Shared/FilterButton/ThreeStateCheckbox';
import React, { useState, FunctionComponent } from 'react';
import * as external_urls from '../../../static_urls/externalUrls';
import { PageProps, esf, fdrRotation } from '../../../models/shared/PageProps';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Popover } from '../../Shared/Popover/Popover';
import { Button } from '../../Shared/Button/Button';
import useFixtureDataESF from '../../../hooks/useFixtureDataESF';
import { createSearchQueryFromForminput, extractTeamsToUseAndTeamsInSolution, filterTeamData, setExcludedGwsFromSearchParams, toggleFilterButton, validateInput } from '../../Fixtures/fixtureUtils';
import { maxGwEsf, minGwEsf } from '../../../constants/gws';
import { FDRFormInput } from '../../../models/fixturePlanning/FDRFormInput';

export const RotationPlannerEliteserienPage : FunctionComponent<PageProps> = (props) => {
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ validationErrorMessage, setValidationErrorMessage ] = useState("");
    const [ longLoadingTimeText, setLongLoadingTimeText ] = useState('');    

    const [ teamData, setTeamData ] = useState<TeamCheckedModel[]>([]);

    const [ formInput, setFormInput ] = useState<FDRFormInput>({
        startGw: -1,
        endGw: maxGwEsf,
        minNumFixtures: 3,
        fdrType: "",
        excludeGws: setExcludedGwsFromSearchParams(),
        teamsToCheck: 2,
        teamsToPlay: 1,
        fplTeams: [],
        teamsInSolution: [],
        fixturePlanningType: fdrRotation
    });

    const [ fixturePlannerSearchQuery, setFixturePlannerSearchQuery ] = useState<string>(
        createSearchQueryFromForminput(formInput)
    );

    const { 
        isLoading, 
        fdrRotationData,
        kickOffTimes,
        maxGw 
    } = useFixtureDataESF(fixturePlannerSearchQuery, setFormInput, fdrRotation, setTeamData);
    
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
            propsContent: props.content,
            setValidationErrorMessage,
            setShowTeamFilters,
        });

        if (validInput) {
            setValidationErrorMessage("");
            const searchQuery = createSearchQueryFromForminput(body);

            setFixturePlannerSearchQuery(searchQuery);
        }
    }

    const { number_of_not_in_solution, number_of_must_be_in_solution, number_can_be_in_solution } = filterTeamData(teamData);
    
    const popoverText = `${props.content.Fixture.RotationPlanner?.title} ${props.content.LongTexts.rotationPlannerDescription_first} 

    ${props.content.LongTexts.rotationPlannerDescription_second} '${props.content.Fixture.gw_start}' ${props.content.General.and} '${props.content.Fixture.gw_end}' ${props.content.LongTexts.becomesRes} '${props.content.Fixture.teams_to_check}' ${props.content.LongTexts.rotationPlannerDescription_1} '${props.content.Fixture.teams_to_play}' ${props.content.LongTexts.rotationPlannerDescription_2}`;
    
    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container'
        leagueType={props.league_type}
        heading={props.content.Fixture.RotationPlanner?.title} 
        description={'Rotation Planner for Eliteserien Fantasy (ESF). '}
    >
        <h1>{props.content.Fixture.RotationPlanner?.title}<Popover 
            id='rotations-planner-id'
            alignLeft={true}
            popoverTitle={props.content.Fixture.RotationPlanner?.title} 
            iconSize={14}
            iconPosition={[-10, 0, 0, 3]}
            popoverText={ popoverText }>
            { props.content.LongTexts.fixtureAreFrom }
            <a href={external_urls.url_spreadsheets_dagfinn_thon}>{ props.content.LongTexts.ExcelSheet }</a>
            { props.content.LongTexts.to } Dagfinn Thon.
            <FdrBox content={props.content} leagueType={esf} />
            </Popover>
        </h1>
        { maxGw > 0 && <>
            <div className='input-row-container'>
                <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
                    <TextInput 
                        htmlFor='input-form-start-gw'
                        min={minGwEsf}
                        max={maxGw}
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
                        max={maxGw}
                        onInput={(e: number) => setFormInput((prevFormInput) => ({
                            ...prevFormInput,
                            endGw: e,
                        }))} 
                        defaultValue={formInput.endGw}
                    >
                        {props.content.Fixture.gw_end}
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
                        {props.content.Fixture.teams_to_check_1}<br/>
                        {props.content.Fixture.teams_to_check_2}
                    </TextInput>

                    <TextInput 
                        htmlFor='teams_to_play'                    
                        min={1} 
                        max={5} 
                        onInput={(e: number) => setFormInput((prevFormInput) => ({
                            ...prevFormInput,
                            teamsToPlay: e,
                        }))} 
                        defaultValue={formInput.teamsToPlay}
                    >
                        {props.content.Fixture.teams_to_play_1}<br/>
                        {props.content.Fixture.teams_to_play_2}
                    </TextInput>

                    <input className="submit" type="submit" value={props.content.General.search_button_name}>
                    </input>
                </form>
            </div>

            <div style={{ display: "flex", justifyContent: 'center' }}>
                <span style={{ color: "red", maxWidth: '375px' }}>{validationErrorMessage}</span>
            </div>
        
            {/* <ToggleButton 
                onclick={(checked: string) => changeXlsxSheet(checked)} 
                toggleButtonName="FDR-toggle"
                defaultToggleList={[ 
                    { name: props.content.General.defence, value: "_defensivt", checked: fdrType==="_defensivt", classname: "defensiv" },
                    { name: "FDR", value: "", checked:  fdrType==="", classname: "fdr" },
                    { name: props.content.General.offence, value: "_offensivt", checked:  fdrType==="_offensivt", classname: "offensiv"}
                ]}
            /> */}

            <Button 
                buttonText={props.content.Fixture.filter_button_text} 
                iconClass={`fa fa-chevron-${showTeamFilters ? "up" : "down"}`} 
                onclick={() => setShowTeamFilters(!showTeamFilters)} 
                color="white" 
            />
        </> }

        { teamData.length > 0 && showTeamFilters &&
            <div className='filter-teams-container'>
                <div className='filter-teams-description'>
                    <div><span className="dot can-be-in-solution"></span>{`Lag kan være i løsning (${number_can_be_in_solution})`}</div>
                    <div><span className="dot must-be-in-solution"></span>{`Lag må være i løsning (${number_of_must_be_in_solution})`}</div>
                    <div><span className="dot not-in-solution"></span>{`Lag er ikke i løsning (${number_of_not_in_solution})`}</div>
                </div>
                <div className='filter-teams-list'>
                    { teamData.map(team_name =>
                        <ThreeStateCheckbox 
                            checked={team_name.checked}
                            checked_must_be_in_solution={team_name.checked_must_be_in_solution}
                            onclick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => toggleFilterButton({e, teamData, setTeamData})} 
                            buttonText={team_name.team_name} 
                        />
                    )}
                <div>
                </div>
                </div>
            </div>
        }

        {isLoading && <div>
            <Spinner />
            {longLoadingTimeText && 
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <p style={{ width: '300px', textAlign: 'center'}}>
                        { longLoadingTimeText }
                    </p>
                </div> 
            }
        </div>}

        { !isLoading && fdrRotationData.length > 0 &&
            <ShowRotationData 
                content={props.content}
                fdrData={fdrRotationData}
                kickOffTimes={kickOffTimes} 
            />
        }
    </DefaultPageContainer>
    </>
};

export default RotationPlannerEliteserienPage;
