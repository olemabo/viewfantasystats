import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { TeamFDRDataModel, FDR_GW_i, FDRData } from '../../../models/fixturePlanning/TeamFDRData';
import { FilterButton } from '../../Shared/FilterButton/FilterButton';
import { contrastingColor } from '../../../utils/findContrastColor';
import { Spinner } from '../../Shared/Spinner/Spinner';
import "../../FPL/fixturePlanner/fixturePlanner.scss";
import { Button } from '../../Shared/Button/Button';
import React, { useState, useEffect, FunctionComponent } from 'react';
import Popover from '../../Shared/Popover/Popover';
import { store } from '../../../store/index';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type LanguageProps = {
    content: any;
}

export const EliteserienFixturePlanner : FunctionComponent<LanguageProps> = (props) => {
    const fixture_planner_kickoff_time_api_path = "/fixture-planner-eliteserien/get-eliteserien-kickoff-times/";
    const fixture_planner_api_path = "/fixture-planner-eliteserien/get-all-eliteserien-fdr-data/";
    const min_gw = 1;
    const max_gw = 30;
    const empty: TeamFDRDataModel[] = [ { team_name: "-", FDR: [], checked: true, font_color: "FFF", background_color: "FFF" }];
    const emptyGwDate: KickOffTimesModel[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];

    const [ fdrDataToShow, setFdrDataToShow ] = useState(empty);
    // const [ fdrDataAllTeamsNew, setFdrDataAllTeamsNew] = useState(empty);
    
    // const [ kickOffTimes, setKickOffTimes ] = useState(emptyGwDate);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);
    const [ fdrToColor, setFdrToColor ] = useState({0.5: "0.5", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5"});


    const [ gwStart, setGwStart ] = useState(-1);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ maxGw, setMaxGw ] = useState(-1);
    const [ showTeamFilters, setShowTeamFilters ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if (store.getState()?.league_type != "Eliteserien") {
            store.dispatch({type: "league_type", payload: "Eliteserien"});
        }

        // Get fdr data from the API
        let body = { 
            start_gw: gwStart,
            end_gw: 30,
            min_num_fixtures: '1',
            combinations: 'FDR'
        };
        
        extractFDRData(body);
    }, []);


    function updateFDRData() {
        var body = {
            start_gw: gwStart,
            end_gw: gwEnd,
            min_num_fixtures: '1',
            combinations: 'FDR'
        };

        extractFDRData(body);
    }

    function isEmpty(obj: {}) {
        return Object.keys(obj).length === 0;
      }

    function extractFDRData(body: any) {
        // Get fdr data from api
        setLoading(true);
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
                // setKickOffTimes(temp_KickOffTimes);
                setKickOffTimesToShow(temp_KickOffTimes.slice(data.gw_start - 1, data.gw_end));
            }

            
            let index = 0;
            data.fdr_data.forEach((team: any[]) => {
                let team_name = JSON.parse(team[0][0][0]).team_name;

                let FDR_gw_i: FDR_GW_i[] = [];
                team.forEach((fdr_for_each_gw: any[]) => {
                    let temp: FDRData[] = [];
                    fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                        let fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
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
                let tempTeamData = { team_name: team_name, FDR: FDR_gw_i, checked: true, font_color: font_color, background_color: background_color }
                apiFDRList.push(tempTeamData);
                index += 1;
            });

            // setFdrDataAllTeamsNew(apiFDRList);
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
            temp.push({ team_name: x.team_name, FDR: x.FDR, checked: checked, font_color: x.font_color, background_color: x.background_color });
        });
        setFdrDataToShow(temp);
    }

    function convertFDRtoHex(fdr: string) {
        if (isEmpty(fdrToColor)) return fdr;
        var float = parseFloat(fdr);
        if (float == 0.5) return "#" + fdrToColor[0.5].substring(2);
        var int = parseInt(fdr);
        if (int == 1) return "#" + fdrToColor[1].substring(2);
        if (int == 2) return "#" + fdrToColor[2].substring(2);
        if (int == 3) return "#" + fdrToColor[3].substring(2);
        if (int == 4) return "#" + fdrToColor[4].substring(2);
        if (int == 5) return "#" + fdrToColor[5].substring(2);
        return "#000";
    }

    return <>
    <div className='fixture-planner-container' id="fixture-planner-container">
        <h1>{props.content.Fixture.FixturePlanner.title}<Popover 
            id={"rotations-planner-id"}
            title=""
            algin_left={true}
            popover_title={props.content.Fixture.FixturePlanner.title} 
            iconSize={14}
            iconpostition={[-10, 0, 0, 3]}
            popover_text={ props.content.Fixture.FixturePlanner.title + " (Fixture Difficulty Rating) rangerer lag etter best kampprogram mellom to runder " +
            "('" + props.content.Fixture.gw_start.toString() + "'" + " og " + "'" + props.content.Fixture.gw_end.toString() + "')" + 
            ". Best kampprogram ligger øverst og dårligst nederst. "
            }>
            Kampprogram, vanskelighetsgrader og farger er hentet fra 
            <a href="https://docs.google.com/spreadsheets/d/168WcZ2mnGbSh-aI-NheJl5OtpTgx3lZL-YFV4bAJRU8/edit?usp=sharing">Excel arket</a>
            til Dagfinn Thon.
            { fdrToColor != null && 
                <><p className='diff-introduction-container'>
                    FDR verdier: 
                    <span style={{backgroundColor: convertFDRtoHex("0.5")}} className="diff-introduction-box wide">0.25</span>
                    <span style={{backgroundColor: convertFDRtoHex("1")}} className="diff-introduction-box">1</span>
                    <span style={{backgroundColor: convertFDRtoHex("2")}} className="diff-introduction-box">2</span>
                    <span style={{backgroundColor: convertFDRtoHex("3")}} className="diff-introduction-box">3</span>
                    <span style={{backgroundColor: convertFDRtoHex("4")}} className="diff-introduction-box">4</span>
                    <span style={{backgroundColor: convertFDRtoHex("5")}} className="diff-introduction-box">5</span>
                    <span style={{backgroundColor: convertFDRtoHex("10")}} className="diff-introduction-box black">10</span>
                </p>
                <p>Lilla bokser markerer en dobbelt runde, mens svarte bokser markerer at laget ikke har kamp den runden.</p></>
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
                <input className="submit" type="submit" value={props.content.General.search_button_name}>
                </input>
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

        { loading && 
            <div style={{ backgroundColor: "#E8E8E8"}}><Spinner /></div>
        }


        { !loading && fdrDataToShow.length > 0 && fdrDataToShow[0].team_name != "-" && kickOffTimesToShow.length > 0 && kickOffTimesToShow[0].gameweek != 0 && (
            <div>
                <div className="container-fdr">
                    <div id="fdr-table" className="container-rotation">
                        <div id="fdr-team-names">
                            <table>
                                <tbody id="fdr-names">
                                    <tr>
                                        <td className="name-column min-width">
                                            {props.content.Fixture.team}
                                        </td>
                                    </tr>
                                    { fdrDataToShow.map(fdr => (<>
                                        { fdr.checked && (
                                            <tr>
                                                <td className='name-column min-width'>
                                                    {fdr.team_name}
                                                </td>
                                            </tr>
                                        )}</>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div id="fdr-team-difficulty">
                            <table>
                                <tbody id="fdr-gws">
                                    <tr id="fdr-row-gws">
                                        { kickOffTimesToShow.map(gw =>
                                            <th>{props.content.General.round_short}{gw.gameweek}
                                                <div className="day_month">
                                                    { gw.day_month }
                                                </div>
                                            </th>
                                        )}
                                    </tr>
                                    { fdrDataToShow.map(fdr => 
                                        <>
                                         { fdr.checked && (
                                            <tr id={"fdr-row-" + fdr.team_name}>
                                                { fdr.FDR.map(f => (
                                                    <td scope='col' style={{backgroundColor: convertFDRtoHex(f.fdr_gw_i[0].difficulty_score)}} className={'min-width'
                                                    + (f.fdr_gw_i.length == 1 ? " color-" + f.fdr_gw_i[0].difficulty_score + " " : " no-padding ") + 'double-border-' + f.fdr_gw_i[0].Use_Not_Use  }>

                                                        { f.fdr_gw_i.map(g => (
                                                            <div style={{backgroundColor: convertFDRtoHex(f.fdr_gw_i[0].difficulty_score), color: contrastingColor(convertFDRtoHex(f.fdr_gw_i[0].difficulty_score))}} className={'min-width color-' + g.difficulty_score + ' multiple-fixtures height-' + f.fdr_gw_i.length}>
                                                                { g.opponent_team_name == '-' ? "Blank" : (g.opponent_team_name.toUpperCase() + " (" + g.H_A + ")") }
                                                            </div>
                                                        ))}
                                                    </td>
                                                ))}
                                            </tr>
                                        )}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )}
     </div> </>
};

export default EliteserienFixturePlanner;