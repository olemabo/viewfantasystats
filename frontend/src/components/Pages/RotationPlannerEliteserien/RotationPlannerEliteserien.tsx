import { RotationPlannerTeamModel } from '../../../models/fixturePlanning/RotationPlannerTeam';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { TeamCheckedModel } from '../../../models/fixturePlanning/TeamChecked';

import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { ShowRotationData } from '../../Fixtures/ShowRotationData/ShowRotationData';
import ThreeStateCheckbox from '../../Shared/FilterButton/ThreeStateCheckbox';
import React, { useState, useEffect, FunctionComponent } from 'react';
import * as external_urls from '../../../static_urls/externalUrls';
import ToggleButton from '../../Shared/ToggleButton/ToggleButton';
import { PageProps, esf } from '../../../models/shared/PageProps';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Popover } from '../../Shared/Popover/Popover';
import { Button } from '../../Shared/Button/Button';
import { store } from '../../../store/index';
import axios from 'axios';


export const RotationPlannerEliteserienPage : FunctionComponent<PageProps> = (props) => {
    const fixture_planner_api_path = "/fixture-planner-eliteserien/get-all-eliteserien-fdr-data/";
    const min_gw = 1;
    const max_gw = 30;
    const empty: RotationPlannerTeamModel[] = [ { avg_Score: -1, id_list: [], team_name_list: [], extra_fixtures: -1, home_games: -1, fixture_list: [] }];
    const emptyGwDate: KickOffTimesModel[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];

    const [ gwStart, setGwStart ] = useState(21);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ fdrType, SetFdrType ] = useState("");
    const emptyTeamData: TeamCheckedModel[] = [ { team_name: "empty", checked: true, checked_must_be_in_solution: false }];
    const [ teamData, setTeamData ] = useState(emptyTeamData);
    const [ fdrToColor, setFdrToColor ] = useState({0.5: "0.5", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5"});
    const [ maxGw, setMaxGw ] = useState(-1);
    const [ teamsToCheck, setTeamsToCheck ] = useState(2);
    const [ teamsToPlay, setTeamsToPlay ] = useState(1);
    const [ validationErrorMessage, setValidationErrorMessage ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ longLoadingTimeText, setLongLoadingTimeText ] = useState('');
    const [ excludeGws, setExcludeGws ] = useState([-1]);

    useEffect(() => {
        // get all fpl teams   
        if (store.getState()?.league_type !== esf) {
            store.dispatch({type: "league_type", payload: esf});
        }

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const exclude_gws = urlParams.getAll('exclude_gws')

        var temp: number[] = [];
        if (exclude_gws !== null && Array.isArray(exclude_gws)) {
            exclude_gws.forEach((x: string) => {
                const myNumber = Number(x);
                if (!isNaN(myNumber)) {
                    temp.push(myNumber)
                }

            })
            setExcludeGws(temp)
        }
        
        // Get fdr data from the API
        let body = { 
            start_gw: gwStart,
            end_gw: gwStart + 5,
            min_num_fixtures: '1',
            combinations: 'Rotation',
            teams_to_check: teamsToCheck,
            teams_to_play: teamsToPlay,
            teams_in_solution: [],
            fpl_teams: [-1],
            fdr_type: fdrType,
            excludeGws: temp,
        };

        extractFDRData(body)
    }, []);

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

    function extractFDRData(body: any) {
        setLoading(true);
        axios.post(fixture_planner_api_path, body).then(x => {
            let RotationPlannerTeamInfoList: RotationPlannerTeamModel[] = [];
            let data = JSON.parse(x.data);
            
            if (data.gw_start != gwStart) { 
                setGwStart(data.gw_start);
            }

            if (data.gw_end != gwEnd) { 
                setGwEnd(data.gw_end);
            }

            if (maxGw < 0) { 
                setMaxGw(data.max_gw); 
                setGwEnd(data.gws_and_dates.length); 
            }

            setFdrToColor(data.fdr_to_colors_dict);
            if (data?.gws_and_dates?.length > 0) {
                let temp_KickOffTimes: KickOffTimesModel[] = [];
                data?.gws_and_dates.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimesToShow(temp_KickOffTimes);
                setGwEnd(data.gw_end); 
            }

            var emptyTeamData: TeamCheckedModel[] = [];
            if (data?.team_name_color?.length > 0 && teamData.length < 2) {
                data?.team_name_color.forEach( (x: string[]) => {
                    emptyTeamData.push({ team_name: x[0], checked: true, checked_must_be_in_solution: false })
                });
                setTeamData(emptyTeamData);
            }

            data.fdr_data.forEach((team: any) => {
                
                let team_i_json = JSON.parse(team);
                let temp: RotationPlannerTeamModel = { avg_Score: team_i_json.avg_Score, 
                    id_list: team_i_json.id_list, team_name_list: team_i_json.team_name_list, 
                    extra_fixtures: team_i_json.extra_fixtures, home_games: team_i_json.home_games,
                    fixture_list: team_i_json.fixture_list}
                RotationPlannerTeamInfoList.push(temp);
            })

            setFdrDataToShow(RotationPlannerTeamInfoList);
            setLoading(false);
            setLongLoadingTimeText("");
        })
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
    
    function updateFDRData(currentFdrType: string) {
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
            fdr_type: currentFdrType,
            excludeGws: excludeGws,
        };

        if (validateInput(body)) {
            setValidationErrorMessage("");
            extractFDRData(body);
        }
    }

    function changeXlsxSheet(fdr_type: string) {
        SetFdrType(fdr_type);
        updateFDRData(fdr_type)
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

    const { number_of_not_in_solution, number_of_must_be_in_solution, number_can_be_in_solution } = filterTeamData();
    
    const popoverText = `${props.content.Fixture.RotationPlanner?.title} ${props.content.LongTexts.rotationPlannerDescription} 
    '${props.content.Fixture.gw_start} ' ${props.content.General.and} ' ${props.content.Fixture.gw_end} ' ${props.content.LongTexts.becomesRes}
    '${props.content.Fixture.teams_to_check} ' ${props.content.LongTexts.rotationPlannerDescription_1} 
    '${props.content.Fixture.teams_to_play}' ${props.content.LongTexts.rotationPlannerDescription_2}`;
    
    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container' 
        heading={props.content.Fixture.RotationPlanner?.title + " - " + (store.getState().league_type === "fpl" ? "Premier League" : "Eliteserien")} 
        description={'Rotation Planner for Eliteserien Fantasy (ESF). '}>
        <h1>{props.content.Fixture.RotationPlanner?.title}<Popover 
            id={"rotations-planner-id"}
            title=""
            algin_left={true}
            popover_title={props.content.Fixture.RotationPlanner?.title} 
            iconSize={14}
            iconpostition={[-10, 0, 0, 3]}
            popover_text={ popoverText }>
            { props.content.LongTexts.fixtureAreFrom }
            <a href={external_urls.url_spreadsheets_dagfinn_thon}>{ props.content.LongTexts.ExcelSheet }</a>
            { props.content.LongTexts.to } Dagfinn Thon.
            { fdrToColor != null && 
                <FdrBox content={props.content} leagueType={esf} />
            }
            </Popover>
        </h1>
        { maxGw > 0 && <>
            <div className='input-row-container'>
                <form onSubmit={(e) =>  {updateFDRData(fdrType); e.preventDefault()}}>
                    <TextInput 
                        htmlFor='input-form-start-gw'
                        min={min_gw}
                        max={maxGw}
                        onInput={(e: number) => setGwStart(e)} 
                        defaultValue={gwStart}>
                        {props.content.Fixture.gw_start}
                    </TextInput>

                    <TextInput 
                        htmlFor='input-form-end-gw'
                        min={gwStart}
                        max={maxGw}
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

            <div style={{ display: "flex", justifyContent: 'center' }}>
                <span style={{ color: "red", maxWidth: '375px' }}>{validationErrorMessage}</span>
            </div>
        
            <ToggleButton 
                onclick={(checked: string) => changeXlsxSheet(checked)} 
                toggleButtonName="FDR-toggle"
                defaultToggleList={[ 
                    { name: props.content.General.defence, value: "_defensivt", checked: fdrType==="_defensivt", classname: "defensiv" },
                    { name: "FDR", value: "", checked:  fdrType==="", classname: "fdr" },
                    { name: props.content.General.offence, value: "_offensivt", checked:  fdrType==="_offensivt", classname: "offensiv"}
                ]}
            />

            <Button 
                buttonText={props.content.Fixture.filter_button_text} 
                icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
                onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} 
                color='white'
            />
        </> }

        { teamData != null && teamData.length > 0 && teamData[0].team_name != "empty" && showTeamFilters &&
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
                </div> 
            }
        </div> }

        { !loading && fdrDataToShow.length > 0 && fdrDataToShow[0].avg_Score != -1 &&
            <ShowRotationData 
                content={props.content}
                fdrData={fdrDataToShow}
                fdrToColor={fdrToColor}
                kickOffTimes={kickOffTimesToShow} />
        }
     </DefaultPageContainer></>
};

export default RotationPlannerEliteserienPage;
