import { RotationPlannerTeamInfoModel } from '../../../models/fixturePlanning/RotationPlannerTeamInfo';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { ShowRotationData } from '../../Fixtures/ShowRotationData/ShowRotationData';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { TeamCheckedModel } from '../../../models/fixturePlanning/TeamChecked';
import ThreeStateCheckbox from '../../Shared/FilterButton/ThreeStateCheckbox';
import React, { useState, useEffect, FunctionComponent } from 'react';
import * as external_urls from '../../../static_urls/externalUrls';
import { PageProps } from '../../../models/shared/PageProps';
import { combinations } from '../../../utils/productRange';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Button } from '../../Shared/Button/Button';
import Popover from '../../Shared/Popover/Popover';
import { store } from '../../../store/index';
import axios from 'axios';
import TextInput from '../../Shared/TextInput/TextInput';


export const RotationPlannerPage : FunctionComponent<PageProps> = (props) => {
    const fixture_planner_kickoff_time_api_path = "/fixture-planner/get-kickoff-times/";
    const fixture_planner_api_path = "/fixture-planner/get-all-fdr-data/";
    
    const min_gw = 1;
    const max_gw = 38;

    const empty: RotationPlannerTeamInfoModel[] = [ { avg_Score: -1, id_list: [], team_name_list: [], extra_fixtures: -1, home_games: -1, fixture_list: [] }];
    const emptyGwDate: KickOffTimesModel[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];

    const [ gwStart, setGwStart ] = useState(-1);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty);
    
    const [ kickOffTimes, setKickOffTimes ] = useState(emptyGwDate);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    
    const [ teamsToCheck, setTeamsToCheck ] = useState(2);
    const [ teamsToPlay, setTeamsToPlay ] = useState(1);
    
    const [ validationErrorMessage, setValidationErrorMessage ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ firstloading, setFirstLoading ] = useState(true);
    const [ longLoadingTimeText, setLongLoadingTimeText ] = useState('');

    const emptyTeamData: TeamCheckedModel[] = [ { team_name: "empty", checked: true, checked_must_be_in_solution: false }];
    const [ teamData, setTeamData ] = useState(emptyTeamData);

    useEffect(() => {
        // get all fpl teams   
        axios.get("/fixture-planner/data-fdr-ui/").then(team_data => {
            if (team_data?.data && team_data?.data?.length > 0) {
                let teams: TeamCheckedModel[] = [];
                team_data.data.forEach( (team_i: any) => {
                    let temp_team_data = { team_name: team_i.team_name, checked: true, checked_must_be_in_solution: false }
                    teams.push(temp_team_data);
                });
                setTeamData(teams);
            }
        })

        let body = { 
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: '1',
            combinations: 'Rotation',
            teams_to_check: teamsToCheck,
            teams_to_play: teamsToPlay,
            teams_in_solution: [],
            fpl_teams: [-1],
        };
        
        // Get kickoff time data from the API
        axios.get(fixture_planner_kickoff_time_api_path).then(x => {
            if (x.data?.length > 0) {
                let temp_KickOffTimes: KickOffTimesModel[] = [];
                x.data.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimes(temp_KickOffTimes);
                setKickOffTimesToShow(temp_KickOffTimes.slice(body['start_gw'] - 1, body['end_gw']));
                extractFDRData(body, temp_KickOffTimes);
            }
        })
    }, []);

    function extractFDRData(body: any, kickofftimes?: any) {
        if (kickofftimes == null) {
            setKickOffTimesToShow(kickOffTimes.slice(body['start_gw'] - 1, body['end_gw']));
        }

        setLoading(true);
        // Get fdr data from api
        axios.post(fixture_planner_api_path, body).then(x => {
            let RotationPlannerTeamInfoList: RotationPlannerTeamInfoModel[] = [];
            let data = JSON.parse(x.data);

            if (data.gw_start != gwStart) { 
                setGwStart(data.gw_start);
            }

            if (data.gw_end != gwEnd) { 
                setGwEnd(data.gw_end);
            }

            data?.fdr_data.forEach((team: any) => {
                let team_i_json = JSON.parse(team);
                let temp: RotationPlannerTeamInfoModel = { avg_Score: team_i_json.avg_Score, 
                    id_list: team_i_json.id_list, team_name_list: team_i_json.team_name_list, 
                    extra_fixtures: team_i_json.extra_fixtures, home_games: team_i_json.home_games,
                    fixture_list: team_i_json.fixture_list}
                RotationPlannerTeamInfoList.push(temp);
            })

            if (kickofftimes != null && kickofftimes.length > 0) {
                setKickOffTimesToShow(kickofftimes.slice(data.gw_start - 1, data.gw_end));
            };

            setFdrDataToShow(RotationPlannerTeamInfoList);
            setLoading(false);
            setFirstLoading(false);
            setLongLoadingTimeText("");
        })
    }

    function toggleFilterButton(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        let temp: TeamCheckedModel[] = [];
        const classList = e.currentTarget.classList;
        const elementId = e.currentTarget.id;
        let newClassName = '';
        let currentClasslist = '';
        if (classList.contains('can-be-in-solution')) {
            currentClasslist = 'can-be-in-solution';
            newClassName = 'must-be-in-solution';
        }
        else if (classList.contains('must-be-in-solution')) {
            currentClasslist = 'must-be-in-solution';
            newClassName = 'not-in-solution';
        }
        else if (classList.contains('not-in-solution')) {
            currentClasslist = 'not-in-solution';
            newClassName = 'can-be-in-solution';
        }

        teamData.forEach(x => {
            let clickedOnCurrent = x.team_name == elementId;
            let canBeInSolution = x.checked;
            let mustBeInSolution = x.checked_must_be_in_solution;
            if (newClassName == 'can-be-in-solution' && clickedOnCurrent) {
                canBeInSolution = true;
                mustBeInSolution = false;
            }
            if (newClassName == 'must-be-in-solution' && clickedOnCurrent) {
                canBeInSolution = true;
                mustBeInSolution = true;
            }
            if (newClassName == 'not-in-solution' && clickedOnCurrent) {
                canBeInSolution = false;
                mustBeInSolution = false;
            }
            temp.push({ team_name: x.team_name, checked: canBeInSolution, checked_must_be_in_solution: mustBeInSolution });
        });
        
        setTeamData(temp);
        
        classList.replace(currentClasslist, newClassName)
    }

    function extractTeamsToUseAndTeamsInSolution() {
        let teamsToCheck: any[] = [];
        let teamsMustBeInSolution: any[] = [];
        teamData.forEach(x => {
            if (x.checked) { teamsToCheck.push(x.team_name); }
            if (x.checked_must_be_in_solution) { teamsMustBeInSolution.push(x.team_name); }
        });

        if (teamsToCheck.length == 0) { teamsToCheck = [-1]; }

        return [teamsToCheck, teamsMustBeInSolution]
    }

    function validateInput(body: any) {
        if (body.start_gw > body.end_gw) { 
            setValidationErrorMessage(`'${props.content.Fixture.gw_start.replace(":", "")} ${props.content.Fixture.must_be_smaller} '${props.content.Fixture.gw_end.replace(":", "")}'.`);
            return false;
        }

        if (body.teams_to_play > body.teams_to_check) { 
            setValidationErrorMessage(`'${props.content.Fixture.teams_to_play.replace(":", "")}' ${props.content.Fixture.must_be_smaller} '${props.content.Fixture.teams_to_check.replace(":", "")}'.`);
            return false;
        }

        if (body.teams_in_solution.length > body.teams_to_check) {
            const validationText = `'Antall lag' (${body.teams_to_check}) bestemmer hvor mange lag som
            skal være i løsningen. 'Lag må være i løsningen' kan derfor ikke være ${body.teams_in_solution.length}.`
            setValidationErrorMessage(validationText);
            setShowTeamFilters(true);
            return false;
        }
        
        return true;
    }
    
    function updateFDRData() {
        let teamsANDteamsinsolution = extractTeamsToUseAndTeamsInSolution();

        var body = {
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: '1',
            combinations: 'Rotation',
            teams_to_check: teamsToCheck,
            teams_to_play: teamsToPlay,
            teams_in_solution: teamsANDteamsinsolution[1],
            fpl_teams: teamsANDteamsinsolution[0],
        };

        if (validateInput(body)) {
            setValidationErrorMessage("");
            const numberOfCombintaions = numberOfUniqueCombinations();
            if (numberOfCombintaions > 1000) {
                setLongLoadingTimeText(numberOfCombintaions + " kombinasjoner skal sjekkes så denne utregningen kan ta litt tid."
                + " For å redusere utregningstiden kan du bruke 'Filtrer lag' til å velge lag du vet skal være i løsningen, eller fjern lag du vet ikke skal være i løsningen :)"
                )
            }
            extractFDRData(body);
        }
    }

    function filterTeamData() {
        let not_in_solution: string[] = [];
        let must_be_in_solution: string[] = [];
        teamData.map(team_data => {
            if (team_data.checked_must_be_in_solution) {
                must_be_in_solution.push(team_data.team_name)
            }
            if (!team_data.checked) {
                not_in_solution.push(team_data.team_name)
            }
        })
        const number_of_not_in_solution = not_in_solution.length;
        const number_of_must_be_in_solution = must_be_in_solution.length;
        const number_can_be_in_solution = teamData.length - number_of_not_in_solution - number_of_must_be_in_solution;
        return { number_of_not_in_solution: number_of_not_in_solution, number_of_must_be_in_solution:number_of_must_be_in_solution , number_can_be_in_solution: number_can_be_in_solution }
    }

    const { number_of_not_in_solution, number_of_must_be_in_solution, number_can_be_in_solution } = filterTeamData();

    function numberOfUniqueCombinations() {
        return combinations(number_can_be_in_solution, teamsToCheck - number_of_must_be_in_solution)
    }

    const popoverText = `${props.content.Fixture.RotationPlanner?.title} ${props.content.LongTexts.rotationPlannerDescription} 
    '${props.content.Fixture.gw_start} ' ${props.content.General.and} ' ${props.content.Fixture.gw_end} ' ${props.content.LongTexts.becomesRes}
    '${props.content.Fixture.teams_to_check}' ${props.content.LongTexts.rotationPlannerDescription_1} 
    '${props.content.Fixture.teams_to_play}' ${props.content.LongTexts.rotationPlannerDescription_2}`;
    

    return <>
    <DefaultPageContainer pageClassName='fixture-planner-container' heading={props.content.Fixture.RotationPlanner?.title + " - " + (store.getState().league_type === "fpl" ? "Premier League" : "Eliteserien")} description={props.content.Fixture.RotationPlanner?.title}>
         <h1>{props.content.Fixture.RotationPlanner?.title}
         <Popover 
            id={"rotations-planner-id"}
            title=""
            algin_left={true}
            popover_title={props.content.Fixture.RotationPlanner?.title} 
            iconSize={14}
            iconpostition={[-10, 0, 0, 3]}
            popover_text={ popoverText }>
           { props.content.LongTexts.fixtureAreFrom }
            <a href={external_urls.url_offical_fantasy_premier_league}>Fantasy Premier League.</a>
            <FdrBox content={props.content} />
            </Popover>
         </h1>
         { !firstloading && <>
            <div className='input-row-container'>
                <Button buttonText={props.content.Fixture.filter_button_text} 
                    icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
                    onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} 
                    color='white'    
                />
                
                <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
                    <TextInput 
                        htmlFor='input-form-start-gw'
                        min={min_gw}
                        max={max_gw}
                        onInput={(e: number) => setGwStart(e)} 
                        defaultValue={gwStart}>
                        {props.content.Fixture.gw_start}
                    </TextInput>
                    <TextInput 
                        htmlFor='input-form-end-gw'
                        min={gwStart}
                        max={max_gw}
                        onInput={(e: number) => setGwEnd(e)} 
                        defaultValue={gwEnd}>
                        {props.content.Fixture.gw_end}
                    </TextInput>
                    <TextInput 
                        htmlFor='teams_to_check'                    
                        min={1} 
                        max={5} 
                        onInput={(e: number) => setTeamsToCheck(e)} 
                        defaultValue={teamsToCheck}>
                        {/* {props.content.Fixture.teams_to_check} */}
                        {props.content.Fixture.teams_to_check_1}<br/>
                        {props.content.Fixture.teams_to_check_2}
                    </TextInput>
                    <TextInput 
                        htmlFor='teams_to_play'                    
                        min={1} 
                        max={5} 
                        onInput={(e: number) => setTeamsToPlay(e)} 
                        defaultValue={teamsToCheck}>
                        {/* {props.content.Fixture.teams_to_play} */}
                        {props.content.Fixture.teams_to_play_1}<br/>
                        {props.content.Fixture.teams_to_play_2}
                    </TextInput>

                    <input className="submit" type="submit" value={props.content.General.search_button_name}>
                    </input>
                </form>
            </div>
            
            { validationErrorMessage && 
                <div style={{ display: "flex", justifyContent: 'center' }}>
                    <span style={{ color: "red", maxWidth: '375px' }}>{validationErrorMessage}</span>
                </div>
            }

            { teamData != null && teamData.length > 0 && teamData[0].team_name != "empty" && showTeamFilters &&
                <div className='filter-teams-container'>
                    <div className='filter-teams-description'>
                        <div><span className="dot can-be-in-solution"></span>{`${props.content.Fixture.RotationPlanner.teams_can_be_in_solution} (${number_can_be_in_solution})`}</div>
                        <div><span className="dot must-be-in-solution"></span>{`${props.content.Fixture.RotationPlanner.teams_must_be_in_solution} (${number_of_must_be_in_solution})`}</div>
                        <div><span className="dot not-in-solution"></span>{`${props.content.Fixture.RotationPlanner.teams_cant_be_in_solution} (${number_of_not_in_solution})`}</div>
                    </div>
                    <div className='filter-teams-list'>
                        { teamData.map(team_name =>
                            <ThreeStateCheckbox 
                                checked={team_name.checked}
                                checked_must_be_in_solution={team_name.checked_must_be_in_solution}
                                onclick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => toggleFilterButton(e)} 
                                buttonText={team_name.team_name} />
                        )}
                        <div>
                        </div>
                    </div>
                </div>
            }

            { loading && <div>
                <Spinner />
                { longLoadingTimeText && 
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <p style={{ width: '300px', textAlign: 'center'}}>
                            { longLoadingTimeText }
                        </p>
                    </div> }
                </div> }

            { !loading && fdrDataToShow.length > 0 && fdrDataToShow[0].avg_Score != -1 &&
                <ShowRotationData 
                    content={props.content}
                    fdrData={fdrDataToShow}
                    kickOffTimes={kickOffTimesToShow}    
                />
            }</>
        }
        { firstloading && <Spinner /> }
    </DefaultPageContainer></>
};

export default RotationPlannerPage;
