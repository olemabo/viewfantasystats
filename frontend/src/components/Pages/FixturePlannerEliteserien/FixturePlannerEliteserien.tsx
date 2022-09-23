import { TeamFDRDataModel, FDR_GW_i, FDRData } from '../../../models/fixturePlanning/TeamFDRData';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { FixturePlanningType } from '../../../models/fixturePlanning/FixturePlanningType';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { FilterButton } from '../../Shared/FilterButton/FilterButton';
import { ShowFDRData } from '../../Fixtures/ShowFDRData/ShowFDRData';
import { convertFDRtoHex } from '../../../utils/convertFDRtoHex';
import "../../Pages/FixturePlanner/FixturePlanner.scss";
import { Spinner } from '../../Shared/Spinner/Spinner';
import { Button } from '../../Shared/Button/Button';
import Popover from '../../Shared/Popover/Popover';
import { store } from '../../../store/index';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type FixturePlannerPageProps = {
    content: any;
    league_type: string;
    fixture_planning_type: string;
}

export const FixturePlannerEliteserienPage : FunctionComponent<FixturePlannerPageProps> = (props) => {
    const fixture_planner_kickoff_time_api_path = "/fixture-planner-eliteserien/get-eliteserien-kickoff-times/";
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
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ minNumFixtures, setMinNumFixtures ] = useState(3);

    useEffect(() => {
        store.dispatch({type: "league_type", payload: props.league_type});

        // Get fdr data from the API
        let body = { 
            start_gw: gwStart,
            end_gw: max_gw,
            min_num_fixtures: minNumFixtures,
            combinations: props.fixture_planning_type,
        };
        
        extractFDRData(body);
    }, []);


    function updateFDRData() {
        var body = {
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: minNumFixtures,
            combinations: props.fixture_planning_type,
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

            if (maxGw < 0) { 
                setMaxGw(data.gws_and_dates.length); 
            }
            
            setFdrToColor(data.fdr_to_colors_dict);
            
            if (data?.gws_and_dates?.length > 0) {
                let temp_KickOffTimes: KickOffTimesModel[] = [];
                data?.gws_and_dates.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimesToShow(temp_KickOffTimes.slice(data.gw_start - 1, data.gw_end));
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
                            Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use})
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
            if (x.team_name == e.currentTarget.value) {
                checked = !x.checked;
            }
            temp.push({ team_name: x.team_name, FDR: x.FDR, checked: checked, font_color: x.font_color, background_color: x.background_color, fdr_total_score: x.fdr_total_score });
        });
        setFdrDataToShow(temp);
    }

    var title_fixture_planner = props.content.Fixture.FixturePlanner.title
    var title_rotation_planner = props.content.Fixture.RotationPlanner.title
    var title_period_planner = props.content.Fixture.PeriodPlanner.title

    var title = title_fixture_planner;
    var description = "";
    
    if (props.fixture_planning_type == FixturePlanningType.FDR) { 
        title = title_fixture_planner;
        description = title + " (Fixture Difficulty Rating) rangerer lag etter best kampprogram mellom to runder " +
        "('" + props.content.Fixture.gw_start.toString() + "'" + " og " + "'" + props.content.Fixture.gw_end.toString() + "')" + 
        ". Best kampprogram ligger øverst og dårligst nederst. ";
    }

    if (props.fixture_planning_type == FixturePlanningType.Periode) { 
        title = title_period_planner;
        description = title + " markerer perioden et lag har best kampprogram mellom to runder. Beste rekke med kamper er markert svart kantfarger. "
        + "Eksempelvis ønsker man å finne ut hvilken periode mellom runde 1 og 20 hvert lag har best kamper. "
        + "'" + props.content.Fixture.gw_start.toString() + "'" + " og " + "'" + props.content.Fixture.gw_end.toString() + "'" + " blir da henholdsvis 1 og 20. "
        + "'" + props.content.Fixture.min_fixtures.toString() + "'" + " er minste antall etterfølgende kamper et lag må ha. ";
    }

    return <>
    <DefaultPageContainer pageClassName='fixture-planner-container' heading={title + " - " + store.getState().league_type} description={title}>
        <h1>{title}<Popover 
            id={"rotations-planner-id"}
            title=""
            algin_left={true}
            popover_title={title} 
            iconSize={14}
            iconpostition={[-10, 0, 0, 3]}
            popover_text={ description }>
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
        { maxGw > 0 && 
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

                { props.fixture_planning_type == FixturePlanningType.Periode && 
                <><br />
                    {props.content.Fixture.min_fixtures}
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
        }
     
        <Button buttonText={props.content.Fixture.filter_button_text} 
            icon_class={"fa fa-chevron-" + (showTeamFilters ? "up" : "down")} 
            onclick={() => setShowTeamFilters(showTeamFilters ? false : true)} />

        { fdrDataToShow != null && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "empty" && showTeamFilters &&
            <div className='filter-teams-container'>
                <div className='filter-teams-list'>
                { fdrDataToShow.map(team_name => 
                    <FilterButton fontColor={team_name.font_color} backgroundColor={team_name.background_color}  onclick={(e: any) => toggleCheckbox(e)} buttonText={team_name.team_name} checked={team_name.checked} />
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
                fdrToColor={fdrToColor} />
        )}
    </DefaultPageContainer>
    </>
};

export default FixturePlannerEliteserienPage;