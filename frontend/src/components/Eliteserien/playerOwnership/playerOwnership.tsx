import TableSortHead from './../../Shared/TableSortHead/TableSortHead';
import React, { useState, useEffect } from 'react';
import store from '../../../store/index';
import Pagination from 'rc-pagination';
import './playerOwnership.scss';
import axios from 'axios';
import { Spinner } from '../../Shared/Spinner/Spinner';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

interface PlayerOwnershipModel {
    player_name: string;
    player_postition_id: string;
    player_team_id: string;
    ownership: number[];
    filter_out: boolean;
}

interface TeamNameAndIdModel {
    team_name: string;
    team_id: string;
}

interface ChipModel {
    gw: number;
    chip_data: number[];
}

export const PlayerOwnership = () => {
    const player_ownership_api_path = "/statistics/player-ownership-api/";
    const emptyOwnershipData: PlayerOwnershipModel[] = [];
    const emptyAvailableGws: any[] = []
    const emptyChipModel: ChipModel = {gw: -1, chip_data: [-1, -1, -1, -1, -1, -1, -1]}
    const emptyChipModelAll: ChipModel[] = [{gw: -1, chip_data: [-1, -1, -1, -1, -1, -1, -1]}]
    const [ allOwnershipData, setAllOwnershipData ] = useState([]);
    const [ ownershipData, setOwnershipData ] = useState(emptyOwnershipData);
    const [ ownershipDataToShow, setOwnershipDataToShow ] = useState(emptyOwnershipData);
    const [ availableGws, setAvailableGws ] = useState(emptyAvailableGws);
    const [ currentGw, setCurrentGw ] = useState(0);
    const [ sorting_keyword, setSorting_keyword ] = useState("All");
    const [ teamNameAndIds, setTeamNameAndIds ] = useState(emptyAvailableGws);
    const [ topXPlayers, setTopXPlayers ] = useState(1000);
    const [ chipData, setChipData ] = useState([-1, -1, -1, -1, -1, -1, -1]);
    const [ chipDataAll, setChipDataAll ] = useState(emptyChipModelAll);
    const [ query, setQuery ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);

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
        return []
    }

    useEffect(() => {
        if (store.getState()?.league_type != "Eliteserien") {
            store.dispatch({type: "league_type", payload: "Eliteserien"});
        }

        axios.get(player_ownership_api_path).then(x => {  
            let data = JSON.parse(x?.data);
            data?.chip_data?.map((x: ChipModel) => {
                if (x.gw == data.newest_updated_gw) {
                    setChipData(x.chip_data);
                }
            })
            setChipDataAll(data?.chip_data);
            UpdateTeamNameAndIds(data.team_names_and_ids);
            setAllOwnershipData(data.ownershipdata)
            setAvailableGws(data?.available_gws);
            initOwnershipData(data, data.newest_updated_gw);
            setCurrentGw(data.newest_updated_gw);
        })

    }, []);

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
        };
        setIsLoading(true);
        axios.post(player_ownership_api_path, body).then(x => {  
            let data = JSON.parse(x?.data);
            data?.chip_data?.map((x: ChipModel) => {
                if (x.gw == data.newest_updated_gw) {
                    setChipData(x.chip_data);
                }
            })
            setChipDataAll(data?.chip_data);
            setAllOwnershipData(data.ownershipdata);
            initOwnershipData(data, data.newest_updated_gw);
            setIsLoading(false);
        })
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
            }
        })
        setCurrentSorted('EO');
        setOwnershipDataToShow(tempOwnershipModel.sort(compare))
    }

    function compare( a: any, b: any ) {
        if ( a.ownership[0] + a.ownership[1] * 2 > b.ownership[0] + b.ownership[1] * 2 ){
          return -1;
        }
        if ( a.ownership[0] + a.ownership[1] * 2 < b.ownership[0] + b.ownership[1] * 2){
          return 1;
        }
        return 0;
    }

    function filterOnPositionAndTeam(keyword: string, query: string, data?: PlayerOwnershipModel[]) {
        let temp = data != null ? data : ownershipData;
        
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
            if (a.ownership[0] + a.ownership[1] * 2 > b.ownership[0] + b.ownership[1] * 2) {
                return increasing ? -1 : 1;
            }
            if (a.ownership[0] + a.ownership[1] * 2 < b.ownership[0] + b.ownership[1] * 2) {
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
        if (sortType == 3) { setCurrentSorted('VC')}
        if (sortType == 5) { setCurrentSorted('Benched')}
        if (sortType == 6) { setCurrentSorted('Total Ownership')}
    }

    const [ currentSorted, setCurrentSorted ] = useState("EO");

    console.log(ownershipDataToShow[0], ownershipData[0], topXPlayers, sorting_keyword)

    return <>
     <div className='player-ownership-container' id="rotation-planner-container">
         <h1>Player Ownership</h1>
        <form className="form-stuff text-center">
            <div className='box-1'>
                <label>View</label>
                <select onChange={(e) => filterOnPositionAndTeam(e.target.value, query)} className="input-box" id="sort_players_dropdown" name="sort_players">
                    <option selected={sorting_keyword == "All"} value="All">All Players</option>

                    <option disabled style={{fontWeight: 900}}>By Position</option>

                    <option selected={sorting_keyword == "Goalkeepers"} value="Goalkeepers">Goalkeepers</option>
                    <option selected={sorting_keyword == "Defenders"} value="Defenders">Defenders</option>
                    <option selected={sorting_keyword == "Midfielders"} value="Midfielders">Midfielders</option>
                    <option selected={sorting_keyword == "Forwards"} value="Forwards">Forwards</option>

                    <option disabled style={{fontWeight: 900}}>By Team</option>

                    { teamNameAndIds.length > 0 && 
                        teamNameAndIds.map(x => (
                            <option selected={x == sorting_keyword} value={x.id}>{ x.team_name }</option>
                        ))
                    }

                </select>
            </div>
            
            <div className='box-2'>
                <label>Top 'x' managers</label>
                <select onChange={(e) => updateOwnershipTopXData(parseInt(e.target.value))} className="input-box" id="sort_on_dropdown" name="sort_on">
                    <option value="100">100</option>
                    <option selected value="1000">1000</option>
                    <option value="5000">5000</option>
                </select>
            </div>
            
            <div className='box-3'>
                <label>GW</label>
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
                <label className='hidden'>Search bar</label>
                <input onChange={(e) => filterOnPositionAndTeam(sorting_keyword, e.target.value)} placeholder='Search..' className='input-box' type="search" id="site-search" name="q"></input>
            </div>

        </form>

        { !isLoading && ownershipDataToShow?.length > 0 && 
        <div className="container-player-stats">
            <table>
            <thead>
                <tr>
                    <th className="name-col">Player</th>
                    <th><TableSortHead text='EO' reset={currentSorted != 'EO'} defaultSortType={'Increasing'} onclick={(increase: boolean) => sortOwnershipData(0, increase)}/></th>
                    <th><TableSortHead text='Captaincy' reset={currentSorted != 'Captaincy'} onclick={(increase: boolean) => sortOwnershipData(1, increase)}/></th>
                    <th><TableSortHead text='VC' reset={currentSorted != 'VC'} onclick={(increase: boolean) => sortOwnershipData(3, increase)}/></th>
                    <th><TableSortHead text='Benched' reset={currentSorted != 'Benched'} onclick={(increase: boolean) => sortOwnershipData(5, increase)}/></th>
                    <th><TableSortHead text='Total Ownership' reset={currentSorted != 'Total Ownership'} onclick={(increase: boolean) => sortOwnershipData(6, increase)}/></th>
                </tr>
            </thead>

            <tbody>
                { ownershipDataToShow.slice( (pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination).map( (x, index) => 
                <tr>
                    <td className="name-col"> <div className="format-name-col">{ x.player_name }</div> </td>
                    <td className={(currentSorted == 'EO') ? 'selected' : ''}>{ ( (x.ownership[0] + x.ownership[1] * 2) / topXPlayers * 100).toFixed(1) } {'%'} </td>
                    <td className={(currentSorted == 'Captaincy') ? 'selected' : ''}>{ (x.ownership[1] / topXPlayers * 100).toFixed(1) } {'%'} </td>
                    <td className={(currentSorted == 'VC') ? 'selected' : ''}>{ (x.ownership[3] / topXPlayers * 100).toFixed(1) } {'%'} </td>
                    <td className={(currentSorted == 'Benched') ? 'selected' : ''}>{ (x.ownership[5] / topXPlayers * 100).toFixed(1) } {'%'} </td>
                    <td className={(currentSorted == 'Total Ownership') ? 'selected' : ''}>{ (x.ownership[6] / 100).toFixed(1) } {'%'} </td>
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

        { chipData?.length > 5 && chipData[0] != -1 && 
            <div className='chips-section'>
                <table className='chips-table'>
                    <thead>
                        <tr>
                            <th className="name-col">Chip</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="name-col"> <div className="format-name-col">Ingen Chips</div> </td>
                            <td>{(chipData[4] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                        <tr>
                            <td className="name-col"> <div className="format-name-col">Wildcard</div> </td>
                            <td>{(chipData[3] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                        <tr>
                            <td className="name-col"> <div className="format-name-col">Rik Onkel</div> </td>
                            <td>{(chipData[0] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                        <tr>
                            <td className="name-col"> <div className="format-name-col">Spiss Rush</div> </td>
                            <td>{(chipData[1] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                        <tr>
                            <td className="name-col"> <div className="format-name-col">2 Kapteiner</div> </td>
                            <td>{(chipData[2] / topXPlayers * 100).toFixed(1)} {'%'}</td>
                        </tr>
                    </tbody>
                </table>

                <table className='team-info-table'>
                    <thead>
                        <tr>
                            <th className="name-col">Team Info</th>
                            <th>Value</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="name-col"> <div className="format-name-col">Avg. Team Value</div> </td>
                            <td>{(chipData[5]  / 10).toFixed(1)}</td>
                        </tr>
                        <tr>
                            <td className="name-col"> <div className="format-name-col">Avg. Transfers</div> </td>
                            <td>{(chipData[6] / 10).toFixed(1)}</td>
                        </tr>
                        <tr>
                            <td className="name-col"> <div className="format-name-col">Avg. Transfer Cost</div> </td>
                            <td>{"-"}{(chipData[7] / 10).toFixed(1)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        }
     </div>  </>

};

export default PlayerOwnership;
