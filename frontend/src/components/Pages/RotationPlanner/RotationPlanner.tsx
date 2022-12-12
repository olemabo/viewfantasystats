import { RotationPlannerTeamInfoModel } from '../../../models/fixturePlanning/RotationPlannerTeamInfo';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { ShowRotationData } from '../../Fixtures/ShowRotationData/ShowRotationData';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { TeamCheckedModel } from '../../../models/fixturePlanning/TeamChecked';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { CheckBox } from '../../Shared/CheckBox/CheckBox';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Button } from '../../Shared/Button/Button';
import { store } from '../../../store/index';
import axios from 'axios';
import Popover from '../../Shared/Popover/Popover';
import FilterButton from '../../Shared/FilterButton/FilterButton';
import ThreeStateCheckbox from '../../Shared/FilterButton/ThreeStateCheckbox';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type LanguageProps = {
    content: any;
}

export const RotationPlannerPage : FunctionComponent<LanguageProps> = (props) => {
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

    function toggleCheckboxMustBeInSolution(e: any) {
        let temp: TeamCheckedModel[] = [];
        teamData.forEach(x => {
            let checked_must_be_in_solution = x.checked_must_be_in_solution;
            let checked = x.checked;
            if (x.team_name == e.currentTarget.value) {
                checked_must_be_in_solution = !x.checked_must_be_in_solution;
                if (checked_must_be_in_solution) { checked = true; }
            }
            temp.push({ team_name: x.team_name, checked: checked, checked_must_be_in_solution: checked_must_be_in_solution});
        });
        setTeamData(temp);
    }

    

    function toggleCheckbox(e: any) {
        let temp: TeamCheckedModel[] = [];
        teamData.forEach(x => {
            let checked = x.checked;
            if (x.team_name == e.currentTarget.value) {
                checked = !x.checked;
            }
            temp.push({ team_name: x.team_name, checked: checked, checked_must_be_in_solution: x.checked_must_be_in_solution });
        });
        setTeamData(temp);
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

    function convertTeamsToString(teamList: string[]) {
        if (!teamList || teamList.length == 0) {
            return null;
        }
        if (teamList.length == 1) {
            return teamList[0];
        }
        let response = '';
        for (var i = 0; i < teamList.length - 1; i++) { 
            response += teamList[i]; 
            if (i < teamList.length - 2) {
                response += ', ';
            }
        }
        return response + ' ' + props.content.General.and + ' ' + teamList[teamList.length - 1]
    }

    const { number_of_not_in_solution, number_of_must_be_in_solution, number_can_be_in_solution } = filterTeamData();

    function numberOfUniqueCombinations() {
        return combinations(number_can_be_in_solution, teamsToCheck - number_of_must_be_in_solution)
    }

    function product_Range(a: number, b: number) {
        var prd = a,i = a;
       
        while (i++< b) {
          prd*=i;
        }
        return prd;
      }
      
      
    function combinations(n: number, r: number) 
    {
        if (n==r || r==0) 
        {
            return 1;
        } 
        else 
        {
            r=(r < n-r) ? n-r : r;
            return product_Range(r+1, n)/product_Range(1, n-r);
        }
    }

    return <>
    <DefaultPageContainer pageClassName='fixture-planner-container' heading={props.content.Fixture.RotationPlanner?.title + " - " + store.getState().league_type} description={props.content.Fixture.RotationPlanner?.title}>
         <h1>{props.content.Fixture.RotationPlanner?.title}
         <Popover 
            id={"rotations-planner-id"}
            title=""
            algin_left={true}
            popover_title={props.content.Fixture.RotationPlanner?.title} 
            iconSize={14}
            iconpostition={[-10, 0, 0, 3]}
            popover_text={ props.content.Fixture.RotationPlanner?.title + " viser kombinasjoner av lag som kan roteres for å gi best mulig kampprogram. "
            + "Eksempelvis ønsker man å finne to keepere som roterer bra mellom runde 10 og 20. "
            + "'" + props.content.Fixture.gw_start.toString() + "'" + " og " + "'" + props.content.Fixture.gw_end.toString() + "'" + " blir da henholdsvis 10 og 20. "
            + "'" + props.content.Fixture.teams_to_check.toString() + "'" + " blir 2 fordi man skal ha 2 keepere som skal rotere. "
            + "'" + props.content.Fixture.teams_to_play.toString() + "'" + " blir 1 fordi kun en av de to keeperene skal spille per runde. "
            }>
            Kampprogram og vanskelighetsgrader er hentet fra
            <a href="https://fantasy.premierleague.com/">Fantasy Premier League.</a>
            <><p className='diff-introduction-container'>
                FDR verdier: 
                <span className="diff-introduction-box diff-1">1</span>
                <span className="diff-introduction-box diff-2">2</span>
                <span className="diff-introduction-box diff-3">3</span>
                <span className="diff-introduction-box diff-4">4</span>
                <span className="diff-introduction-box diff-5">5</span>
                <span className="diff-introduction-box black">10</span>
            </p>
            </>
            </Popover>
         </h1>
         { !firstloading && <>
            <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
                <label htmlFor='input-form-start-gw'>{props.content.Fixture.gw_start}</label>
                <input 
                    className="form-number-box" 
                    type="number" 
                    min={min_gw}
                    max={max_gw}
                    onInput={(e) => setGwStart(parseInt(e.currentTarget.value))} 
                    value={gwStart} 
                    id="input-form-start-gw" 
                    name="input-form-start-gw">
                </input>
                <label htmlFor='input-form-end-gw'>{props.content.Fixture.gw_end}</label>
                <input 
                    className="form-number-box" 
                    type="number" 
                    min={gwStart}
                    max={max_gw}
                    onInput={(e) => setGwEnd(parseInt(e.currentTarget.value))} 
                    value={gwEnd} 
                    id="input-form-end-gw" 
                    name="input-form-end-gw">
                </input>

                <br />
                <label htmlFor='teams_to_check'>{props.content.Fixture.teams_to_check}</label>
                <input 
                    className="box" 
                    type="number" 
                    min={1} 
                    max={5} 
                    onInput={(e) => setTeamsToCheck(parseInt(e.currentTarget.value))} 
                    value={teamsToCheck} 
                    id="teams_to_check" 
                    name="teams_to_check" />
                
                <label htmlFor='teams_to_play'>{props.content.Fixture.teams_to_play}</label>
                <input 
                    className="box" 
                    type="number" 
                    min={1} 
                    max={5} 
                    onInput={(e) => setTeamsToPlay(parseInt(e.currentTarget.value))} 
                    value={teamsToPlay}
                    id="teams_to_play" 
                    name="teams_to_play" />

                <input className="submit" type="submit" value={props.content.General.search_button_name}>
                </input>
            </form>
            
            <div style={{ display: "flex", justifyContent: 'center' }}>
                <span style={{ color: "red", maxWidth: '375px' }}>{validationErrorMessage}</span>
            </div>
            
            <Button buttonText={props.content.Fixture.filter_button_text} 
                icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
                onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} />

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
                        {/* { must_be_in_solution_as_string &&
                            <div className='filter-info'>
                                <b>{props.content.Fixture.RotationPlanner.teams_in_solution}</b>
                                {must_be_in_solution_as_string}
                            </div>
                        }
                        { not_in_solution_as_string &&
                            <div className='filter-info'>
                                <b>{props.content.Fixture.RotationPlanner.not_in_solution}</b>
                                {not_in_solution_as_string}
                            </div>
                        } */}
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

            <br ></br>

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
