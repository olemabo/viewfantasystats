import { TeamFDRDataModel, FDR_GW_i, FDRData, TeamIdFDRModel } from '../../../models/fixturePlanning/TeamFDRData';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { ShowFDRData } from '../../Fixtures/ShowFDRData/ShowFDRData';
import * as external_urls from '../../../static_urls/externalUrls';
import ToggleButton from '../../Shared/ToggleButton/ToggleButton';
import { PageProps, esf } from '../../../models/shared/PageProps';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import "../../Pages/FixturePlanner/FixturePlanner.scss";
import { Spinner } from '../../Shared/Spinner/Spinner';
import Popover from '../../Shared/Popover/Popover';
import { store } from '../../../store/index';
import axios from 'axios';
import { TeamNamePlayerName } from '../../../models/fixturePlanning/TeamNamePlayerName';
import ShowTeamIDFDRData from '../../Fixtures/ShowFDRData/ShowTeamIdFDRData';
import Modal from '../../Shared/Modal/Modal';
import '../../Shared/TextInput/TextInput.scss';
import Button from '../../Shared/Button/Button';


export const FixturePlannerTeamIdPage : FunctionComponent<PageProps> = (props) => {
    const fixture_planner_api_path = "/fixture-planner-eliteserien/get-fdr-data-from-team-id/";
    
    const min_gw = 1;
    const max_gw = 30;
    
    const empty: TeamIdFDRModel[] = [ { team_name_short: "-", FDR: [] } ];
    const emptyGwDate: KickOffTimesModel[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];
    const emptyTeamNamePlayerName: TeamNamePlayerName[] = [ { team_name_short: "-", player_name: "-"} ];
    
    const [ fixtureData, setFixtureData ] = useState([empty]);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);
    
    const [ goalKeepers, setGoalkeepers ] = useState(emptyTeamNamePlayerName);
    const [ defenders, setDefenders ] = useState(emptyTeamNamePlayerName);
    const [ midtfielders, setMidtfielders ] = useState(emptyTeamNamePlayerName);
    const [ forwards, setForwards ] = useState(emptyTeamNamePlayerName);

    const [ gwStart, setGwStart ] = useState(-1);
    const [ gwEnd, setGwEnd ] = useState(max_gw);
    const [ maxGw, setMaxGw ] = useState(-1);
    const [ teamID, setTeamId ] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [ openModal, setOpenModal ] = useState(false);
    const [ fdrType, SetFdrType ] = useState("");

    useEffect(() => {
        store.dispatch({type: "league_type", payload: props.league_type});
        
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        // Get fdr data from the API
        updateFixtureData(fdrType, true);
    }, []);

    function updateFixtureData(fdrType: string, isInitial: boolean) {
        axios.get(fixture_planner_api_path).then((x: any) => {
            let data = JSON.parse(x.data);

            if (data.current_gw !== gwStart) { setGwStart(data.current_gw); }

            if (data.gw_end !== gwEnd) { setGwEnd(data.gw_end); }
            
            if (maxGw < 0) { setMaxGw(data.max_gw); }
                        
            if (data?.gws_and_dates?.length > 0) {
                let temp_KickOffTimes: KickOffTimesModel[] = [];
                data?.gws_and_dates.forEach((kickoff: string) => temp_KickOffTimes.push(JSON.parse(kickoff)));
                setKickOffTimesToShow(temp_KickOffTimes);
            }
            
            const fdr_data = convertFixtureData(data.fdr_data);
            const fdr_data_off = convertFixtureData(data.fdr_data_offensive);
            const fdr_data_def = convertFixtureData(data.fdr_data_defensive);

            setFixtureData([fdr_data, fdr_data_def, fdr_data_off]);

            if (fdr_data.length > 15 && isInitial) {
                setGoalkeepers([
                    // { team_name_short: fdr_data[0].team_name_short, player_name: fdr_data[0].team_name_short },
                    // { team_name_short: fdr_data[1].team_name_short, player_name: fdr_data[1].team_name_short }
                ]);

                setDefenders([
                    // { team_name_short: fdr_data[2].team_name_short, player_name: fdr_data[2].team_name_short },
                    // { team_name_short: fdr_data[3].team_name_short, player_name: fdr_data[3].team_name_short },
                    // { team_name_short: fdr_data[4].team_name_short, player_name: fdr_data[4].team_name_short },
                    // { team_name_short: fdr_data[5].team_name_short, player_name: fdr_data[5].team_name_short },
                    // { team_name_short: fdr_data[6].team_name_short, player_name: fdr_data[6].team_name_short }
                ])

                setMidtfielders([
                    // { team_name_short: fdr_data[7].team_name_short, player_name: fdr_data[7].team_name_short },
                    // { team_name_short: fdr_data[8].team_name_short, player_name: fdr_data[8].team_name_short },
                    // { team_name_short: fdr_data[9].team_name_short, player_name: fdr_data[9].team_name_short },
                    // { team_name_short: fdr_data[10].team_name_short, player_name: fdr_data[10].team_name_short },
                    // { team_name_short: fdr_data[11].team_name_short, player_name: fdr_data[11].team_name_short }
                ]);

                setForwards([
                    // { team_name_short: fdr_data[12].team_name_short, player_name: fdr_data[12].team_name_short },
                    // { team_name_short: fdr_data[13].team_name_short, player_name: fdr_data[13].team_name_short },
                    // { team_name_short: fdr_data[14].team_name_short, player_name: fdr_data[14].team_name_short }
                ])
            }
        });
    }

    function convertFixtureData(fdr_data: any): TeamIdFDRModel[] {
        var temp: TeamIdFDRModel[] = [];

        fdr_data.forEach((team: any) => {
            const team_i = JSON.parse(team);
            const team_name_short = team_i["team_name_short"];
            
            const FDR_gw_i: FDR_GW_i[] = [];
            
            team_i.fdr.forEach((fdr_for_each_gw: any[]) => {
                let temp: FDRData[] = [];
                fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                    let fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                    temp.push({
                        opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                        difficulty_score: fdr_in_gw_i_json.difficulty_score,
                        H_A: fdr_in_gw_i_json.H_A,
                        Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use ?? 0
                    })
                });
                FDR_gw_i.push({fdr_gw_i: temp})
            });

            temp.push({ team_name_short: team_name_short, FDR: FDR_gw_i });
        });
        
        return temp;
    }

    function updateFDRData(currentFdrType: string) {
        var body = {
            current_gw: gwStart,
            team_id: teamID,
        };

        extractFDRData(body);
    }

    function extractFDRData(body: any) {
        setLoading(true);
        // don't to a full search if only startgw and endgw are chaninging

        // Get fdr data from api
        axios.post(fixture_planner_api_path, body).then((x: any) => {            
            let data = JSON.parse(x.data);
            
            if (data?.goal_keepers?.length > 0 && data?.defenders?.length > 0 && data?.midtfielders?.length > 0 && data?.forwards?.length > 0){
                setGoalkeepers(convertToTeamNamePlayerName(data?.goal_keepers));
                setDefenders(convertToTeamNamePlayerName(data?.defenders));
                setMidtfielders(convertToTeamNamePlayerName(data?.midtfielders));
                setForwards(convertToTeamNamePlayerName(data?.forwards));
            }
            else {
                setGoalkeepers([]);
                setDefenders([]);
                setMidtfielders([]);
                setForwards([]);
            }

            setLoading(false);
        })
    }

    function convertToTeamNamePlayerName(data: TeamNamePlayerName[]) {
        const position: TeamNamePlayerName[] = [];

        data.map( (x: any) => {
            const data = JSON.parse(x);
            position.push({
                team_name_short: data.team_name_short,
                player_name: data.player_name,
            })
        })

        return position;
    }

    // function changeXlsxSheet(fdr_type: string) {
    //     SetFdrType(fdr_type);
    //     updateFixtureData(fdr_type, false);
    // }

    function toggleModal(postionNumber: number) {
        setNewPlayerPostionNumber(postionNumber);
        setOpenModal(true);
    }

    const [ newPlayerName, setNewPlayerName ] = useState("");
    const [ newPlayerTeam, setNewPlayerTeam ] = useState("");
    const [ newPlayerPostionNumber, setNewPlayerPostionNumber ] = useState(0);

    function AddPlayer() {
        const newPlayer = { team_name_short: newPlayerTeam, player_name: newPlayerName }
        if (newPlayerPostionNumber === 0) { goalKeepers.push(newPlayer); }
        if (newPlayerPostionNumber === 1) { defenders.push(newPlayer); }
        if (newPlayerPostionNumber === 2) { midtfielders.push(newPlayer); }
        if (newPlayerPostionNumber === 3) { forwards.push(newPlayer); }
        setNewPlayerName("");
        setNewPlayerTeam("");
        setNewPlayerPostionNumber(0);
        setOpenModal(false);
    }

    function removePlayerFromPosition(position: number, playerName: string) {
        if (position === 0) { setGoalkeepers(removePlayer(goalKeepers, playerName)); }
        if (position === 1) { setDefenders(removePlayer(defenders, playerName)); }
        if (position === 2) { setMidtfielders(removePlayer(midtfielders, playerName)); }
        if (position === 3) { setForwards(removePlayer(forwards, playerName)); }
    }
    
    function removePlayer(playerData: TeamNamePlayerName[], playerName: string): TeamNamePlayerName[] {
        const newArr = playerData.filter(object => {
            return object.player_name !== playerName;
        });

        return newArr;
    };

    const playerNames = [props.content.General.goalkeeper, props.content.General.defender, props.content.General.midfielder, props.content.General.forward]

    return <>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container' 
        heading={`${props.content.Fixture.TeamID?.title} - ${(store.getState().league_type === "fpl" ? "Premier League" : "Eliteserien")}`} 
        description={'Fixture Difficulty Rating Planner for Eliteserien Fantasy (ESF). '}>
        <h1>
            {props.content.Fixture.TeamID?.title}
            <Popover 
                id={"rotations-planner-id"}
                title=""
                algin_left={true}
                popover_title={props.content.Fixture.TeamID?.title} 
                iconSize={14}
                iconpostition={[-10, 0, 0, 3]}
                popover_text={ "" }>
                Kampprogram og vanskelighetsgrader er hentet fra 
                <a href={external_urls.url_spreadsheets_dagfinn_thon}>Excel arket</a> til Dagfinn Thon.
                <FdrBox leagueType={esf}/>
            </Popover>
        </h1>
        { maxGw > 0 && 
            <div className='input-row-container'>
                <form onSubmit={(e) =>  {updateFDRData(fdrType); e.preventDefault()}}>
                    <TextInput 
                        htmlFor='input-form-team-id'
                        min={0}
                        max={100000}
                        minWidth={80}
                        onInput={(e: number) => setTeamId(e)}
                        defaultValue={0} >
                        {props.content.Fixture.teamId}
                    </TextInput>

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

                    <input className="submit" type="submit" value={props.content.General.search_button_name} />
                </form> 
            </div>
        }


        { loading && <Spinner /> }

        { <Modal 
            toggleModal={(showModal: boolean) => setOpenModal(showModal)} 
            openModal={openModal} 
            title={`${props.content.General.add} ${props.content.General.new} ${playerNames[newPlayerPostionNumber]}`}>
                <TextInput 
                    border={true}
                    htmlFor='input-form-player-name'
                    type={'text'}
                    minWidth={200}
                    onInput={(e: string) => setNewPlayerName(e)}>
                    { props.content.General.playerName }
                </TextInput>
                <div className='text-input-container border'>
                    <label htmlFor='team_short_name_dropdown'>{props.content.Fixture.team}</label>
                    <select onChange={(e) => setNewPlayerTeam(e.target.value)} 
                    id="team_short_name_dropdown" name="team_short_name_dropdown">
                    { fixtureData[0]?.length > 0 &&
                        fixtureData[0].map(x => (
                            <option selected={x.team_name_short == newPlayerTeam} value={x.team_name_short}>
                                {x.team_name_short}
                            </option>
                        ))
                    }
                    </select>
                </div>
                <Button 
                    onclick={ () => AddPlayer() } 
                    buttonText={props.content.General.add_player}
                    icon_class='fa fa-plus' />
            </Modal> 
        }

        { !loading && fixtureData.length > 0 && fixtureData[0][0].team_name_short !== "-" && kickOffTimesToShow.length > 0 && kickOffTimesToShow[0].gameweek != 0 && (
            <ShowTeamIDFDRData 
                content={props.content}
                playerData={[goalKeepers, defenders, midtfielders, forwards]}
                fixtureData={fixtureData}
                gwStart={gwStart}
                gwEnd={gwEnd}
                kickOffTimes={kickOffTimesToShow}
                allowToggleBorder={true}
                openModal={(postionNumber: number) => toggleModal(postionNumber)}
                removePlayer={ (positionNumber: number, playerName: string) => removePlayerFromPosition(positionNumber, playerName) }
            />
        )}
    </DefaultPageContainer>
    </>
};

export default FixturePlannerTeamIdPage;