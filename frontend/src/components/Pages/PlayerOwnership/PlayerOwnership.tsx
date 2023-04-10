import React, { useState, useEffect, FunctionComponent } from 'react';

import Pagination from 'rc-pagination';
import axios from 'axios';

import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { PlayerOwnershipModel } from '../../../models/playerOwnership/PlayerOwnershipModel';
import { TeamNameAndIdModel } from '../../../models/playerOwnership/TeamNameAndIdModel';
import { ChipUsageModel } from '../../../models/playerOwnership/ChipUsageModel';
import { TableSortHead } from '../../Shared/TableSortHead/TableSortHead';
import { Spinner } from '../../Shared/Spinner/Spinner';
import Popover from '../../Shared/Popover/Popover';
import '../../Shared/Pagination/Pagination.scss';
import { store } from '../../../store/index';
import './PlayerOwnership.scss';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type LanguageProps = {
    content: any;
    league_type: string;
    top_x_managers_default: number;
}

export const PlayerOwnership : FunctionComponent<LanguageProps> = (props) => {
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
    const [ topXPlayers, setTopXPlayers ] = useState(props.top_x_managers_default);
    const [ topXPlayersList, setTopXPlayersList ] = useState([]);
    
    const [ chipData, setChipData ] = useState([-1, -1, -1, -1, -1, -1, -1]);
    const [ chipDataAll, setChipDataAll ] = useState(emptyChipModelAll);

    const [ totalChipUsage, setTotalChipUsage ] = useState([-1, -1, -1, -1, -1, -1, -1]);
    const [ totalChipUsageAll, setTotalChipUsageAll ] = useState(emptyChipModelAll);

    const [ query, setQuery ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);
    const [ emptyDataMessage, setEmptyDataMessage ] = useState("");

    const  [ firstLoading, setFirstLoading ] = useState(true);
    
    function getOwnershipDataForGW(data: any, gw: number) {
        if (gw == 1) return data.gw_1;
        if (gw == 2) return data.gw_2;
        if (gw == 3) return data.gw_3;
        if (gw == 4) return data.gw_4;
        if (gw == 5) return data.gw_5;
        if (gw == 6) return data.gw_6;
        if (gw == 7) return data.gw_7;
        if (gw == 8) return data.gw_8;
        if (gw == 9) return data.gw_9;
        if (gw == 10) return data.gw_10;
        if (gw == 11) return data.gw_11;
        if (gw == 12) return data.gw_12;
        if (gw == 13) return data.gw_13;
        if (gw == 14) return data.gw_14;
        if (gw == 15) return data.gw_15;
        if (gw == 16) return data.gw_16;
        if (gw == 17) return data.gw_17;
        if (gw == 18) return data.gw_18;
        if (gw == 19) return data.gw_19;
        if (gw == 20) return data.gw_20;
        if (gw == 21) return data.gw_21;
        if (gw == 22) return data.gw_22;
        if (gw == 23) return data.gw_23;
        if (gw == 24) return data.gw_24;
        if (gw == 25) return data.gw_25;
        if (gw == 26) return data.gw_26;
        if (gw == 27) return data.gw_27;
        if (gw == 28) return data.gw_28;
        if (gw == 29) return data.gw_29;
        if (gw == 30) return data.gw_30;
        if (gw == 31) return data.gw_31;
        if (gw == 32) return data.gw_32;
        if (gw == 33) return data.gw_33;
        if (gw == 34) return data.gw_34;
        if (gw == 35) return data.gw_35;
        if (gw == 36) return data.gw_36;
        if (gw == 37) return data.gw_37;
        if (gw == 38) return data.gw_38;
        return []
    }

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
            let ownershipdata = getOwnershipDataForGW(data_parsed, gw);
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
            let ownershipdata = getOwnershipDataForGW(data_parsed, gw);
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

    function compare( a: any, b: any ) {
        if ( a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 > b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3){
          return -1;
        }
        if ( a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 < b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3){
          return 1;
        }

        return 0;
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

    const propComparator = (prop:number, increasing: boolean) =>
    (a:PlayerOwnershipModel, b:PlayerOwnershipModel) => {
        if (prop == 0) {
            if (a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 > b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3) {
                return increasing ? -1 : 1;
            }
            if (a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 < b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3) {
                return increasing ? 1 : -1;
            }
            return 0;
        }
        else {
            if ( a.ownership[prop] > b.ownership[prop]){
                return increasing ? -1 : 1;
            }
            if (a.ownership[prop] < b.ownership[prop]){
                return increasing ? 1 : -1;
            }
            return 0;
        }
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
        heading={props.content.Statistics.PlayerOwnership.title + " - " + store.getState().league_type} 
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
            Data hentes ut fra de 100, 1000 og 5000 beste ESF-managerne hver runde rett etter byttefrist. 
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

                    <option selected={sorting_keyword == "Goalkeepers"} value="Goalkeepers">{props.content.General.goalkeeper}</option>
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
            <table className='stat-table'>
            <thead>
                <tr>
                    <th className="name-col">{props.content.Statistics.PlayerOwnership.player}</th>
                    <th><TableSortHead popover_title='Effective Ownership' popover_text='Effektivt eierskap er en beregning som tar hensyn til managere som starter en spiller (ikke bare de som eier dem), sammen med de som kapteiner spilleren. Det er altså eierandel som starter spilleren pluss eierandelen som har kapteinet spilleren. ' text={props.content.General.eo} reset={currentSorted != 'EO'} defaultSortType={'Increasing'} onclick={(increase: boolean) => sortOwnershipData(0, increase)}/></th>
                    <th><TableSortHead popover_title='Valgt av' popover_text='Prosentandel som har denne spilleren i troppen sin (trenger ikke være i startelleveren).' text={props.content.Statistics.PlayerOwnership.owned_by} reset={currentSorted != 'Owned by'} defaultSortType={'Increasing'} onclick={(increase: boolean) => sortOwnershipData(4, increase)}/></th>
                    <th><TableSortHead text={props.content.Statistics.PlayerOwnership.captain} reset={currentSorted != 'Captaincy'} onclick={(increase: boolean) => sortOwnershipData(1, increase)}/></th>
                    { props.league_type == "FPL" && 
                        <th><TableSortHead text={props.content.Statistics.PlayerOwnership.three_captain} reset={currentSorted != '3xC'} onclick={(increase: boolean) => sortOwnershipData(2, increase)}/></th>
                    }
                    <th><TableSortHead text={props.content.Statistics.PlayerOwnership.vice_captain} reset={currentSorted != 'VC'} onclick={(increase: boolean) => sortOwnershipData(3, increase)}/></th>
                    <th><TableSortHead text={props.content.Statistics.PlayerOwnership.benched} reset={currentSorted != 'Benched'} onclick={(increase: boolean) => sortOwnershipData(5, increase)}/></th>
                    <th className='last-element'><TableSortHead popover_title={props.content.Statistics.PlayerOwnership.tot_ownership} popover_text={'Prosentandel blant alle managere som eier denne spilleren. Altså ikke bare blant topp ' + topXPlayers.toString() + ' managere.' } text={props.content.Statistics.PlayerOwnership.tot_ownership} reset={currentSorted != 'Total Ownership'} onclick={(increase: boolean) => sortOwnershipData(6, increase)}/></th>
                </tr>
            </thead>

            <tbody>
                { ownershipDataToShow.slice( (pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination).map( (x, index) => 
                <tr>
                    <td className="name-col"> <div className="format-name-col">{ x.player_name }</div> </td>
                    { x.ownership.length == 0 ? <>
                        <td className={(currentSorted == 'EO') ? 'selected' : ''}>{} {'-'} </td>
                        <td className={(currentSorted == 'Owned by') ? 'selected' : ''}>{  } {'-'} </td>
                        <td className={(currentSorted == 'Captaincy') ? 'selected' : ''}>{  } {'-'} </td>
                        { props.league_type == "FPL" && 
                            <td className={(currentSorted == '3xC') ? 'selected' : ''}>{ } {'-'} </td>
                        }
                        <td className={(currentSorted == 'VC') ? 'selected' : ''}>{ } {'-'} </td>
                        <td className={(currentSorted == 'Benched') ? 'selected' : ''}>{ } {'-'} </td>
                        <td className={(currentSorted == 'Total Ownership') ? 'selected' : ''}>{  } {'-'} </td>
                    
                    </> : 
                    <>
                        <td className={(currentSorted == 'EO') ? 'selected' : ''}>{ ( (x.ownership[0] + x.ownership[1] * 2 + x.ownership[2] * 3) / topXPlayers * 100).toFixed(1) } {'%'} </td>
                        <td className={(currentSorted == 'Owned by') ? 'selected' : ''}>{ (x.ownership[4] / topXPlayers * 100).toFixed(1) } {'%'} </td>
                        <td className={(currentSorted == 'Captaincy') ? 'selected' : ''}>{ (x.ownership[1] / topXPlayers * 100).toFixed(1) } {'%'} </td>
                        { props.league_type == "FPL" && 
                            <td className={(currentSorted == '3xC') ? 'selected' : ''}>{ (x.ownership[2] / topXPlayers * 100).toFixed(1) } {'%'} </td>
                        }
                        <td className={(currentSorted == 'VC') ? 'selected' : ''}>{ (x.ownership[3] / topXPlayers * 100).toFixed(1) } {'%'} </td>
                        <td className={(currentSorted == 'Benched') ? 'selected' : ''}>{ (x.ownership[5] / topXPlayers * 100).toFixed(1) } {'%'} </td>
                        <td className={(currentSorted == 'Total Ownership') ? 'selected' : ''}>{ (x.ownership[6] / 100).toFixed(1) } {'%'} </td>
                    </>
                    }
                </tr>
                )}             
            </tbody>
        </table>
  
        </div>}
        { !isLoading && ownershipDataToShow.length > 0 && 
            <Pagination 
                className="ant-pagination" 
                onChange={(number) => paginationUpdate(number)}
                defaultCurrent={1}   
                total={numberOfHits} />     
        }

        { isLoading && 
            <Spinner />
        }

        { !isLoading && chipData?.length > 5 && chipData[0] != -1 && 
            <div className='chips-section'>
                <table className='chips-table'>
                    <thead>
                        <tr>
                            <th className="name-col-chips">{props.content.Statistics.PlayerOwnership.chip_title} {" "}{props.content.General.round_short}{currentGw}</th>
                            <th>{props.content.Statistics.PlayerOwnership.percent}</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="name-col-chips"> <div className="format-name-col">{props.content.Statistics.PlayerOwnership.no_chip}</div> </td>
                            <td>{(chipData[4] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                        <tr>
                            <td className="name-col-chips"> <div className="format-name-col">{props.content.Statistics.PlayerOwnership.wildcard}</div> </td>
                            <td>{(chipData[3] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                        <tr>
                            <td className="name-col-chips"> <div className="format-name-col">{props.league_type == "Eliteserien" ? props.content.Statistics.PlayerOwnership.rich_uncle : props.content.Statistics.PlayerOwnership.free_hit}</div> </td>
                            <td>{(chipData[0] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                        <tr>
                            <td className="name-col-chips"> <div className="format-name-col">{props.league_type == "Eliteserien" ? props.content.Statistics.PlayerOwnership.forward_rush: props.content.Statistics.PlayerOwnership.bench_boost}</div> </td>
                            <td>{(chipData[1] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                        <tr>
                            <td className="name-col-chips"> <div className="format-name-col">{props.league_type == "Eliteserien" ? props.content.Statistics.PlayerOwnership.two_captain : props.content.Statistics.PlayerOwnership.three_captain}</div> </td>
                            <td>{(chipData[2] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                    </tbody>
                </table>

                { totalChipUsage != null && totalChipUsage.length > 3 &&
                    <table className='chips-table'>
                        <thead>
                            <tr>
                                <th className="name-col-chips-2">{props.content.Statistics.PlayerOwnership.chip_total_usage_title}</th>
                                <th>{props.content.Statistics.PlayerOwnership.percent}</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="name-col-chips-2"> <div className="format-name-col">{props.content.Statistics.PlayerOwnership.wildcard}{" nr. 1"}</div> </td>
                                <td>{(totalChipUsage[0] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                            </tr>
                            <tr>
                                <td className="name-col-chips-2"> <div className="format-name-col">{props.content.Statistics.PlayerOwnership.wildcard}{" nr. 2"}</div> </td>
                                <td>{(totalChipUsage[1] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                            </tr>
                            <tr>
                                <td className="name-col-chips-2"> <div className="format-name-col">{props.league_type == "Eliteserien" ? props.content.Statistics.PlayerOwnership.rich_uncle : props.content.Statistics.PlayerOwnership.free_hit}</div> </td>
                                <td>{(totalChipUsage[2] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                            </tr>
                            <tr>
                                <td className="name-col-chips-2"> <div className="format-name-col">{props.league_type == "Eliteserien" ? props.content.Statistics.PlayerOwnership.forward_rush : props.content.Statistics.PlayerOwnership.bench_boost}</div> </td>
                                <td>{(totalChipUsage[props.league_type == "Eliteserien" ? 3 : 4] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                            </tr>
                            <tr>
                                <td className="name-col-chips-2"> <div className="format-name-col">{props.league_type == "Eliteserien" ? props.content.Statistics.PlayerOwnership.two_captain : props.content.Statistics.PlayerOwnership.three_captain}</div> </td>
                                <td>{(totalChipUsage[props.league_type == "Eliteserien" ? 4 : 3] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                            </tr>
                        </tbody>
                    </table>
                }

                <table className='team-info-table'>
                    <thead>
                        <tr>
                            <th className="team-info">{props.content.Statistics.PlayerOwnership.team_info}</th>
                            <th>{props.content.Statistics.PlayerOwnership.value}</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="team-info"> <div className="format-name-col">{props.content.Statistics.PlayerOwnership.avg_team_value}</div> </td>
                            <td>{(chipData[5]  / 10).toFixed(1)}</td>
                        </tr>
                        <tr>
                            <td className="team-info"> <div className="format-name-col">{props.content.Statistics.PlayerOwnership.avg_transfers}</div> </td>
                            <td>{(chipData[6] / 10).toFixed(1)}</td>
                        </tr>
                        <tr>
                            <td className="team-info"> <div className="format-name-col">{props.content.Statistics.PlayerOwnership.avg_transfer_cost}</div> </td>
                            <td>{"-"}{(chipData[7] / 10).toFixed(1)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        }
    </DefaultPageContainer>
    </>
};

export default PlayerOwnership;
