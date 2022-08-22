import { RotationPlannerTeamInfoModel } from '../../../models/fixturePlanning/RotationPlannerTeamInfo';
import { DefaultPageContainer } from '../../Layout/defaultPageContainer/DefaultPageContainer';
import { ShowRotationData } from '../../Fixtures/ShowRotationData/ShowRotationData';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { TeamCheckedModel } from '../../../models/fixturePlanning/TeamChecked';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { CheckBox } from '../../Shared/CheckBox/CheckBox';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Button } from '../../Shared/Button/Button';
import "../rotationPlanner/rotationPlanner.scss";
import { store } from '../../../store/index';
import axios from 'axios';

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

    const [ gwStart, setGwStart ] = useState(min_gw);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty);

    const [ kickOffTimes, setKickOffTimes ] = useState(emptyGwDate);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);

    const [ teamsToCheck, setTeamsToCheck ] = useState(2);
    const [ teamsToPlay, setTeamsToPlay ] = useState(1);

    const [ validationErrorMessage, setValidationErrorMessage ] = useState("");
    const [ loading, setLoading ] = useState(false);

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

        var tempStart = 1;
        var tempEnd = 3;

        // Get kickoff time data from the API
        axios.get(fixture_planner_kickoff_time_api_path).then(x => {
            if (x.data?.length > 0) {
                let temp_KickOffTimes: KickOffTimesModel[] = [];
                x.data.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimes(temp_KickOffTimes);
                setKickOffTimesToShow(temp_KickOffTimes.slice(tempStart - 1, tempEnd));
            }
        })

        setGwStart(tempStart);
        setGwEnd(tempEnd);

        // Get fdr data from the API
        let body = { 
            start_gw: tempStart,
            end_gw: tempEnd,
            min_num_fixtures: '1',
            combinations: 'Rotation',
            teams_to_check: teamsToCheck,
            teams_to_play: teamsToPlay,
            teams_in_solution: [],
            fpl_teams: [-1],
        };

        extractFDRData(body)
    }, []);

    function extractFDRData(body: any) {
        setLoading(true);
        // Get fdr data from api
        axios.post(fixture_planner_api_path, body).then(x => {
            let RotationPlannerTeamInfoList: RotationPlannerTeamInfoModel[] = [];
            let data = JSON.parse(x.data);

            data?.fdr_data.forEach((team: any) => {
                let team_i_json = JSON.parse(team);
                let temp: RotationPlannerTeamInfoModel = { avg_Score: team_i_json.avg_Score, 
                    id_list: team_i_json.id_list, team_name_list: team_i_json.team_name_list, 
                    extra_fixtures: team_i_json.extra_fixtures, home_games: team_i_json.home_games,
                    fixture_list: team_i_json.fixture_list}
                RotationPlannerTeamInfoList.push(temp);
            })

            if (kickOffTimes.length > 1) {
                setKickOffTimesToShow(kickOffTimes.slice(body['start_gw'] - 1, body['end_gw']));
            }
            setFdrDataToShow(RotationPlannerTeamInfoList);
            setLoading(false);
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
            setValidationErrorMessage("GW start must be smaller than GW end");
            return false;
        }
        if (body.teams_to_play > body.teams_to_check) { 
            setValidationErrorMessage("'Teams to play' must be smaller than 'Teams to check'");
            return false;
        }

        if (body.teams_in_solution.length > body.teams_to_check) {
            setValidationErrorMessage("'teams_in_solution' must be smaller og equal to 'Teams to check'");
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
            extractFDRData(body);
        }

    }

    return <>
    <DefaultPageContainer pageClassName='fixture-planner-container' heading={props.content.Fixture.RotationPlanner.title + " - " + store.getState().league_type} description={props.content.Fixture.RotationPlanner.title}>
         <h1>{props.content.Fixture.RotationPlanner.title}</h1>
         <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
            {props.content.Fixture.gw_start}
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
            {props.content.Fixture.gw_end}
            <input 
                className="form-number-box" 
                type="number" 
                min={gwStart}
                max={max_gw}
                onInput={(e) => setGwEnd(parseInt(e.currentTarget.value))} 
                value={gwEnd} 
                id="input-form-start-gw" 
                name="input-form-start-gw">
            </input>

            <br />
            {props.content.Fixture.teams_to_check}
            <input 
                className="box" 
                type="number" 
                min={1} 
                max={5} 
                onInput={(e) => setTeamsToCheck(parseInt(e.currentTarget.value))} 
                value={teamsToCheck} 
                id="teams_to_check" 
                name="teams_to_check" />
            
            {props.content.Fixture.teams_to_play}
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

        <div style={{ color: "red" }}>{validationErrorMessage}</div>
        
        <Button buttonText={props.content.Fixture.filter_button_text} 
            icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
            onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} />

        { teamData != null && teamData.length > 0 && teamData[0].team_name != "empty" && showTeamFilters &&
            <div className='filter-teams-container'>
                <div className='filter-teams-list'>
                { teamData.map(team_name =>
                    <CheckBox 
                    buttonText={team_name.team_name} 
                    checked1={team_name.checked} 
                    checked2={team_name.checked_must_be_in_solution} 
                    onclickBox1={(e: any) => toggleCheckbox(e)} 
                    onclickBox2={(e: any) => toggleCheckboxMustBeInSolution(e)} 
                    useTwoCheckBoxes={true} />
                )}
                </div>
            </div>
        }

        { loading && 
            <div style={{ backgroundColor: "#E8E8E8"}}><Spinner /></div>
        }

        <br ></br>

        { !loading && fdrDataToShow.length > 0 && fdrDataToShow[0].avg_Score != -1 &&
            <ShowRotationData 
                content={props.content}
                fdrData={fdrDataToShow}
                kickOffTimes={kickOffTimesToShow}    
            />
        }
    </DefaultPageContainer></>

};

export default RotationPlannerPage;
