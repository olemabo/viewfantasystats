import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { TeamNameAndIdModel } from '../../../models/playerOwnership/TeamNameAndIdModel';
import React, { useState, useEffect, FunctionComponent } from 'react';
import TableSortHead from '../../Shared/TableSortHead/TableSortHead';
import { Spinner } from '../../Shared/Spinner/Spinner';
import '../PlayerOwnership/PlayerOwnership.scss';
import { store } from '../../../store/index';
import Pagination from 'rc-pagination';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type LanguageProps = {
    content: any;
    league_type: string;
}

export interface PlayerStatisticsModel {
    Name: string;
    Points: number;
    Bps: number;
    ICT: number;
    I: number;
    C: number;
    T: number;
    player_team_id: number;
    player_position_id: number;
}

type CategoryTypes = 'Name' | 'Points' | 'Bps' | 'ICT' | 'I' | 'C' | 'T';

export const PlayerStatisticsPage : FunctionComponent<LanguageProps> = (props) => {
    const player_statistics_api_path = "/statistics/player-statistics-api/";
    const emptyAvailableGws: any[] = []

    const emptyOwnershipData: PlayerStatisticsModel[] = [];

    const  [ firstLoading, setFirstLoading ] = useState(true);
    const [ sorting_keyword_teams, setSorting_keyword_teams ] = useState("All");
    const [ sorting_keyword_positions, setSorting_keyword_positions ] = useState("All");
    const [ query, setQuery ] = useState("");
    const [ teamNameAndIds, setTeamNameAndIds ] = useState(emptyAvailableGws);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ playerStatsDataToShow, setPlayerStatsDataToShow ] = useState(emptyOwnershipData);
    const [ playerStatsData, setPlayerStatsData ] = useState(emptyOwnershipData);
    const [ lastXGws, setLastXGws ] = useState(0);
    const [ totalNumberOfGws, setTotalNumberOfGws ] = useState(0);

    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const [ numberOfHitsPerPagination, setNumberOfHitsPerPagination ] = useState(15);
    const [ categories, setCategories ] = useState([]);
    const [ currentSorted, setCurrentSorted ] = useState("Points");
    
    useEffect(() => {
        store.dispatch({type: "league_type", payload: props.league_type});

        axios.get(player_statistics_api_path + "?league_name=" + props.league_type).then(x => {  
            let data = JSON.parse(x?.data);
            setTotalNumberOfGws(data.total_number_of_gws);
            setCategories(data?.categories);
        })

        var body = {
            league_name: props.league_type,
            last_x_gw: lastXGws,
        };

        axios.post(player_statistics_api_path, body).then(x => {  
            let data = JSON.parse(x?.data);
            setFirstLoading(false);
            UpdateTeamNameAndIds(data.team_names_and_ids);
            setPlayerStatsData(data?.player_info);
            setPlayerStatsDataToShow(data?.player_info);
            setCurrentSorted("Points");
        })

    }, []);


    function updateOwnershipTopXData(last_x_gws: number) {
        var body = {
            league_name: props.league_type,
            last_x_gw: last_x_gws,
        };
        axios.post(player_statistics_api_path, body).then(x => {  
            let data = JSON.parse(x?.data);
            setFirstLoading(false);
            UpdateTeamNameAndIds(data.team_names_and_ids);
            setPlayerStatsData(data?.player_info);
            setPlayerStatsDataToShow(data?.player_info);
            setLastXGws(last_x_gws);
            filterOnPositionAndTeam(sorting_keyword_teams, sorting_keyword_positions, query, data?.player_info);
        })
    }


    function filterOnPositionAndTeam(team_id: string, postion_id: string, query: string, data?: PlayerStatisticsModel[]) {

        let temp: PlayerStatisticsModel[] = data != null ? data : playerStatsData;    

        let queryFilteredList: PlayerStatisticsModel[] = [];
        
        temp.map(x => {
            if (query != "" && !x.Name.toLowerCase().includes(query.toLowerCase())) {
                
            }
            else {
                queryFilteredList.push(x);
            }
        })

        if (postion_id == "Goalkeepers") {
            queryFilteredList = queryFilteredList.filter(function (el) {
                return el.player_position_id == 1;
            });
        }
        else if (postion_id == "Defenders") {
            queryFilteredList = queryFilteredList.filter(function (el) {
                return el.player_position_id == 2;
            });
        }
        else if (postion_id == "Midfielders") {
            queryFilteredList = queryFilteredList.filter(function (el) {
                return el.player_position_id == 3;
            });
        }
        else if (postion_id == "Forwards") {
            queryFilteredList = queryFilteredList.filter(function (el) {
                return el.player_position_id == 4;
            });
        }
        
        teamNameAndIds.map(x => {
            if (x.team_name == team_id) {
                queryFilteredList = queryFilteredList.filter(function (el) {
                    return el.player_team_id == x.team_id;
                });
            }
        })

        setPlayerStatsDataToShow(queryFilteredList);
        setQuery(query);
        setSorting_keyword_positions(postion_id);
        setSorting_keyword_teams(team_id);
        setCurrentSorted("Points");
    }

    function UpdateTeamNameAndIds(data: any) {
        let te: TeamNameAndIdModel[] = []
        data?.map((team: any) => {
            let parsed = JSON.parse(team);
            te.push({
                team_name: parsed.team_name,
                team_id: parsed.id
            })
        })
        setTeamNameAndIds(te);
    }

    function paginationUpdate(pageNumber: number) {
        setPaginationNumber(pageNumber);
    }
    
    function sortOwnershipData(sortType: CategoryTypes, increase: boolean) {
        let temp = [...playerStatsDataToShow];
        let sorted = temp.sort(propComparator(sortType, increase));
        setPlayerStatsDataToShow(sorted);
        setCurrentSorted(sortType);
    }

    const propComparator = (category:CategoryTypes, increasing: boolean) =>
    (a:PlayerStatisticsModel, b:PlayerStatisticsModel) => {
        let first_value = a[category];
        let second_value = b[category];
        if (first_value > second_value){
            return increasing ? -1 : 1;
        }
        if (first_value < second_value){
            return increasing ? 1 : -1;
        }
        return 0;
    } 

    let totalNumberOfGwsList = [];
    for (let i = 0; i < totalNumberOfGws; i++) {
        totalNumberOfGwsList.push(i + 1);
    }

    console.log(currentSorted, categories)

    return <>
        <DefaultPageContainer pageClassName='player-ownership-container' heading={props.content.Statistics.PlayerStatistics?.title + " - " + store.getState().league_type} description={props.content.Statistics.PlayerStatistics?.title}>
        <h1>{props.content.Statistics.PlayerStatistics?.title}</h1>
        { !firstLoading && <>
            <form className="form-stuff player-stats text-center">
            <div className='box-1'>
                <label>{props.content.General.view}</label>
                <select onChange={(e) => filterOnPositionAndTeam(sorting_keyword_teams, e.target.value, query)} className="input-box" id="sort_players_dropdown" name="sort_players">
                    <option selected={sorting_keyword_positions == "All"} value="All">{props.content.General.all_positions}</option>
                    <option selected={sorting_keyword_positions == "Goalkeepers"} value="Goalkeepers">{props.content.General.goalkeeper}</option>
                    <option selected={sorting_keyword_positions == "Defenders"} value="Defenders">{props.content.General.defenders}</option>
                    <option selected={sorting_keyword_positions == "Midfielders"} value="Midfielders">{props.content.General.midfielders}</option>
                    <option selected={sorting_keyword_positions == "Forwards"} value="Forwards">{props.content.General.forwards}</option>
                </select>
            </div>
            
            <div className='box-2'>
                <label>{props.content.Fixture.team}</label>
                <select onChange={(e) => filterOnPositionAndTeam(e.target.value, sorting_keyword_positions, query)} className="input-box" id="sort_players_dropdown" name="sort_players">
                    <option selected={sorting_keyword_teams == "All"} value="All">{props.content.General.all_teams}</option>
                    { teamNameAndIds.length > 0 && 
                        teamNameAndIds.map(x => (
                            <option selected={x == sorting_keyword_teams} value={x.id}>{ x.team_name }</option>
                        ))
                    }

                </select>
            </div>
            
            <div className='box-3'>
                { totalNumberOfGwsList.length > 0 && <>
                    <label>{props.content.General.last_x_rounds}</label>
                    <select onChange={(e) => updateOwnershipTopXData(parseInt(e.target.value))} className="input-box" id="sort_on_dropdown" name="sort_on">
                        <option selected={lastXGws == 0} value="0">{props.content.General.total_all_gws}</option>
                        { totalNumberOfGwsList?.length > 0 &&
                            totalNumberOfGwsList.map(x => (
                                <option selected={x == lastXGws} value={x}>
                                    { x == 1 && "Forrige runde"}
                                    { x > 1 && "Snitt siste " + x + " runder"}
                                </option>
                            ))
                        }
                    </select>
                    </>
                }
            </div>

            <div className='box-4'></div>

            <div className='box-5'>
                <label htmlFor='site-search' className='hidden'>Search bar</label>
                <input 
                    onChange={(e) => filterOnPositionAndTeam(sorting_keyword_teams, sorting_keyword_positions, e.target.value)} 
                    placeholder={props.content.Statistics.PlayerOwnership.search_text} 
                    className='input-box' 
                    type="search" 
                    id="site-search" 
                    name="q">
                </input>
            </div>
            </form></>
            }

        { !isLoading && playerStatsDataToShow?.length > 0 && 
            <div className="container-player-stats">
                <table>
                <thead>
                    <tr><>
                        { categories.map( (category, idx) => 
                            <th className={idx == 0 ? 'name-col' : (idx + 1) == categories.length ? 'last-element' : ''}>
                                { idx != 0 ? <TableSortHead text={category} reset={currentSorted != category} defaultSortType={'Increasing'} onclick={(increase: boolean) => sortOwnershipData(category, increase)}/>
                                : category }
                            </th>
                        )}</>
                    </tr>
                </thead>

                <tbody>
                    { playerStatsDataToShow.slice( (pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination).map( (x, index) => 
                    <tr>
                        { categories.map( (category, idx ) => 
                            <td className={ category == "Name" ? "name-col" : '' + (currentSorted == category) ? 'selected' : ''}>
                                <div className={ category == "Name" ? "format-name-col" : ''}>
                                    { category == "Name" ? x[category] : Number(x[category]).toFixed(1) }
                                </div>
                            </td>
                        )}
                    </tr>
                    )}             
                </tbody>
            </table>
        </div>}
        
        { !isLoading && playerStatsDataToShow.length > 0 && 
            <Pagination 
                className="ant-pagination" 
                onChange={(number) => paginationUpdate(number)}
                defaultCurrent={1}   
                total={playerStatsDataToShow.length} />     
        }

        { isLoading && 
            <Spinner />
        }

        </DefaultPageContainer>
    </>
};

export default PlayerStatisticsPage;