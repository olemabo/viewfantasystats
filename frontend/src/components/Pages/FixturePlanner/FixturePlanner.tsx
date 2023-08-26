import { SimpleTeamFDRDataModel, FDR_GW_i, FDRData } from '../../../models/fixturePlanning/TeamFDRData';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { FixturePlanningType } from '../../../models/fixturePlanning/FixturePlanningType';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { ShowFDRData } from '../../Fixtures/ShowFDRData/ShowFDRData';
import FilterTeamBox from '../../Shared/FilterTeamBox/FilterTeamBox';
import * as external_urls from '../../../static_urls/externalUrls';
import { PageProps } from '../../../models/shared/PageProps';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import { Button } from '../../Shared/Button/Button';
import Popover from '../../Shared/Popover/Popover';
import Spinner from '../../Shared/Spinner/Spinner';
import { store } from '../../../store/index';
import axios from 'axios';


export const FixturePlannerPage : FunctionComponent<PageProps & { fixture_planning_type: string; }> = (props) => {
    const fixture_planner_kickoff_time_api_path = "/fixture-planner/get-kickoff-times/";
    const fixture_planner_api_path = "/fixture-planner/get-all-fdr-data/";
    
    const min_number_of_fixture = 1
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
    const [ initialLoading, setnitialLoading ] = useState(true);

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
                const team_name = JSON.parse(team[0][0][0]).team_name;

                const FDR_gw_i: FDR_GW_i[] = [];
                var fdr_total_score = 0;
                team.forEach((fdr_for_each_gw: any[]) => {
                    const temp: FDRData[] = [];
                    fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                        const fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                        fdr_total_score = fdr_in_gw_i_json.FDR_score;
                        temp.push({
                            opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                            difficulty_score: fdr_in_gw_i_json.difficulty_score,
                            H_A: fdr_in_gw_i_json.H_A,
                            double_blank: fdr_in_gw_i_json.double_blank,
                            Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use})
                    });
                    FDR_gw_i.push({fdr_gw_i: temp})
                });
                const tempTeamData = { team_name: team_name, FDR: FDR_gw_i, checked: true, fdr_total_score: fdr_total_score}
                apiFDRList.push(tempTeamData);
            });
            
            if (kickofftimes != null && kickofftimes.length > 0) {
                setKickOffTimesToShow(kickofftimes.slice(data.gw_start - 1, data.gw_end));
            }

            setFdrDataToShow(apiFDRList);
            setLoading(false);
            setnitialLoading(false);
        })
    }

    function toggleCheckbox(e: any) {
        const fdrData: SimpleTeamFDRDataModel[] = [];
        fdrDataToShow.forEach(x => {
            let checked = x.checked;
            if (x.team_name === e.currentTarget.value) {
                checked = !x.checked;
            }
            fdrData.push({ team_name: x.team_name, FDR: x.FDR, checked: checked, fdr_total_score: x.fdr_total_score });
        });
        setFdrDataToShow(fdrData);
    }

    function uncheckAll(uncheck: boolean) {
        const fdrData: SimpleTeamFDRDataModel[] = [];
        
        fdrDataToShow.forEach(x => {
            let checked = uncheck;
            fdrData.push({ team_name: x.team_name, FDR: x.FDR, checked: checked, fdr_total_score: x.fdr_total_score });
        });

        setFdrDataToShow(fdrData);
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

        description = `${title} (Fixture Difficulty Rating) ${props.content.LongTexts.rankTeams} ('${props.content.Fixture.gw_start}' ${props.content.General.and} ' ${props.content.Fixture.gw_end}').
        
        ${props.content.LongTexts.bestFixture}`;
    }

    if (props.fixture_planning_type == FixturePlanningType.Periode) { 
        title = title_period_planner;
        description = `${title} ${props.content.LongTexts.markPeriode_1} 
        
        ${props.content.LongTexts.markPeriode_2}'${props.content.Fixture.gw_start}' ${props.content.General.and} '${props.content.Fixture.gw_end}' ${props.content.LongTexts.becomesRes}
        
        '${props.content.Fixture.min_fixtures} ' ${props.content.LongTexts.leastNumber}`;
    }

    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container' 
        heading={title + " - " + (store.getState().league_type === "fpl" ? "Premier League" : "Eliteserien")} 
        description={ description }>
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
                { props.content.LongTexts.fixtureAreFrom }
                <a href={external_urls.url_offical_fantasy_premier_league}>Fantasy Premier League.</a>
                <FdrBox content={props.content} />
            </Popover>
        </h1>
        
        { !initialLoading && <>
            <div className='input-row-container'>
                <Button buttonText={props.content.Fixture.filter_button_text} 
                        icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")}
                        color='white' 
                        onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} />
                
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

                    { props.fixture_planning_type == FixturePlanningType.Periode && 
                        <TextInput 
                            onInput={(e: number) => setMinNumFixtures(e)} 
                            defaultValue={minNumFixtures}
                            min={min_number_of_fixture}
                            htmlFor='min-num-fixtures'
                            max={gwEnd}>
                            {props.content.Fixture.min_fixtures.split(/(\s+)/)[0]}<br/>
                            {props.content.Fixture.min_fixtures.split(/(\s+)/)[2]}
                        </TextInput>
                    }

                    <input className="submit" type="submit" value={props.content.General.search_button_name} />
                </form>
            </div>

            { fdrDataToShow != null && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "empty" && showTeamFilters &&
                <FilterTeamBox
                    uncheckAll={(e: boolean) => uncheckAll(e)}
                    displayUncheckAll={true}
                    fdrData={fdrDataToShow}
                    toggleCheckBox={(e: any) => toggleCheckbox(e)}
                    removeAllText={props.content.Fixture.removeAllText} 
                    addAllText={props.content.Fixture.addAllText} 
                />
            }

            { loading && <Spinner /> }

            { !loading && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "-" && kickOffTimesToShow.length > 0 && kickOffTimesToShow[0].gameweek != 0 && (
                <ShowFDRData 
                    content={props.content}
                    fdrData={fdrDataToShow}
                    kickOffTimes={kickOffTimesToShow}
                    allowToggleBorder={true}
                    warningMessage={props.content.Fixture.noTeamsChosen}
                />
            )}</>
        }
        { initialLoading && <Spinner /> }
    </DefaultPageContainer>
    </>
};

export default FixturePlannerPage;