import { SimpleTeamFDRDataModel, FDR_GW_i, FDRData } from '../../../models/fixturePlanning/TeamFDRData';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { FixturePlanningType } from '../../../models/fixturePlanning/FixturePlanningType';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { FilterButton } from '../../Shared/FilterButton/FilterButton';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { ShowFDRData } from '../../Fixtures/ShowFDRData/ShowFDRData';
import { Button } from '../../Shared/Button/Button';
import Spinner from '../../Shared/Spinner/Spinner';
import { store } from '../../../store/index';
import axios from 'axios';
import Popover from '../../Shared/Popover/Popover';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type FixturePlannerPageProps = {
    content: any;
    league_type: string;
    fixture_planning_type: string;
}

export const FixturePlannerPage : FunctionComponent<FixturePlannerPageProps> = (props) => {
    const fixture_planner_kickoff_time_api_path = "/fixture-planner/get-kickoff-times/";
    const fixture_planner_api_path = "/fixture-planner/get-all-fdr-data/";
    
    const min_gw = 1;
    const max_gw = 38;

    const empty: SimpleTeamFDRDataModel[] = [ { team_name: "-", FDR: [], checked: true, fdr_total_score: 0 }];
    const emptyGwDate: KickOffTimesModel[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];

    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty); 
    const [ kickOffTimes, setKickOffTimes ] = useState(emptyGwDate);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);

    const [ gwStart, setGwStart ] = useState(-1);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ minNumFixtures, setMinNumFixtures ] = useState(3);
    const [ firstloading, setFirstLoading ] = useState(true);

    useEffect(() => {
        store.dispatch({type: "league_type", payload: props.league_type});
        
        // Body input for the fdr data API
        let body = { 
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: minNumFixtures,
            combinations: props.fixture_planning_type,
        };
        
        // Get kickoff time data from the API
        let temp_KickOffTimes: KickOffTimesModel[] = [];        
        axios.get(fixture_planner_kickoff_time_api_path).then(x => {
            if (x.data?.length > 0) {
                x.data.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimes(temp_KickOffTimes);
                setKickOffTimesToShow(temp_KickOffTimes.slice(body['start_gw'] - 1, body['end_gw']));
                extractFDRData(body, temp_KickOffTimes);
            }
        })

    }, []);


    function updateFDRData() {
        var body = {
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: minNumFixtures,
            combinations: props.fixture_planning_type
        };

        extractFDRData(body);
    }

    function extractFDRData(body: any, kickofftimes?: any) {
        if (kickofftimes == null) {
            setKickOffTimesToShow(kickOffTimes.slice(body['start_gw'] - 1, body['end_gw']));
        }

        // Get fdr data from api
        setLoading(true);
        axios.post(fixture_planner_api_path, body).then( (x: any) => {
            let apiFDRList: SimpleTeamFDRDataModel[] = [];
            let data = JSON.parse(x.data);

            if (data.gw_start != gwStart) { 
                setGwStart(data.gw_start);
            }

            if (data.gw_end != gwEnd) { 
                setGwEnd(data.gw_end);
            }
            
            data?.fdr_data.forEach((team: any[]) => {
                let team_name = JSON.parse(team[0][0][0]).team_name;

                let FDR_gw_i: FDR_GW_i[] = [];
                let fdr_total_score = 0;
                team.forEach((fdr_for_each_gw: any[]) => {
                    let temp: FDRData[] = [];
                    fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                        let fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                        fdr_total_score = fdr_in_gw_i_json.FDR_score;
                        temp.push({
                            opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                            difficulty_score: fdr_in_gw_i_json.difficulty_score,
                            H_A: fdr_in_gw_i_json.H_A,
                            Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use})
                    });
                    FDR_gw_i.push({fdr_gw_i: temp})
                });
                let tempTeamData = { team_name: team_name, FDR: FDR_gw_i, checked: true, fdr_total_score: fdr_total_score}
                apiFDRList.push(tempTeamData);
            });
            
            if (kickofftimes != null && kickofftimes.length > 0) {
                setKickOffTimesToShow(kickofftimes.slice(data.gw_start - 1, data.gw_end));
            }

            setFdrDataToShow(apiFDRList);
            setLoading(false);
            setFirstLoading(false);
        })
    }

    function toggleCheckbox(e: any) {
        let temp: SimpleTeamFDRDataModel[] = [];
        fdrDataToShow.forEach(x => {
            let checked = x.checked;
            if (x.team_name == e.currentTarget.value) {
                checked = !x.checked;
            }
            temp.push({ team_name: x.team_name, FDR: x.FDR, checked: checked, fdr_total_score: x.fdr_total_score });
        });
        setFdrDataToShow(temp);
    }

    function filterTeamData() {
        let not_in_solution: string[] = [];
        let must_be_in_solution: string[] = [];
        fdrDataToShow.map(team_data => {
            if (!team_data.checked) {
                not_in_solution.push(team_data.team_name)
            }
        })
        const number_of_not_in_solution = not_in_solution.length;
        const number_of_must_be_in_solution = must_be_in_solution.length;
        const number_can_be_in_solution = fdrDataToShow.length - number_of_not_in_solution - number_of_must_be_in_solution;
        return { number_of_not_in_solution: number_of_not_in_solution, number_of_must_be_in_solution:number_of_must_be_in_solution , number_can_be_in_solution: number_can_be_in_solution }
    }

    const title_fixture_planner = props.content.Fixture.FixturePlanner?.title
    const title_rotation_planner = props.content.Fixture.RotationPlanner?.title
    const title_period_planner = props.content.Fixture.PeriodPlanner?.title

    let title = title_fixture_planner;

    if (props.fixture_planning_type == FixturePlanningType.Rotation) { title = title_rotation_planner}
    if (props.fixture_planning_type == FixturePlanningType.Periode) { title = title_period_planner}

    let description = "";
    
    if (props.fixture_planning_type == FixturePlanningType.FDR) { 
        title = title_fixture_planner;
        description = title + " (Fixture Difficulty Rating) rangerer lag etter best kampprogram mellom to runder " +
        "('" + props.content.Fixture.gw_start.toString() + "'" + " og " + "'" + props.content.Fixture.gw_end.toString() + "')" + 
        ". Lag med best kampprogram havner ??verst og d??rligst nederst. ";
    }

    if (props.fixture_planning_type == FixturePlanningType.Periode) { 
        title = title_period_planner;
        description = title + " markerer perioden et lag har best kampprogram mellom to runder. Beste rekke med kamper er markert med svart kantfarger. "
        + "Eksempelvis ??nsker man ?? finne ut hvilken periode mellom runde 1 og 20 hvert lag har best kamper. "
        + "'" + props.content.Fixture.gw_start.toString() + "'" + " og " + "'" + props.content.Fixture.gw_end.toString() + "'" + " blir da henholdsvis 1 og 20. "
        + "'" + props.content.Fixture.min_fixtures.toString() + "'" + " er minste antall etterf??lgende kamper et lag m?? ha. ";
    }

    const { number_of_not_in_solution, number_of_must_be_in_solution, number_can_be_in_solution } = filterTeamData();

    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container' 
        heading={title + " - " + store.getState().league_type} 
        description={title}>
        <h1>
            {title}
            <Popover 
                id={"rotations-planner-id"}
                title=""
                algin_left={true}
                popover_title={title} 
                iconSize={14}
                iconpostition={[-10, 0, 0, 3]}
                popover_text={ description }>
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

                { props.fixture_planning_type == FixturePlanningType.Periode && 
                    <><br />
                    <label htmlFor='min_num_fixtures'>{props.content.Fixture.min_fixtures}</label>
                    <input 
                        className="box" 
                        type="number" 
                        min={1} 
                        max={gwEnd}
                        value={minNumFixtures} 
                        onInput={(e) => setMinNumFixtures(parseInt(e.currentTarget.value))} 
                        id="min_num_fixtures" 
                        name="min_num_fixtures" /></>
                }

                <input className="submit" type="submit" value={props.content.General.search_button_name} />
            </form>
            {/* } */}

            <Button buttonText={props.content.Fixture.filter_button_text} 
                        icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
                        onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} />

            { fdrDataToShow != null && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "empty" && showTeamFilters &&
                <div className='filter-teams-container'>
                    {/* <div className='filter-teams-description'>
                        <div><span className="dot can-be-in-solution"></span>{`Vis lag (${number_can_be_in_solution})`}</div>
                        <div><span className="dot not-in-solution"></span>{`Fjern lag (${number_of_not_in_solution})`}</div>
                    </div> */}
                    <div className='filter-teams-list'>
                    { fdrDataToShow.map(team_name =>
                        <FilterButton onclick={(e: any) => toggleCheckbox(e)} buttonText={team_name.team_name} checked={team_name.checked} />
                    )}
                    </div>
                </div>
            }

            { loading && <Spinner /> }

            { !loading && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "-" && kickOffTimesToShow.length > 0 && kickOffTimesToShow[0].gameweek != 0 && (
                <ShowFDRData 
                    content={props.content}
                    fdrData={fdrDataToShow}
                    kickOffTimes={kickOffTimesToShow}
                    allowToggleBorder={true}
                />
            )}</>
        }
        { firstloading && <Spinner /> }
    </DefaultPageContainer>
    </>
};

export default FixturePlannerPage;