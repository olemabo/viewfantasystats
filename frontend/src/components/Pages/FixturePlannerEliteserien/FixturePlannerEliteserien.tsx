import { TeamFDRDataModel, FDR_GW_i, FDRData } from '../../../models/fixturePlanning/TeamFDRData';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { FixturePlanningType } from '../../../models/fixturePlanning/FixturePlanningType';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { FilterButton } from '../../Shared/FilterButton/FilterButton';
import { ShowFDRData } from '../../Fixtures/ShowFDRData/ShowFDRData';
import * as external_urls from '../../../static_urls/externalUrls';
import ToggleButton from '../../Shared/ToggleButton/ToggleButton';
import { PageProps, esf, fpl } from '../../../models/shared/PageProps';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import "../../Pages/FixturePlanner/FixturePlanner.scss";
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Button } from '../../Shared/Button/Button';
import Popover from '../../Shared/Popover/Popover';
import axios from 'axios';
import { setLeagueType } from '../../../hooks/useLeagueTypeDispatch';
 

export const FixturePlannerEliteserienPage : FunctionComponent<PageProps & { fixture_planning_type: string }> = (props) => {
    const fixture_planner_api_path = "/fixture-planner-eliteserien/get-all-eliteserien-fdr-data/";
    
    const min_gw = 1;
    const max_gw = 30;
    
    const empty: TeamFDRDataModel[] = [ { team_name: "-", FDR: [], checked: true, font_color: "FFF", background_color: "FFF", fdr_total_score: 0 }];
    const emptyGwDate: KickOffTimesModel[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];

    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);
    const [ fdrToColor, setFdrToColor ] = useState({0.5: "0.5", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5"});


    const [ gwStart, setGwStart ] = useState(-1);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ maxGw, setMaxGw ] = useState(-1);
    const [ excludeGws, setExcludeGws ] = useState([-1]);
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ minNumFixtures, setMinNumFixtures ] = useState(3);
    const [ fdrType, SetFdrType ] = useState("");

    useEffect(() => {
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
            end_gw: max_gw,
            min_num_fixtures: minNumFixtures,
            combinations: props.fixture_planning_type,
            fdr_type: fdrType,
            excludeGws: temp,
        };
        
        extractFDRData(body);
    }, []);


    function updateFDRData(currentFdrType: string) {
        var body = {
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: minNumFixtures,
            combinations: props.fixture_planning_type,
            fdr_type: currentFdrType,
            excludeGws: excludeGws,
        };

        extractFDRData(body);
    }

    function extractFDRData(body: any) {
        setLoading(true);
        
        // Get fdr data from api
        axios.post(fixture_planner_api_path, body).then((x: any) => {
            let apiFDRList: TeamFDRDataModel[] = [];
            let data = JSON.parse(x.data);

            if (data.gw_start != gwStart) { 
                setGwStart(data.gw_start);
            }

            if (data.gw_end != gwEnd) { 
                setGwEnd(data.gw_end);
            }

            if (maxGw < 0) { setMaxGw(data.max_gw); }
            
            setFdrToColor(data.fdr_to_colors_dict);
            
            if (data?.gws_and_dates?.length > 0) {
                let temp_KickOffTimes: KickOffTimesModel[] = [];
                data?.gws_and_dates.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimesToShow(temp_KickOffTimes);
            }
            
            data.fdr_data.forEach((team: any[]) => {
                let team_name = JSON.parse(team[0][0][0]).team_name;
                let fdr_total_score = 0;
                let FDR_gw_i: FDR_GW_i[] = [];
                
                team.forEach((fdr_for_each_gw: any[]) => {
                    let temp: FDRData[] = [];
                    fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                        let fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                        fdr_total_score = fdr_in_gw_i_json.FDR_score;
                        temp.push({
                            opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                            difficulty_score: fdr_in_gw_i_json.difficulty_score,
                            H_A: fdr_in_gw_i_json.H_A,
                            Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use,
                            message: fdr_in_gw_i_json.message,
                        })
                    });
                    FDR_gw_i.push({fdr_gw_i: temp})
                });
                let font_color = "black";
                let background_color = "white";
                if (data?.team_name_color?.length > 0) {
                    data?.team_name_color.forEach((team: string[]) => {
                        if (team_name == team[0]) {
                            font_color = team[2];
                            background_color = team[1];
                        }
                    }    
                    );
                }
                let tempTeamData = { team_name: team_name, FDR: FDR_gw_i, checked: true, font_color: font_color, background_color: background_color, fdr_total_score: fdr_total_score }
                apiFDRList.push(tempTeamData);
            });

            setFdrDataToShow(apiFDRList);
            setLoading(false);
        })
    }

    function toggleCheckbox(e: any) {
        let temp: TeamFDRDataModel[] = [];
        fdrDataToShow.forEach(x => {
            let checked = x.checked;
            if (x.team_name.toLowerCase() == e.currentTarget.value.toLowerCase()) {
                checked = !x.checked;
            }
            temp.push({ team_name: x.team_name, FDR: x.FDR, checked: checked, font_color: x.font_color, background_color: x.background_color, fdr_total_score: x.fdr_total_score });
        });
        setFdrDataToShow(temp);
    }

    function changeXlsxSheet(fdr_type: string) {
        SetFdrType(fdr_type);
        updateFDRData(fdr_type)
    }

    var title_fixture_planner = props.content.Fixture.FixturePlanner?.title
    var title_period_planner = props.content.Fixture.PeriodPlanner?.title

    var title = title_fixture_planner;
    var description = "";
    
    if (props.fixture_planning_type == FixturePlanningType.FDR) { 
        title = title_fixture_planner;

        description = `${title} (Fixture Difficulty Rating) ${props.content.LongTexts.rankTeams} ('${props.content.Fixture.gw_start}' ${props.content.General.and} ' ${props.content.Fixture.gw_end}'). 
        
        ${props.content.LongTexts.bestFixture}`;
    }

    if (props.fixture_planning_type == FixturePlanningType.Periode) { 
        title = title_period_planner;
        description = `${title} ${props.content.LongTexts.markPeriode_1}
        
        ${props.content.LongTexts.markPeriode_2} '${props.content.Fixture.gw_start}' ${props.content.General.and} '${props.content.Fixture.gw_end}' ${props.content.LongTexts.becomesRes} '${props.content.Fixture.min_fixtures}' ${props.content.LongTexts.leastNumber}`;
    }
    
    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container'
        leagueType={props.league_type}
        heading={title} 
        description={'Fixture Difficulty Rating Planner for Eliteserien Fantasy (ESF). '}>
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
                <a href={external_urls.url_spreadsheets_dagfinn_thon}>{ props.content.LongTexts.ExcelSheet }</a> { props.content.LongTexts.to } Dagfinn Thon.
                { fdrToColor != null && 
                    <FdrBox leagueType={esf} content={props.content} />
                }
            </Popover>
        </h1>
        { maxGw > 0 && 
            <div className='input-row-container'>
                {/* <ToggleButton 
                    onclick={(checked: string) => changeXlsxSheet(checked)} 
                    toggleButtonName="FDR-toggle"
                    defaultToggleList={[ 
                        { name: props.content.General.defence, value: "_defensivt", checked: fdrType === "_defensivt", classname: "defensiv" },
                        { name: "FDR", value: "", checked: fdrType === "", classname: "fdr" },
                        { name: props.content.General.offence, value: "_offensivt", checked: fdrType === "_offensivt", classname: "offensiv"}
                    ]}
                /> */}
                <Button buttonText={props.content.Fixture.filter_button_text} 
                    icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
                    onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} 
                    color='white'
                />
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

                    { props.fixture_planning_type == FixturePlanningType.Periode && 
                        <TextInput 
                            onInput={(e: number) => setMinNumFixtures(e)} 
                            defaultValue={minNumFixtures}
                            min={minNumFixtures}
                            htmlFor='min-num-fixtures'
                            max={gwEnd}>
                            {props.content.Fixture.min_fixtures.split(/(\s+)/)[0]}<br/>
                            {props.content.Fixture.min_fixtures.split(/(\s+)/)[2]}
                        </TextInput>
                    }

                    <input className="submit" type="submit" value={props.content.General.search_button_name} />
                </form> 
            </div>
        }
        
        { fdrDataToShow != null && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "empty" && showTeamFilters &&
            <div className='filter-teams-container'>
                <div className='filter-teams-list'>
                { fdrDataToShow.map(team_name => 
                    <FilterButton
                        onclick={(e: any) => toggleCheckbox(e)} 
                        buttonText={team_name.team_name.at(0) + team_name.team_name.substring(1).toLocaleLowerCase()} 
                        checked={team_name.checked} />
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
                warningMessage={props.content.Fixture.noTeamsChosen}
            />
        )}
    </DefaultPageContainer>
    </>
};

export default FixturePlannerEliteserienPage;