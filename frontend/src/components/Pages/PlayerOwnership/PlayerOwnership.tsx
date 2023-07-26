import React, { useState, useEffect, FunctionComponent } from 'react';

import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { PlayerOwnershipModel } from '../../../models/playerOwnership/PlayerOwnershipModel';
import Table, { TableBody, TableCell, TableHead, TableRow } from '../../Shared/Table/Table';
import { TeamNameAndIdModel } from '../../../models/playerOwnership/TeamNameAndIdModel';
import { ChipUsageModel } from '../../../models/playerOwnership/ChipUsageModel';
import { getObjectDataFromKeys } from '../../../utils/getObjectDataFromKeys';
import { compare, propComparator } from '../../../utils/compareFunctions';
import { TableSortHead } from '../../Shared/TableSortHead/TableSortHead';
import { PageProps, esf, fpl } from '../../../models/shared/PageProps';
import { Pagination } from '../../Shared/Pagination/Pagination';
import { Spinner } from '../../Shared/Spinner/Spinner';
import Popover from '../../Shared/Popover/Popover';
import { store } from '../../../store/index';
import './PlayerOwnership.scss';
import axios from 'axios';


export const PlayerOwnership : FunctionComponent<PageProps> = (props) => {
    const player_ownership_api_path = "/statistics/player-ownership-api/";
    const emptyOwnershipData: PlayerOwnershipModel[] = [];
    const emptyAvailableGws: any[] = []
    const emptyChipModel: ChipUsageModel = {gw: -1, chip_data: [-1, -1, -1, -1, -1, -1, -1], total_chip_usage: [-1, -1, -1, -1, -1, -1]}
    const emptyChipModelAll: ChipUsageModel[] = [{gw: -1, chip_data: [-1, -1, -1, -1, -1, -1, -1], total_chip_usage: [-1, -1, -1, -1, -1, -1]}]
    const [ allOwnershipData, setAllOwnershipData ] = useState([]);
    const [ ownershipData, setOwnershipData ] = useState(emptyOwnershipData);
    const [ ownershipDataToShow, setOwnershipDataToShow ] = useState(emptyOwnershipData);
    const [ availableGws, setAvailableGws ] = useState(emptyAvailableGws);
    const [ currentGw, setCurrentGw ] = useState(0);
    const [ sorting_keyword, setSorting_keyword ] = useState("All");
    const [ teamNameAndIds, setTeamNameAndIds ] = useState(emptyAvailableGws);
    const [ topXPlayers, setTopXPlayers ] = useState(props.top_x_managers_default ?? 10000);
    const [ topXPlayersList, setTopXPlayersList ] = useState([]);
    
    const [ chipData, setChipData ] = useState([-1, -1, -1, -1, -1, -1, -1]);
    const [ chipDataAll, setChipDataAll ] = useState(emptyChipModelAll);

    const [ totalChipUsage, setTotalChipUsage ] = useState([-1, -1, -1, -1, -1, -1, -1]);
    const [ totalChipUsageAll, setTotalChipUsageAll ] = useState(emptyChipModelAll);

    const [ query, setQuery ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);
    const [ emptyDataMessage, setEmptyDataMessage ] = useState("");

    const  [ firstLoading, setFirstLoading ] = useState(true);

    const total_number_of_gws = 38;
    const gwKeys = Object.fromEntries(Array.from({ length: total_number_of_gws }, (_, i) => [i + 1, `gw_${i + 1}` ]));

    useEffect(() => {
        store.dispatch({type: "league_type", payload: props.league_type});
        setIsLoading(true);

        axios.get(player_ownership_api_path + "?league_name=" + props.league_type).then(x => {  
            if (x?.data?.length === 0) {
                setEmptyDataMessage("Fant ingen data for årets sesong")
                setIsLoading(false);
            }
            let data = JSON.parse(x?.data);
            data?.chip_data?.map((x: ChipUsageModel) => {
                if (x.gw == data.newest_updated_gw) {
                    setChipData(x.chip_data);
                    setTotalChipUsage(x.total_chip_usage);
                }
            })
            setTopXPlayersList(data?.top_x_managers_list);
            setChipDataAll(data?.chip_data);
            UpdateTeamNameAndIds(data.team_names_and_ids);
            setAllOwnershipData(data.ownershipdata)
            setAvailableGws(data?.available_gws);
            initOwnershipData(data, data.newest_updated_gw);
            setCurrentGw(data.newest_updated_gw);
            setFirstLoading(false);
            setIsLoading(false);
        })

    }, [props.league_type]);

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

    function initOwnershipData(data: any, gw: number) {
        let tempOwnershipModel: PlayerOwnershipModel[] = []     
        data?.ownershipdata.map( (y: any) => {
            let data_parsed = JSON.parse(y);
            let ownershipdata = getObjectDataFromKeys(data_parsed, gw, gwKeys);
            tempOwnershipModel.push({
                player_name: data_parsed.player_name,
                player_postition_id: data_parsed.player_position_id,
                player_team_id: data_parsed.player_team_id,
                ownership: ownershipdata,
                filter_out: false
            });
        })
        setNumberOfHits(tempOwnershipModel.length);
        setOwnershipData(tempOwnershipModel.sort(compare));
        if (sorting_keyword != "All" || query != "") {
            filterOnPositionAndTeam(sorting_keyword, query, tempOwnershipModel.sort(compare));
        }
        else {
            setOwnershipDataToShow(tempOwnershipModel.sort(compare));
        }
    }

    function updateOwnershipTopXData(top_x_players: number) {
        var body = {
            top_x_players: top_x_players,
            current_gw: currentGw,
            league_name: props.league_type,
        };
        setIsLoading(true);
        axios.post(player_ownership_api_path, body).then(x => {  
            let data = JSON.parse(x?.data);

            data?.chip_data?.map((x: ChipUsageModel) => {
                if (x.gw == data.newest_updated_gw) {
                    setChipData(x.chip_data);
                    setTotalChipUsage(x.total_chip_usage);
                }
            })
            setTopXPlayersList(data?.top_x_managers_list);
            setChipDataAll(data?.chip_data);
            setTotalChipUsageAll(data?.total_chip_usage);
            setAllOwnershipData(data.ownershipdata);
            initOwnershipData(data, data.newest_updated_gw);
            setIsLoading(false);
        })
        setPaginationNumber(1);
        setCurrentSorted("EO");
        setTopXPlayers(top_x_players);
    }

    function updateOwnershipData(gw: number) {
        if (allOwnershipData == null|| allOwnershipData?.length < 1) return 0;
        let tempOwnershipModel: PlayerOwnershipModel[] = []     
        allOwnershipData.map( (y: any) => {
            let data_parsed = JSON.parse(y);
            let ownershipdata = getObjectDataFromKeys(data_parsed, gw, gwKeys);
            tempOwnershipModel.push({
                player_name: data_parsed.player_name,
                player_postition_id: data_parsed.player_position_id,
                player_team_id: data_parsed.player_team_id,
                ownership: ownershipdata,
                filter_out: false,
            });
        })
        chipDataAll.map(x => {
            if (x.gw == gw) {
                setChipData(x.chip_data);
                setTotalChipUsage(x.total_chip_usage);
            }
        })
        setCurrentGw(gw);
        setCurrentSorted('EO');
        setOwnershipDataToShow(tempOwnershipModel.sort(compare))
        setOwnershipData(tempOwnershipModel.sort(compare));
        filterOnPositionAndTeam(sorting_keyword, query, tempOwnershipModel.sort(compare));
    }

    function filterOnPositionAndTeam(keyword: string, query: string, data?: PlayerOwnershipModel[]) {
        let temp: PlayerOwnershipModel[] = data != null ? data : ownershipData;    

        let queryFilteredList: PlayerOwnershipModel[] = [];
        
        temp.map(x => {
            if (query != "" && !x.player_name.toLowerCase().includes(query.toLowerCase())) {
                
            }
            else {
                queryFilteredList.push(x);
            }
        })

        if (keyword == "Goalkeepers") {
            queryFilteredList = queryFilteredList.filter(function (el) {
                return el.player_postition_id == "1";
            });
        }
        else if (keyword == "Defenders") {
            queryFilteredList = queryFilteredList.filter(function (el) {
                return el.player_postition_id == "2";
            });
        }
        else if (keyword == "Midfielders") {
            queryFilteredList = queryFilteredList.filter(function (el) {
                return el.player_postition_id == "3";
            });
        }
        else if (keyword == "Forwards") {
            queryFilteredList = queryFilteredList.filter(function (el) {
                return el.player_postition_id == "4";
            });
        }
        else {
            teamNameAndIds.map(x => {
                if (x.team_name == keyword) {
                    queryFilteredList = queryFilteredList.filter(function (el) {
                        return el.player_team_id == x.team_id;
                    });
                }
            })
        }
        
        setOwnershipDataToShow(queryFilteredList);
        setSorting_keyword(keyword);
        setQuery(query);
        setNumberOfHits(queryFilteredList.length)
    }
    
    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const [ numberOfHitsPerPagination, setNumberOfHitsPerPagination ] = useState(10);
    const [ numberOfHits, setNumberOfHits ] = useState(0);

    function paginationUpdate(pageNumber: number) {
        setPaginationNumber(pageNumber);
    }
    
    function sortOwnershipData(sortType: number, increase: boolean) {
        let temp = [...ownershipDataToShow];
        let sorted = temp.sort(propComparator(sortType, increase));
        setOwnershipDataToShow(sorted);
        if (sortType == 0) { setCurrentSorted('EO')}
        if (sortType == 1) { setCurrentSorted('Captaincy')}
        if (sortType == 2) { setCurrentSorted('3xC')}
        if (sortType == 3) { setCurrentSorted('VC')}
        if (sortType == 4) { setCurrentSorted('Owned by')}
        if (sortType == 5) { setCurrentSorted('Benched')}
        if (sortType == 6) { setCurrentSorted('Total Ownership')}
    }

    const [ currentSorted, setCurrentSorted ] = useState("EO");

    return <>
    <DefaultPageContainer 
        pageClassName='player-ownership-container' 
        heading={props.content.Statistics.PlayerOwnership.title + " - " + (store.getState().league_type === "fpl" ? "Premier League" : "Eliteserien")} 
        description={'Se eierandelen av ulike spillere fra Eliteserien blant topp 100, 1000 og 5000 managere i Eliteserien Fantasy. Siden viser statistikk rundt EO (Effective Ownership), eierandel, kaptein, visekaptein, benket og total eierandel, samt chips bruk og laginformasjon. Data hentes ut blant topp 100, 1000 og 5000 rett etter byttefrist hver runde. '}>
        <h1>{props.content.Statistics.PlayerOwnership.title}
        <Popover 
            id={"rotations-planner-id"}
            title=""
            algin_left={true}
            popover_title={props.content.Statistics.PlayerOwnership.title} 
            iconSize={14}
            iconpostition={[-10, 0, 0, 3]}
            popover_text=''>
            Data hentes ut fra de 100, 1000 og 5000 beste ESF-managerne hver runde rett etter byttefrist. Normalt blir dette lagt ut ca. 50 minutter etter først kampstart. Statistikk om chipsbruk og laginfo gjelder også kun for topp 100, 1000 og 5000 (ikke alle i hele spillet).
        </Popover>
        </h1>
        { emptyDataMessage && <>
            <div className='info-box'>
            <p>{emptyDataMessage}</p></div>
        </>}
        { !firstLoading && <>
            <form className="form-stuff text-center">
            <div className='box-1'>
                <label>{props.content.General.view}</label>
                <select onChange={(e) => filterOnPositionAndTeam(e.target.value, query)} className="input-box" id="sort_players_dropdown" name="sort_players">
                    <option selected={sorting_keyword == "All"} value="All">{props.content.General.all_players}</option>

                    <option disabled style={{fontWeight: 900}}>{props.content.General.by_position}</option>

                    <option selected={sorting_keyword == "Goalkeepers"} value="Goalkeepers">{props.content.General.goalkeepers}</option>
                    <option selected={sorting_keyword == "Defenders"} value="Defenders">{props.content.General.defenders}</option>
                    <option selected={sorting_keyword == "Midfielders"} value="Midfielders">{props.content.General.midfielders}</option>
                    <option selected={sorting_keyword == "Forwards"} value="Forwards">{props.content.General.forwards}</option>

                    <option disabled style={{fontWeight: 900}}>{props.content.General.by_team}</option>

                    { teamNameAndIds.length > 0 && 
                        teamNameAndIds.map(x => (
                            <option selected={x == sorting_keyword} value={x.id}>{ x.team_name }</option>
                        ))
                    }

                </select>
            </div>
            
            <div className='box-2'>
                { topXPlayersList.length > 0 && 
                <>
                    <label>{props.content.General.top_x_managers}</label>
                    <select onChange={(e) => updateOwnershipTopXData(parseInt(e.target.value))} className="input-box" id="sort_on_dropdown" name="sort_on">
                    { topXPlayersList?.length > 0 &&
                        topXPlayersList.map(x => (
                            <option selected={x == topXPlayers} value={x}>{x}</option>
                        ))
                    }
                    </select>
                    </>
                }
            </div>
            
            <div className='box-3'>
                <label>{props.content.General.gw}</label>
                <select onChange={(e) => updateOwnershipData(parseInt(e.target.value))} className="input-box" id="last_x_dropdown" name="last_x">
                    { availableGws?.length > 0 && 
                        availableGws.map(x => (
                            <option selected={x == currentGw} value={x}>{ x }</option>
                        ))
                    }
                </select>
            </div>

            <div className='box-4'></div>

            <div className='box-5'>
                <label htmlFor='site-search' className='hidden'>Search bar</label>
                <input onChange={(e) => filterOnPositionAndTeam(sorting_keyword, e.target.value)} placeholder={props.content.Statistics.PlayerOwnership.search_text} className='input-box' type="search" id="site-search" name="q"></input>
            </div>
        </form></>
        }

        { !isLoading && ownershipDataToShow?.length > 0 && 
        <div className="container-player-stats">
            <Table tableLayoutType={props.league_type} className='stat-table'>
                <TableHead>
                    <TableRow>
                        <TableCell cellType='head' minWidth={139}>{props.content.Statistics.PlayerOwnership.player}</TableCell>
                        <TableCell cellType='head'><TableSortHead popover_title='Effective Ownership' popover_text='Effektivt eierskap er en beregning som tar hensyn til managere som starter en spiller (ikke bare de som eier dem), sammen med de som kapteiner spilleren. Det er altså eierandel som starter spilleren pluss eierandelen som har kapteinet spilleren. ' text={props.content.General.eo} reset={currentSorted != 'EO'} defaultSortType={'Increasing'} onclick={(increase: boolean) => sortOwnershipData(0, increase)}/></TableCell>
                        <TableCell cellType='head'><TableSortHead popover_title='Valgt av' popover_text='Prosentandel som har denne spilleren i troppen sin (trenger ikke være i startelleveren).' text={props.content.Statistics.PlayerOwnership.owned_by} reset={currentSorted != 'Owned by'} defaultSortType={'Increasing'} onclick={(increase: boolean) => sortOwnershipData(4, increase)}/></TableCell>
                        <TableCell cellType='head'><TableSortHead text={props.content.Statistics.PlayerOwnership.captain} reset={currentSorted != 'Captaincy'} onclick={(increase: boolean) => sortOwnershipData(1, increase)}/></TableCell>
                        { props.league_type === fpl && 
                            <TableCell cellType='head'><TableSortHead text={props.content.Statistics.PlayerOwnership.three_captain} reset={currentSorted != '3xC'} onclick={(increase: boolean) => sortOwnershipData(2, increase)}/></TableCell>
                        }
                        <TableCell cellType='head'><TableSortHead text={props.content.Statistics.PlayerOwnership.vice_captain} reset={currentSorted != 'VC'} onclick={(increase: boolean) => sortOwnershipData(3, increase)}/></TableCell>
                        <TableCell cellType='head'><TableSortHead text={props.content.Statistics.PlayerOwnership.benched} reset={currentSorted != 'Benched'} onclick={(increase: boolean) => sortOwnershipData(5, increase)}/></TableCell>
                        <TableCell cellType='head' className='last-element'><TableSortHead popover_title={props.content.Statistics.PlayerOwnership.tot_ownership} popover_text={'Prosentandel blant alle managere som eier denne spilleren (tall hentet ved rundestart). Altså ikke bare blant topp ' + topXPlayers.toString() + ' managere.' } text={props.content.Statistics.PlayerOwnership.tot_ownership} reset={currentSorted != 'Total Ownership'} onclick={(increase: boolean) => sortOwnershipData(6, increase)}/></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    { ownershipDataToShow.slice( (pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination).map( (x, index) => 
                    <TableRow>
                        <TableCell cellType='data' minWidth={139}> <div>{ x.player_name }</div> </TableCell>
                        { x.ownership.length == 0 ? <>
                            <TableCell cellType='data' className={(currentSorted == 'EO') ? 'selected' : ''}>{} {'-'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Owned by') ? 'selected' : ''}>{  } {'-'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Captaincy') ? 'selected' : ''}>{  } {'-'} </TableCell>
                            { props.league_type === fpl && 
                                <TableCell cellType='data' className={(currentSorted == '3xC') ? 'selected' : ''}>{ } {'-'} </TableCell>
                            }
                            <TableCell cellType='data' className={(currentSorted == 'VC') ? 'selected' : ''}>{ } {'-'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Benched') ? 'selected' : ''}>{ } {'-'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Total Ownership') ? 'selected' : ''}>{  } {'-'} </TableCell>
                        
                        </> : 
                        <>
                            <TableCell cellType='data' className={(currentSorted == 'EO') ? 'selected' : ''}>{ ( (x.ownership[0] + x.ownership[1] * 2 + x.ownership[2] * 3) / topXPlayers * 100).toFixed(1) } {'%'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Owned by') ? 'selected' : ''}>{ (x.ownership[4] / topXPlayers * 100).toFixed(1) } {'%'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Captaincy') ? 'selected' : ''}>{ (x.ownership[1] / topXPlayers * 100).toFixed(1) } {'%'} </TableCell>
                            { props.league_type === fpl && 
                                <TableCell cellType='data' className={(currentSorted == '3xC') ? 'selected' : ''}>{ (x.ownership[2] / topXPlayers * 100).toFixed(1) } {'%'} </TableCell>
                            }
                            <TableCell cellType='data' className={(currentSorted == 'VC') ? 'selected' : ''}>{ (x.ownership[3] / topXPlayers * 100).toFixed(1) } {'%'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Benched') ? 'selected' : ''}>{ (x.ownership[5] / topXPlayers * 100).toFixed(1) } {'%'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Total Ownership') ? 'selected' : ''}>{ (x.ownership[6] / 100).toFixed(1) } {'%'} </TableCell>
                        </>
                        }
                    </TableRow>
                    )}             
                </TableBody>
            </Table>
  
        </div>}
        { !isLoading && ownershipDataToShow.length > 0 && 
            <Pagination 
                className="ant-pagination" 
                onChange={(number) => paginationUpdate(number)}
                defaultCurrent={1}   
                total={numberOfHits} />     
        }

        { isLoading &&  <Spinner /> }

        { !isLoading && chipData?.length > 5 && chipData[0] != -1 && 
            <div className='chips-section'>
                <Table tableLayoutType={props.league_type} className='chips-table'>
                    <TableHead>
                        <TableRow>
                            <TableCell cellType='head' minWidth={145}>{props.content.Statistics.PlayerOwnership.chip_title} {" "}{props.content.General.round_short}{currentGw}</TableCell>
                            <TableCell cellType='head'>{props.content.Statistics.PlayerOwnership.percent}</TableCell>
                            {/* <TableCell cellType='head'>{props.content.Statistics.PlayerOwnership.percent}</TableCell> */}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <TableRow>
                            <TableCell cellType='data' minWidth={145}><div>{props.content.Statistics.PlayerOwnership.no_chip}</div> </TableCell>
                            <TableCell cellType='data'>{(chipData[4] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            {/* <TableCell cellType='data'>{(chipData[4] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                        </TableRow>
                        <TableRow>
                            <TableCell cellType='data' minWidth={145}><div>{props.content.Statistics.PlayerOwnership.wildcard}</div> </TableCell>
                            <TableCell cellType='data'>{(chipData[3] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            {/* <TableCell cellType='data'>{(chipData[3] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                        </TableRow>
                        <TableRow>
                            <TableCell cellType='data' minWidth={145}><div>{props.league_type === esf ? props.content.Statistics.PlayerOwnership.rich_uncle : props.content.Statistics.PlayerOwnership.free_hit}</div> </TableCell>
                            <TableCell cellType='data'>{(chipData[0] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            {/* <TableCell cellType='data'>{(chipData[0] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                        </TableRow>
                        <TableRow>
                            <TableCell cellType='data' minWidth={145}><div>{props.league_type === esf ? props.content.Statistics.PlayerOwnership.forward_rush: props.content.Statistics.PlayerOwnership.bench_boost}</div> </TableCell>
                            <TableCell cellType='data'>{(chipData[1] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            {/* <TableCell cellType='data'>{(chipData[1] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                        </TableRow>
                        <TableRow>
                            <TableCell cellType='data' minWidth={145}><div>{props.league_type === esf ? props.content.Statistics.PlayerOwnership.two_captain : props.content.Statistics.PlayerOwnership.three_captain}</div> </TableCell>
                            <TableCell cellType='data'>{(chipData[2] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            {/* <TableCell cellType='data'>{(chipData[2] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                        </TableRow>
                    </TableBody>
                </Table>

                { totalChipUsage != null && totalChipUsage.length > 3 &&
                    <Table tableLayoutType={props.league_type} className='chips-table'>
                        <TableHead>
                            <TableRow>
                                <TableCell cellType='head' minWidth={145}>{props.content.Statistics.PlayerOwnership.chip_total_usage_title}</TableCell>
                                <TableCell cellType='head'>{props.content.Statistics.PlayerOwnership.percent}</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <TableRow>
                                <TableCell cellType='data' minWidth={145}><div>{props.content.Statistics.PlayerOwnership.wildcard}{" nr. 1"}</div> </TableCell>
                                <TableCell cellType='data'>{(totalChipUsage[0] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={145}><div>{props.content.Statistics.PlayerOwnership.wildcard}{" nr. 2"}</div> </TableCell>
                                <TableCell cellType='data'>{(totalChipUsage[1] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={145}><div>{props.league_type === esf ? props.content.Statistics.PlayerOwnership.rich_uncle : props.content.Statistics.PlayerOwnership.free_hit}</div> </TableCell>
                                <TableCell cellType='data'>{(totalChipUsage[2] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={145}><div>{props.league_type === esf ? props.content.Statistics.PlayerOwnership.forward_rush : props.content.Statistics.PlayerOwnership.bench_boost}</div> </TableCell>
                                <TableCell cellType='data'>{(totalChipUsage[props.league_type === esf ? 3 : 4] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={145}><div>{props.league_type === esf ? props.content.Statistics.PlayerOwnership.two_captain : props.content.Statistics.PlayerOwnership.three_captain}</div> </TableCell>
                                <TableCell cellType='data'>{(totalChipUsage[props.league_type === esf ? 4 : 3] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                }

                <Table tableLayoutType={props.league_type} className='team-info-table'>
                    <TableHead>
                        <TableRow>
                            <TableCell cellType='head' minWidth={170}>{props.content.Statistics.PlayerOwnership.team_info}</TableCell>
                            <TableCell cellType='head'>{props.content.Statistics.PlayerOwnership.value}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell cellType='data' minWidth={170}><div>{props.content.Statistics.PlayerOwnership.avg_team_value}</div> </TableCell>
                            <TableCell cellType='data'>{(chipData[5]  / 10).toFixed(1)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell cellType='data' minWidth={170}><div>{props.content.Statistics.PlayerOwnership.avg_transfers}</div> </TableCell>
                            <TableCell cellType='data'>{(chipData[6] / 10).toFixed(1)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell cellType='data' minWidth={170}><div>{props.content.Statistics.PlayerOwnership.avg_transfer_cost}</div> </TableCell>
                            <TableCell cellType='data'>{"-"}{(chipData[7] / 10).toFixed(1)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        }
    </DefaultPageContainer>
    </>
};

export default PlayerOwnership;
