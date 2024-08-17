import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { TeamNamePlayerName } from '../../../models/fixturePlanning/TeamNamePlayerName';
import ShowTeamIDFDRData from '../../Fixtures/ShowFDRData/ShowTeamIdFDRData';
import { useState, useEffect, FunctionComponent } from 'react';
import * as external_urls from '../../../staticUrls/externalUrls';
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
import { maxGwEsf, maxGwFpl, minGwEsf, minGwFpl } from '../../../constants/gws';
import { url_get_fdr_data_from_team_id_eliteserien, url_get_fdr_data_from_team_id_premier_league } from '../../../staticUrls/APIUrls';
import useFixturePlannerTeamIDMetaData from '../../../hooks/useFixturePlannerTeamIDPlayers';

export const FixturePlannerTeamIdPage : FunctionComponent<PageProps> = (props) => {
    const fixturePlannerApiPath = props.leagueType === esf
        ? url_get_fdr_data_from_team_id_eliteserien 
        : url_get_fdr_data_from_team_id_premier_league;
    
    const initMaxGw = props.leagueType === esf ? maxGwEsf : maxGwFpl;
    
    const [ goalKeepers, setGoalkeepers ] = useState<TeamNamePlayerName[]>([]);
    const [ defenders, setDefenders ] = useState<TeamNamePlayerName[]>([]);
    const [ midfielders, setMidfielders ] = useState<TeamNamePlayerName[]>([]);
    const [ forwards, setForwards ] = useState<TeamNamePlayerName[]>([]);
    const [ gwStart, setGwStart ] = useState<number>(-1);
    const [ gwEnd, setGwEnd ] = useState<number>(initMaxGw);
    const [ teamID, setTeamId ] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [ openModal, setOpenModal ] = useState(false);
    const [ newPlayerName, setNewPlayerName ] = useState("");
    const [ newPlayerTeam, setNewPlayerTeam ] = useState("");
    const [ newPlayerPositionNumber, setNewPlayerPositionNumber ] = useState(0);

    const { 
        maxGw,
        kickOffTimes,
        playerList,
        fixtureData,
        isLoading,
        errorLoading
    } = useFixturePlannerTeamIDMetaData(props, setGwStart, setGwEnd);
        
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
            fetchFDRData(body);
        } 
        
    }, [gwStart]);
    
    if (isLoading && !errorLoading) {
        return <Spinner />;
    }

    const fetchFDRData = (body: any) => {
        setLoading(true);

        axios.post(fixturePlannerApiPath, body).then((response: any) => {
            const data = JSON.parse(response.data);
            const hasPlayerData = data?.goal_keepers?.length > 0 && data?.defenders?.length > 0 && data?.midtfielders?.length > 0 && data?.forwards?.length > 0;

            setGoalkeepers(hasPlayerData ? convertToTeamNamePlayerName(data?.goal_keepers) : []);
            setDefenders(hasPlayerData ? convertToTeamNamePlayerName(data?.defenders) : []);
            setMidfielders(hasPlayerData ? convertToTeamNamePlayerName(data?.midtfielders) : []);
            setForwards(hasPlayerData ? convertToTeamNamePlayerName(data?.forwards) : []);

            setLoading(false);

            if (teamID > 0) {
                window.history.pushState('', '', `${window.location.origin}${window.location.pathname}?team_id=${teamID}`);
            }
        });
    };

    const convertToTeamNamePlayerName = (data: TeamNamePlayerName[]) => {
        return data.map((x: any) => {
            const parsedData = JSON.parse(x);
            return {
                team_id: parsedData.team_name_short,
                player_name: parsedData.player_name,
            };
        });
    };

    function toggleModal(postionNumber: number) {
        setNewPlayerPositionNumber(postionNumber);
        setOpenModal(true);
    }

    const handleAddPlayer = () => {
        const selector = document.getElementById('player_dropdown') as HTMLSelectElement;
        const [player, team_id] = selector.value.split(",");
        const newPlayer = { team_id, player_name: player };

        if (newPlayerPositionNumber === 0) setGoalkeepers([...goalKeepers, newPlayer]);
        if (newPlayerPositionNumber === 1) setDefenders([...defenders, newPlayer]);
        if (newPlayerPositionNumber === 2) setMidfielders([...midfielders, newPlayer]);
        if (newPlayerPositionNumber === 3) setForwards([...forwards, newPlayer]);

        setNewPlayerName("");
        setNewPlayerTeam("");
        setNewPlayerPositionNumber(0);
        setOpenModal(false);
    };

    const handleRemovePlayer = (position: number, playerName: string) => {
        if (position === 0) setGoalkeepers(goalKeepers.filter(player => player.player_name !== playerName));
        if (position === 1) setDefenders(defenders.filter(player => player.player_name !== playerName));
        if (position === 2) setMidfielders(midfielders.filter(player => player.player_name !== playerName));
        if (position === 3) setForwards(forwards.filter(player => player.player_name !== playerName));
    };

    const handleUpdateFDRData = () => {
        const body = {
            current_gw: gwStart,
            team_id: teamID,
        };

        fetchFDRData(body);
    };

    const playerNames = [props.languageContent.General.goalkeeper, props.languageContent.General.defender, props.languageContent.General.midfielder, props.languageContent.General.forward]
    const initMinGw = props.leagueType === esf ? minGwEsf : minGwFpl;

    return ( 
    <div className='team-id-wrapper'>
        <div className='team-id-container'>
            <DefaultPageContainer 
                pageClassName='fixture-planner-container'
                leagueType={props.leagueType}
                heading={props.languageContent.Fixture.TeamPlanner?.title}
                description={`Fixture Difficulty Rating Planner for a team with a given team-ID for ${(props.leagueType === fpl ? "Premier League" : "Eliteserien")}. `}
                errorLoading={errorLoading}
                isLoading={isLoading}
                renderTitle={() => 
                    <h1>
                        {props.languageContent.Fixture.TeamPlanner?.title}
                        <Popover 
                            id='rotations-planner-id'
                            title=''
                            alignLeft={true}
                            popoverTitle={props.languageContent.Fixture.TeamPlanner?.title} 
                            iconSize={14}
                            iconPosition={[-10, 0, 0, 3]}
                            popoverText={ "" }>
                            <p>{ props.languageContent.Fixture.TeamPlanner.description_1}</p>
                            <p>{ props.languageContent.Fixture.TeamPlanner.description_2}</p>
                            <p>{ props.languageContent.Fixture.TeamPlanner.description_3}</p>
                            { props.languageContent.LongTexts.fixtureAreFrom }
                            <a href={external_urls.url_spreadsheets_dagfinn_thon}>{ props.languageContent.LongTexts.ExcelSheet }</a> { props.languageContent.LongTexts.to } Dagfinn Thon.
                            <FdrBox content={props.languageContent} leagueType={esf}/>
                        </Popover>
                    </h1>
                }    
            >
                { maxGw > 0 && 
                    <div className='input-row-container'>
                        <form onSubmit={(e) => { handleUpdateFDRData(); e.preventDefault()}}>
                            <TextInput 
                                htmlFor='input-form-start-gw'
                                min={initMinGw}
                                max={maxGw}
                                onInput={(e: number) => setGwStart(e)} 
                                defaultValue={gwStart}>
                                {props.languageContent.Fixture.gw_start}
                            </TextInput>
                            
                            <TextInput 
                                htmlFor='input-form-end-gw'
                                min={gwStart}
                                max={maxGw}
                                onInput={(e: number) => setGwEnd(e)} 
                                defaultValue={gwEnd}>
                                {props.languageContent.Fixture.gw_end}
                            </TextInput>
                            
                            <TextInput 
                                htmlFor='input-form-team-id'
                                min={0}
                                max={10000000}
                                minWidth={80}
                                onInput={(e: number) => setTeamId(e)}
                                defaultValue={teamID} >
                                {props.languageContent.Fixture.teamId}
                            </TextInput>

                            <input className="submit" type="submit" value={props.languageContent.General.search_button_name} />
                        </form> 
                    </div>
                }

                { loading && <Spinner /> }

                { <Modal 
                    toggleModal={(showModal: boolean) => setOpenModal(showModal)} 
                    openModal={openModal} 
                    title={`${props.languageContent.General.add} ${props.languageContent.General.new} ${playerNames[newPlayerPositionNumber]}`}>
                        <div className='text-input-container border'>
                            <label htmlFor='team_short_name_dropdown'>{props.languageContent.Fixture.team}</label>
                            <select 
                                onChange={(e) => { setNewPlayerTeam(e.target.value) }} 
                                id="team_short_name_dropdown" 
                                name="team_short_name_dropdown"
                                defaultValue={newPlayerTeam}
                            >
                                <option value="">{props.languageContent.General.all_teams}</option>
                                {fixtureData[0]?.map(x => (
                                    <option key={x.team_id} value={x.team_id}>                                
                                        {x.team_name_short}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='text-input-container border'>
                            <label htmlFor='player_dropdown'>{props.languageContent.General.player}</label>
                                <select 
                                    onChange={(e) => { setNewPlayerName(e.target.value)} } 
                                    id="player_dropdown" 
                                    name="player_dropdown"
                                >
                                    {playerList.length > 0 &&
                                        playerList.filter((player => (player.player_position_id - 1) === newPlayerPositionNumber))
                                            .filter(player => (player.player_team_id.toString() === newPlayerTeam || newPlayerTeam===""))
                                                .map(player => (
                                                    <option key={`${player.player_web_name}-${player.player_team_id}`} value={[player.player_web_name, player.player_team_id.toString()]}>
                                                        {player.player_web_name}
                                                    </option>
                                        ))
                                    }
                            </select>
                        </div>
                        <Button 
                            onclick={handleAddPlayer} 
                            buttonText={props.languageContent.General.add_player}
                            iconClass='fa fa-plus' />
                    </Modal> 
                }

                {!loading && fixtureData.length > 0 && kickOffTimes.length > 0 && (
                    <ShowTeamIDFDRData 
                        content={props.languageContent}
                        playerData={[goalKeepers, defenders, midfielders, forwards]}
                        fixtureData={fixtureData}
                        gwStart={gwStart}
                        gwEnd={gwEnd}
                        kickOffTimes={kickOffTimes}
                        allowToggleBorder={true}
                        openModal={(postionNumber: number) => toggleModal(postionNumber)}
                        removePlayer={(positionNumber: number, playerName: string) => handleRemovePlayer(positionNumber, playerName) }
                    />
                )}
            </DefaultPageContainer>
        </div>
    </div>
)};

export default FixturePlannerTeamIdPage;