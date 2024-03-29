import { FDR_GW_i, FDRData, TeamIdFDRModel } from '../../../models/fixturePlanning/TeamFDRData';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { TeamNamePlayerName } from '../../../models/fixturePlanning/TeamNamePlayerName';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import ShowTeamIDFDRData from '../../Fixtures/ShowFDRData/ShowTeamIdFDRData';
import React, { useState, useEffect, FunctionComponent } from 'react';
import * as external_urls from '../../../static_urls/externalUrls';
import { PageProps, esf, fpl } from '../../../models/shared/PageProps';
import FdrBox from '../../Shared/FDR-explaination/FdrBox';
import TextInput from '../../Shared/TextInput/TextInput';
import "../../Pages/FixturePlanner/FixturePlanner.scss";
import { Spinner } from '../../Shared/Spinner/Spinner';
import Popover from '../../Shared/Popover/Popover';
import Button from '../../Shared/Button/Button';
import '../../Shared/TextInput/TextInput.scss';
import Modal from '../../Shared/Modal/Modal';
import axios from 'axios';
import { max_gw_esf, max_gw_fpl, min_gw_esf, min_gw_fpl } from '../../../constants/gws';
import { url_get_fdr_data_from_team_id_eliteserien, url_get_fdr_data_from_team_id_premier_league } from '../../../static_urls/APIUrls';
import { PlayerModel } from '../../../models/fixturePlanning/PlayerModel';


