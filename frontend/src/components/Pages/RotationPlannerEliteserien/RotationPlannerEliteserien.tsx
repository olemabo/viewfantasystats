import { RotationPlannerTeamModel } from '../../../models/fixturePlanning/RotationPlannerTeam';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { TeamCheckedModel } from '../../../models/fixturePlanning/TeamChecked';

import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { ShowRotationData } from '../../Fixtures/ShowRotationData/ShowRotationData';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { convertFDRtoHex } from '../../../utils/convertFDRtoHex';
import { CheckBox } from '../../Shared/CheckBox/CheckBox';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Popover } from '../../Shared/Popover/Popover';
import { Button } from '../../Shared/Button/Button';
import { store } from '../../../store/index';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type LanguageProps = {
    content: any;
}

export const RotationPlannerEliteserienPage : FunctionComponent<LanguageProps> = (props) => {
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

    const emptyTeamData: TeamCheckedModel[] = [ { team_name: "empty", checked: true, checked_must_be_in_solution: false }];
    const [ teamData, setTeamData ] = useState(emptyTeamData);
    const [ fdrToColor, setFdrToColor ] = useState({0.5: "0.5", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5"});
    const [ maxGw, setMaxGw ] = useState(-1);
    const [ teamsToCheck, setTeamsToCheck ] = useState(2);
    const [ teamsToPlay, setTeamsToPlay ] = useState(1);
    const [ validationErrorMessage, setValidationErrorMessage ] = useState("");
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        // get all fpl teams   
        if (store.getState()?.league_type != "Eliteserien") {
            store.dispatch({type: "league_type", payload: "Eliteserien"});
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

            if (maxGw < 0) { 
                setMaxGw(data.gws_and_dates.length); 
                setGwEnd(data.gws_and_dates.length); 
            }

            setFdrToColor(data.fdr_to_colors_dict);

            if (data?.gws_and_dates?.length > 0) {
                let temp_KickOffTimes: KickOffTimesModel[] = [];
                data?.gws_and_dates.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimesToShow(temp_KickOffTimes.slice(gwStart - 1, body['end_gw']));
                setGwEnd(body['end_gw']); 
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
        })
    }

    function toggleCheckbox(e: any) {
        let temp: TeamCheckedModel[] = [];
        teamData.forEach(x => {
            let checked = x.checked;
            let checked_must_be_in_solution = x.checked_must_be_in_solution;
            if (x.team_name == e.currentTarget.value) {
                checked = !x.checked;
                if (!checked && checked_must_be_in_solution) { checked_must_be_in_solution = false; }
            }
            temp.push({ team_name: x.team_name, checked: checked, checked_must_be_in_solution: checked_must_be_in_solution});
        });
        setTeamData(temp);
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

    function validateInput(body: any) {
        if (body.start_gw > body.end_gw) { 
            setValidationErrorMessage("'" + props.content.Fixture.gw_start + "' må være mindre enn '" + props.content.Fixture.gw_end + "'");
            return false;
        }
        if (body.teams_to_play > body.teams_to_check) { 
            setValidationErrorMessage("'" + props.content.Fixture.teams_to_play + "' må være mindre enn '" + props.content.Fixture.teams_to_check + "'");
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
    <DefaultPageContainer 
        pageClassName='fixture-planner-container' 
        heading={props.content.Fixture.RotationPlanner?.title + " - " + store.getState().league_type} 
        description={'Rotation Planner for Eliteserien Fantasy (ESF). '}>
         <h1>{props.content.Fixture.RotationPlanner?.title}<Popover 
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
            Kampprogram, vanskelighetsgrader og farger er hentet fra 
            <a href="https://docs.google.com/spreadsheets/d/168WcZ2mnGbSh-aI-NheJl5OtpTgx3lZL-YFV4bAJRU8/edit?usp=sharing">Excel arket</a>
            til Dagfinn Thon.
            { fdrToColor != null && 
                <><p className='diff-introduction-container'>
                    FDR verdier: 
                    <span style={{backgroundColor: convertFDRtoHex("0.5", fdrToColor)}} className="diff-introduction-box wide">0.25</span>
                    <span style={{backgroundColor: convertFDRtoHex("1", fdrToColor)}} className="diff-introduction-box">1</span>
                    <span style={{backgroundColor: convertFDRtoHex("2", fdrToColor)}} className="diff-introduction-box">2</span>
                    <span style={{backgroundColor: convertFDRtoHex("3", fdrToColor)}} className="diff-introduction-box">3</span>
                    <span style={{backgroundColor: convertFDRtoHex("4", fdrToColor)}} className="diff-introduction-box">4</span>
                    <span style={{backgroundColor: convertFDRtoHex("5", fdrToColor)}} className="diff-introduction-box">5</span>
                    <span style={{backgroundColor: convertFDRtoHex("10", fdrToColor)}} className="diff-introduction-box black">10</span>
                </p>
                <p>Lilla bokser markerer en dobbeltrunde, mens svarte bokser markerer at laget ikke har kamp den runden.</p></>
            }
            </Popover>
        </h1>
         <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>
            {props.content.Fixture.gw_start}
            <input 
                className="form-number-box" 
                type="number" 
                min={min_gw}
                max={gwEnd}
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
                max={maxGw}
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

        { loading && <Spinner /> }

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
