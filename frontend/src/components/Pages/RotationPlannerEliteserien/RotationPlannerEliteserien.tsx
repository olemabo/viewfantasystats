import { TeamCheckedModel } from '../../../models/fixturePlanning/TeamChecked';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { ShowRotationData } from '../../Fixtures/ShowRotationData/ShowRotationData';
import ThreeStateCheckbox from '../../Shared/FilterButton/ThreeStateCheckbox';
import React, { useState, FunctionComponent } from 'react';
import * as external_urls from '../../../static_urls/externalUrls';
import { FixturePlanningProps, PageProps, esf, fdrRotation } from '../../../models/shared/PageProps';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Popover } from '../../Shared/Popover/Popover';
import { Button } from '../../Shared/Button/Button';
import useFixtureDataESF from '../../../hooks/useFixtureDataESF';
import { createSearchQueryFromForminput, extractTeamsToUseAndTeamsInSolution, filterTeamData, setExcludedGwsFromSearchParams, toggleFilterButton, validateInput } from '../../Fixtures/fixtureUtils';
import { maxGwEsf, minGwEsf } from '../../../constants/gws';
import { FDRFormInput } from '../../../models/fixturePlanning/FDRFormInput';

export const RotationPlannerEliteserienPage : FunctionComponent<PageProps & FixturePlanningProps> = (props) => {
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
    } = useFixtureDataESF(fixturePlannerSearchQuery, setFormInput, props, setTeamData);
    
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

            setFixturePlannerSearchQuery(searchQuery);
        }
    }

    const { number_of_not_in_solution, number_of_must_be_in_solution, number_can_be_in_solution } = filterTeamData(teamData);
    
    const popoverText = `${props.languageContent.Fixture.RotationPlanner?.title} ${props.languageContent.LongTexts.rotationPlannerDescription_first} 

    ${props.languageContent.LongTexts.rotationPlannerDescription_second} '${props.languageContent.Fixture.gw_start}' ${props.languageContent.General.and} '${props.languageContent.Fixture.gw_end}' ${props.languageContent.LongTexts.becomesRes} '${props.languageContent.Fixture.teams_to_check}' ${props.languageContent.LongTexts.rotationPlannerDescription_1} '${props.languageContent.Fixture.teams_to_play}' ${props.languageContent.LongTexts.rotationPlannerDescription_2}`;
    
    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container'
        leagueType={props.leagueType}
        heading={props.languageContent.Fixture.RotationPlanner?.title} 
        description={'Rotation Planner for Eliteserien Fantasy (ESF). '}
    >
        <h1>{props.languageContent.Fixture.RotationPlanner?.title}<Popover 
            id='rotations-planner-id'
            alignLeft={true}
            popoverTitle={props.languageContent.Fixture.RotationPlanner?.title} 
            iconSize={14}
            iconPosition={[-10, 0, 0, 3]}
            popoverText={ popoverText }>
            { props.languageContent.LongTexts.fixtureAreFrom }
            <a href={external_urls.url_spreadsheets_dagfinn_thon}>{ props.languageContent.LongTexts.ExcelSheet }</a>
            { props.languageContent.LongTexts.to } Dagfinn Thon.
            <FdrBox content={props.languageContent} leagueType={esf} />
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
                        {props.languageContent.Fixture.gw_start}
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
                        defaultValue={formInput.teamsToPlay}
                    >
                        {props.languageContent.Fixture.teams_to_play_1}<br/>
                        {props.languageContent.Fixture.teams_to_play_2}
                    </TextInput>

                    <input className="submit" type="submit" value={props.languageContent.General.search_button_name}>
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
                    { name: props.languageContent.General.defence, value: "_defensivt", checked: fdrType==="_defensivt", classname: "defensiv" },
                    { name: "FDR", value: "", checked:  fdrType==="", classname: "fdr" },
                    { name: props.languageContent.General.offence, value: "_offensivt", checked:  fdrType==="_offensivt", classname: "offensiv"}
                ]}
            /> */}

            <Button 
                buttonText={props.languageContent.Fixture.filter_button_text} 
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
                    { teamData.map(team =>
                        <ThreeStateCheckbox 
                            checked={team.checked}
                            checked_must_be_in_solution={team.checked_must_be_in_solution}
                            onclick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => toggleFilterButton({e, teamData, setTeamData})} 
                            buttonText={team.team_name} 
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
                content={props.languageContent}
                fdrData={fdrRotationData}
                kickOffTimes={kickOffTimes} 
            />
        }
    </DefaultPageContainer>
    </>
};

export default RotationPlannerEliteserienPage;