export const FixturePlannerTeamIdPage : FunctionComponent<PageProps> = (props) => {
    const fixture_planner_api_path = props.league_type === esf 
        ? url_get_fdr_data_from_team_id_eliteserien 
                : url_get_fdr_data_from_team_id_premier_league;
    
    const min_gw = props.league_type === esf ? min_gw_esf : min_gw_fpl;
    const max_gw = props.league_type === esf ? max_gw_esf : max_gw_fpl;

    const empty: TeamIdFDRModel[] = [ { team_name_short: "-", team_id: -1, FDR: [] } ];
    const emptyPlayerList: PlayerModel[] = [ {  player_team_id: -1, player_position_id: -1, player_web_name: "-" } ];
    const emptyGwDate: KickOffTimesModel[] = [{gameweek: 0, day_month: "",kickoff_time: "" }];
    const emptyTeamNamePlayerName: TeamNamePlayerName[] = [ { team_id: "-", player_name: "-"} ];
    
    const [ fixtureData, setFixtureData ] = useState([empty]);
    const [ kickOffTimesToShow, setKickOffTimesToShow ] = useState(emptyGwDate);
    const [ playerList, setPlayerList ] = useState(emptyPlayerList);
    
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

    const [ newPlayerName, setNewPlayerName ] = useState("");
    const [ newPlayerTeam, setNewPlayerTeam ] = useState("");
    const [ newPlayerPostionNumber, setNewPlayerPostionNumber ] = useState(0);

    useEffect(() => {
        updateFixtureData(true);
    }, []);

    useEffect(() => {       
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const teamId = urlParams.get('team_id')

        if (teamId && parseInt(teamId) && gwStart > 0) {             
            var body = {
                current_gw: gwStart,
                team_id: teamId,
            };

            setTeamId(parseInt(teamId));
    
            extractFDRData(body);
        } 

    }, [gwStart]);


    function updateFixtureData(isInitial: boolean) {
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

            if (data?.player_list?.length > 0) {
                let playerList: PlayerModel[] = [];
                data?.player_list.forEach((player: any) => {
                    const data = JSON.parse(player);
                    playerList.push({
                        player_position_id: data.player_position_id,
                        player_web_name: data.player_web_name,
                        player_team_id: data.player_team_id,
                    })
                });
                setPlayerList(playerList);
            }
            
            const fdr_data = convertFixtureData(data.fdr_data);
            const fdr_data_off = convertFixtureData(data.fdr_data_offensive);
            const fdr_data_def = convertFixtureData(data.fdr_data_defensive);

            setFixtureData([fdr_data, fdr_data_def, fdr_data_off]);

            if (fdr_data.length > 15 && isInitial) {
                setGoalkeepers([]);
                setDefenders([])
                setMidtfielders([]);
                setForwards([])
            }
        });
    }

    function convertFixtureData(fdr_data: any): TeamIdFDRModel[] {
        var temp: TeamIdFDRModel[] = [];

        fdr_data.forEach((team: any) => {
            const team_i = JSON.parse(team);
            const team_name_short = team_i["team_name_short"];
            const team_id = team_i["team_id"];

            const FDR_gw_i: FDR_GW_i[] = [];
            
            team_i.fdr.forEach((fdr_for_each_gw: any[]) => {
                let temp: FDRData[] = [];
                fdr_for_each_gw.forEach((fdr_in_gw_i: any) => {
                    let fdr_in_gw_i_json = JSON.parse(fdr_in_gw_i);
                    temp.push({
                        opponent_team_name: fdr_in_gw_i_json.opponent_team_name,
                        difficulty_score: fdr_in_gw_i_json.difficulty_score,
                        H_A: fdr_in_gw_i_json.H_A,
                        Use_Not_Use: fdr_in_gw_i_json.Use_Not_Use ?? 0,
                        message: fdr_in_gw_i_json.message,
                    })
                });
                FDR_gw_i.push({fdr_gw_i: temp})
            });
                
            temp.push({ team_name_short: team_name_short, team_id: team_id, FDR: FDR_gw_i });
        });
        
        return temp;
    }

    function updateFDRData() {
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

            if (teamID > 0) {
                window.history.pushState('', '', window.location.origin + window.location.pathname + '?team_id=' + teamID);
            }
        })
    }

    function convertToTeamNamePlayerName(data: TeamNamePlayerName[]) {
        const position: TeamNamePlayerName[] = [];

        data.map( (x: any) => {
            const data = JSON.parse(x);
            position.push({
                team_id: data.team_name_short,
                player_name: data.player_name,
            })
        })

        return position;
    }

    function toggleModal(postionNumber: number) {
        setNewPlayerPostionNumber(postionNumber);
        setOpenModal(true);
    }

    function AddPlayer() {
        const selector_player: any = document.getElementById('player_dropdown');
        const player_info = selector_player[selector_player.selectedIndex].value;
        const player = player_info.split(",")[0];
        const team_id = player_info.split(",")[1];

        const newPlayer = { team_id: team_id, player_name: player }
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

    return <div className='team-id-wrapper'><div className='team-id-container'>
    <DefaultPageContainer 
        pageClassName='fixture-planner-container'
        leagueType={props.league_type}
        heading={props.content.Fixture.TeamPlanner?.title}
        description={`Fixture Difficulty Rating Planner for a team with a given team-ID for ${(props.league_type === fpl ? "Premier League" : "Eliteserien")}. `}>
        <h1>
            {props.content.Fixture.TeamPlanner?.title}
            <Popover 
                id={"rotations-planner-id"}
                title=""
                algin_left={true}
                popover_title={props.content.Fixture.TeamPlanner?.title} 
                iconSize={14}
                iconpostition={[-10, 0, 0, 3]}
                popover_text={ "" }>
                <p>{ props.content.Fixture.TeamPlanner.description_1}</p>
                <p>{ props.content.Fixture.TeamPlanner.description_2}</p>
                <p>{ props.content.Fixture.TeamPlanner.description_3}</p>
                { props.content.LongTexts.fixtureAreFrom }
                <a href={external_urls.url_spreadsheets_dagfinn_thon}>{ props.content.LongTexts.ExcelSheet }</a> { props.content.LongTexts.to } Dagfinn Thon.
                <FdrBox content={props.content} leagueType={esf}/>
            </Popover>
        </h1>
        { maxGw > 0 && 
            <div className='input-row-container'>
                <form onSubmit={(e) =>  {updateFDRData(); e.preventDefault()}}>

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
                        htmlFor='input-form-team-id'
                        min={0}
                        max={10000000}
                        minWidth={80}
                        onInput={(e: number) => setTeamId(e)}
                        defaultValue={teamID} >
                        {props.content.Fixture.teamId}
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
                <div className='text-input-container border'>
                    <label htmlFor='team_short_name_dropdown'>{props.content.Fixture.team}</label>
                    <select onChange={(e) => { setNewPlayerTeam(e.target.value) }} 
                    id="team_short_name_dropdown" name="team_short_name_dropdown">
                    <option value="" selected={newPlayerTeam===""}>{props.content.General.all_teams}</option>
                    { fixtureData[0]?.length > 0 &&
                        fixtureData[0].map(x => (
                            <option 
                                selected={x.team_name_short == newPlayerTeam} 
                                value={x.team_id}>                                
                                {x.team_name_short}
                            </option>
                        ))
                    }
                    </select>
                </div>
                <div className='text-input-container border'>
                    <label htmlFor='player_dropdown'>{props.content.Fixture.team}</label>
                    <select onChange={(e) => { setNewPlayerName(e.target.value)} } 
                    id="player_dropdown" name="player_dropdown">
                    { playerList.length > 0 && playerList[0].player_web_name !== '-' &&
                        playerList.filter((player => (player.player_position_id - 1) === newPlayerPostionNumber))
                        .filter(player => (player.player_team_id.toString() === newPlayerTeam || newPlayerTeam==="")).map(player => (
                            <option value={[player.player_web_name, player.player_team_id.toString()]}>
                                {player.player_web_name}
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
    </div></div>
};

export default FixturePlannerTeamIdPage;