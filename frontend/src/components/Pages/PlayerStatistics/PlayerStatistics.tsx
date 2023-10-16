import { PlayerStatisticsModel, CategoryTypes } from '../../../models/playerStatistics/PlayerStatisticsModel';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../Shared/Table/Table';
import { TeamNameAndIdModel } from '../../../models/playerOwnership/TeamNameAndIdModel';
import React, { useState, useEffect, FunctionComponent } from 'react';
import TableSortHead from '../../Shared/TableSortHead/TableSortHead';
import { PageProps, esf } from '../../../models/shared/PageProps';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { store } from '../../../store/index';
import Pagination from 'rc-pagination';
import axios from 'axios';


export const PlayerStatisticsPage : FunctionComponent<PageProps> = (props) => {
    const player_statistics_api_path = "/statistics/player-statistics-api/";
    const emptyAvailableGws: any[] = []

    const emptyOwnershipData: PlayerStatisticsModel[] = [];

    const [ firstLoading, setFirstLoading ] = useState(true);
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
    const numberOfHitsPerPagination = 15;

    const [ categories, setCategories ] = useState([]);
    const [ currentSorted, setCurrentSorted ] = useState(0);
    
    useEffect(() => {
        store.dispatch({type: "league_type", payload: props.league_type});
        console.log(player_statistics_api_path + "?league_name=" + props.league_type);
        axios.get(player_statistics_api_path + "?league_name=" + props.league_type).then(x => {  
            let data = JSON.parse(x?.data);
            setTotalNumberOfGws(data.total_number_of_gws);
        })

        var body = {
            league_name: props.league_type,
            last_x_gw: lastXGws,
        };

        axios.post(player_statistics_api_path, body).then(x => {  
            let data = JSON.parse(x?.data);
            setFirstLoading(false);
            setCategories(data?.categories);
            UpdateTeamNameAndIds(data.team_names_and_ids);
            setPlayerStatsData(data?.player_info);
            setPlayerStatsDataToShow(data?.player_info);
            setCurrentSorted(0);
        })

    }, []);

    function updateOwnershipTopXData(last_x_gws: number) {
        setIsLoading(true);

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
            setIsLoading(false);
        });

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
        setCurrentSorted(0);
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
    
    function sortOwnershipData(index: number, increase: boolean) {
        let temp = [...playerStatsDataToShow];
        let sorted = temp.sort(propComparator(index, increase));
        setPlayerStatsDataToShow(sorted);
        setCurrentSorted(index);
    }

    const propComparator = (index:number, increasing: boolean) =>
    (a:PlayerStatisticsModel, b:PlayerStatisticsModel) => {
        let first_value = a.player_statistics_list[index];
        let second_value = b.player_statistics_list[index];
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

    const getMinWidth = (category: string) => {
        if (category === "Name") return 140;
        if (category === "Yellow Cards") return 120;
        if (category === "Red Cards") return 110;
        if (category === "Opta") return 88;
        if (category === "Bps") return 80;
        if (category === "Assists") return 90;
        if (category === "Goals") return 90;
        if (lastXGws === 0 || props.league_type === esf) return 100;

        return (1000 / categories.length);
    }

    const convertCategoryToName = (category: string) => {
        if (category == "Points") return props.content.General.points;
        if (category == "Goals") return props.content.General.goal;
        if (category == "Yellow Cards") return props.content.General.yellow_cards;
        if (category == "Red Cards") return props.content.General.red_cards;
        return category;
    }

    return <>
        <DefaultPageContainer pageClassName='player-ownership-container' heading={props.content.Statistics.PlayerStatistics?.title + " - " + (store.getState().league_type === "fpl" ? "Premier League" : "Eliteserien")} description={ props.content.Statistics.PlayerStatistics?.title }>
        <h1>{props.content.Statistics.PlayerStatistics?.title}</h1>
        { !firstLoading && <>
            <form className="form-stuff player-stats text-center">
            <div className='box-1'>
                <label>{props.content.General.view}</label>
                <select onChange={(e) => filterOnPositionAndTeam(sorting_keyword_teams, e.target.value, query)} className="input-box" id="sort_players_dropdown" name="sort_players">
                    <option selected={sorting_keyword_positions == "All"} value="All">{props.content.General.all_positions}</option>
                    <option selected={sorting_keyword_positions == "Goalkeepers"} value="Goalkeepers">{props.content.General.goalkeepers}</option>
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
                <Table tableLayoutType={props.league_type}>
                    <TableHead>
                        <TableRow><>
                            <TableCell cellType='head' minWidth={getMinWidth('Name')} className={'name-col'}>
                                { props.content.General.name }
                            </TableCell>
                            { categories.map( (category, idx) => 
                                <TableCell cellType='head' minWidth={getMinWidth(categories[idx])} className={(idx + 1) == categories.length ? 'last-element' : ''}>
                                    <TableSortHead text={convertCategoryToName(category)} reset={currentSorted != idx} defaultSortType={'Increasing'} onclick={(increase: boolean) => sortOwnershipData(idx, increase)}/>
                                </TableCell>
                            )}</>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { playerStatsDataToShow.slice( (pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination).map(player_stat => 
                        <TableRow>
                            <TableCell cellType='data' minWidth={getMinWidth('Name')} className={"name-col" + (currentSorted === 0) ? 'selected' : ''}>
                                <div className='format-name-col'>
                                    {player_stat.Name}
                                </div>
                            </TableCell>
                            { player_stat?.player_statistics_list.map( (stat, index) => 
                                <TableCell cellType='data' minWidth={getMinWidth(categories[index])} className={(currentSorted === categories[index]) ? 'selected' : ''}>
                                    <div>
                                        { Number(stat).toFixed(['Mins'].includes(categories[index]) ? 0 : 1) }
                                    </div>
                                </TableCell>
                                
                            )}
                        </TableRow>
                        )}             
                    </TableBody>
                </Table>
            </div> }
        { !isLoading && playerStatsDataToShow?.length > 0 && 
            <Pagination 
                className="ant-pagination" 
                onChange={(number) => setPaginationNumber(number)}
                defaultCurrent={1}
                pageSize={numberOfHitsPerPagination}   
                total={playerStatsDataToShow.length} />     
        }

        { isLoading && <Spinner /> }

        </DefaultPageContainer>
    </>
};

export default PlayerStatisticsPage;