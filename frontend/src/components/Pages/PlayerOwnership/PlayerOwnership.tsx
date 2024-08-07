import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import Table, { TableBody, TableCell, TableHead, TableRow } from '../../Shared/Table/Table';
import { TableSortHead } from '../../Shared/TableSortHead/TableSortHead';
import { PageProps, esf, fpl } from '../../../models/shared/PageProps';
import  { useState, FunctionComponent } from 'react';
import { Pagination } from '../../Shared/Pagination/Pagination';
import Message from '../../Shared/Messages/Messages';
import Popover from '../../Shared/Popover/Popover';
import './PlayerOwnership.scss';
import usePlayerOwnership from '../../../hooks/usePlayerOwnership';
import { sortAndFilterPlayerOwnership } from './sortAndFilter';
import { defaultFormValueAllSelected } from '../../../constants/formValue';

export const PlayerOwnership : FunctionComponent<PageProps> = (props) => {
    const [ currentGw, setCurrentGw ] = useState(0);
    const [ sortingKeyword, setSortingKeyword ] = useState(defaultFormValueAllSelected);
    const [ topXPlayers, setTopXPlayers ] = useState(props.topXManagersDefault ?? 10000);

    const [ query, setQuery ] = useState<string>("");
    const [ sortIndex, setSortIndex ] = useState<number>(0);
    const [ decreasing, setDecreasing ] = useState<boolean>(true);

    const  { isLoading, 
        errorLoading, 
        chipData,
        allOwnershipData, 
        ownershipMetaData, 
     } = usePlayerOwnership(props.leagueType, currentGw, topXPlayers, props.languageContent);

    const { chipUsageRound, chipUsageTotal } = chipData;
    const { updatingGw, updatingPrecentage, topXPlayersList, availableGws, currentGW, teamNameAndIds } = ownershipMetaData;

    const ownershipSorted = sortAndFilterPlayerOwnership(allOwnershipData, teamNameAndIds, query, sortingKeyword, sortIndex, decreasing);
    
    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const numberOfHitsPerPagination = 10;
    
    const sortOwnershipData = (sortType: number, increase: boolean) => {
        setSortIndex(sortType);
        setDecreasing(increase);
        setCurrentSorted(sortTypeToString(sortType));
    };

    const sortTypeToString = (sortType: number) => {
        const sortStrings = [
            'EO', 'Captaincy', '3xC', 'VC', 'Owned by', 'Benched', 'Total Ownership'
        ];
        return sortStrings[sortType];
    };

    const [ currentSorted, setCurrentSorted ] = useState("EO");

    const chipsRoundTableWidth = 145;
    const chipsAllRoundsTableWidth = 175;
    const chipsTeamInfoTableWidthCol1 = 180;
    const chipsTeamInfoTableWidthCol2 = 80;

    return <>
    <DefaultPageContainer 
        pageClassName='player-ownership-container'
        leagueType={props.leagueType}
        heading={props.languageContent.Statistics.PlayerOwnership.title} 
        description={'Se eierandelen av ulike spillere fra Eliteserien blant topp 100, 1000 og 5000 managere i Eliteserien Fantasy. Siden viser statistikk rundt EO (Effective Ownership), eierandel, kaptein, visekaptein, benket og total eierandel, samt chips bruk og laginformasjon. Data hentes ut blant topp 100, 1000 og 5000 rett etter byttefrist hver runde. '}
        isLoading={isLoading}
        errorLoading={errorLoading}
        renderTitle={() => <h1>
            {props.languageContent.Statistics.PlayerOwnership.title}
            <Popover 
                id={"rotations-planner-id"}
                alignLeft={true}
                popoverTitle={props.languageContent.Statistics.PlayerOwnership.title} 
                iconSize={14}
                iconPosition={[-10, 0, 0, 3]}
            >
                { props.leagueType === fpl ? props.languageContent.LongTexts.ownershiptDescriptionFPL : props.languageContent.LongTexts.ownershiptDescription }
            </Popover>
        </h1>}
    >
        { updatingPrecentage > 0 && updatingGw > 0 && 
            <Message showCross={true} messageType='info' messageText={props.languageContent.Statistics.PlayerOwnership.is_updating_message
                ?.replace("__PERCENTAGE__", updatingPrecentage?.toFixed(0)?.toString())
                ?.replace("__GW__", updatingGw?.toString()) } />
        }

        <form className="form-stuff text-center">
            <div className='box-1'>
                <label>{props.languageContent.General.view}</label>
                <select 
                    onChange={(e) => setSortingKeyword(e.target.value)}
                    defaultValue={sortingKeyword}
                    className="input-box" 
                    id="sort_players_dropdown"
                    name="sort_players"
                >
                    <option value="All">{props.languageContent.General.all_players}</option>

                    <option disabled style={{fontWeight: 900}}>{props.languageContent.General.by_position}</option>

                    <option value="Goalkeepers">{props.languageContent.General.goalkeepers}</option>
                    <option value="Defenders">{props.languageContent.General.defenders}</option>
                    <option value="Midfielders">{props.languageContent.General.midfielders}</option>
                    <option value="Forwards">{props.languageContent.General.forwards}</option>

                    <option disabled style={{fontWeight: 900}}>{props.languageContent.General.by_team}</option>

                    { teamNameAndIds.map(x => (
                        <option key={x.team_name} value={x.team_id}>{ x.team_name }</option>
                    ))}

                </select>
            </div>
            
            <div className='box-2'>
                { topXPlayersList.length > 0 && <>
                    <label>{props.languageContent.General.top_x_managers}</label>
                    <select 
                        onChange={(e) => {
                            setTopXPlayers(parseInt(e.target.value))
                            setPaginationNumber(1)
                        }}
                        defaultValue={topXPlayers}
                        className="input-box" 
                        id="sort_on_dropdown"
                        name="sort_on"
                    >
                        { topXPlayersList.map(x => (
                            <option key={x} value={x}>{x}</option>
                        ))}
                    </select>
                </>
                }
            </div>
            
            <div className='box-3'>
                <label>{props.languageContent.General.gw}</label>
                <select 
                    onChange={(e) => {
                        setCurrentGw(parseInt(e.target.value))
                        setPaginationNumber(1)
                    }} 
                    defaultValue={currentGW}
                    className="input-box" 
                    id="last_x_dropdown" 
                    name="last_x"
                >
                    { availableGws.map(x => (
                        <option key={x} value={x}>{ x }</option>
                    ))}
                </select>
            </div>

            <div className='box-4'></div>

            <div className='box-5'>
                <label htmlFor='site-search' className='hidden'>Search bar</label>
                <input 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder={props.languageContent.Statistics.PlayerOwnership.search_text} 
                    className='input-box' 
                    type="search" 
                    id="site-search" 
                    name="q">
                </input>
            </div>
        </form>

        {ownershipSorted?.length > 0 && 
        <div className="container-player-stats">
            <Table tableLayoutType={props.leagueType} className='stat-table'>
                <TableHead>
                    <TableRow>
                        <TableCell cellType='head' minWidth={139}>{props.languageContent.Statistics.PlayerOwnership.player}</TableCell>
                        <TableCell cellType='head'>
                            <TableSortHead 
                                popover_title='Effective Ownership' 
                                popover_text={props.languageContent.Popover.effectiveOwnership} 
                                text={props.languageContent.General.eo} 
                                reset={currentSorted != 'EO'} 
                                defaultSortType={'Increasing'} 
                                onclick={(increase: boolean) => sortOwnershipData(0, increase)}
                            />
                        </TableCell>
                        <TableCell cellType='head'>
                            <TableSortHead 
                                popover_title={props.languageContent.Statistics.PlayerOwnership.owned_by}
                                popover_text={props.languageContent.Popover.chosenBy}
                                text={props.languageContent.Statistics.PlayerOwnership.owned_by}
                                reset={currentSorted != 'Owned by'}
                                defaultSortType={'Increasing'}
                                onclick={(increase: boolean) => sortOwnershipData(4, increase)}
                            />
                            </TableCell>
                        <TableCell cellType='head'>
                            <TableSortHead
                                popover_title={props.languageContent.Statistics.PlayerOwnership.captain}
                                popover_text={props.languageContent.Popover.captain}
                                text={props.languageContent.Statistics.PlayerOwnership.captain} 
                                reset={currentSorted != 'Captaincy'}
                                onclick={(increase: boolean) => sortOwnershipData(1, increase)}
                            />
                            </TableCell>
                        { props.leagueType === fpl && 
                            <TableCell cellType='head'><TableSortHead text={props.languageContent.Statistics.PlayerOwnership.three_captain} reset={currentSorted != '3xC'} onclick={(increase: boolean) => sortOwnershipData(2, increase)}/></TableCell>
                        }
                        <TableCell cellType='head'>
                            <TableSortHead
                                text={props.languageContent.Statistics.PlayerOwnership.vice_captain}
                                reset={currentSorted != 'VC'}
                                onclick={(increase: boolean) => sortOwnershipData(3, increase)}
                            />
                            </TableCell>
                        <TableCell cellType='head'>
                            <TableSortHead 
                                text={props.languageContent.Statistics.PlayerOwnership.benched}
                                reset={currentSorted != 'Benched'}
                                onclick={(increase: boolean) => sortOwnershipData(5, increase)}
                            />
                            </TableCell>
                        <TableCell cellType='head' className='last-element'>
                            <TableSortHead 
                                popover_title={props.languageContent.Statistics.PlayerOwnership.tot_ownership} 
                                popover_text={props.languageContent.Popover.topOwnership + topXPlayers.toString() + ' ' + props.languageContent.General.managers + '.' } 
                                text={props.languageContent.Statistics.PlayerOwnership.tot_ownership} 
                                reset={currentSorted != 'Total Ownership'} 
                                onclick={(increase: boolean) => sortOwnershipData(6, increase)}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {ownershipSorted
                        .slice((pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination)
                        .map((x, index) => 
                    <TableRow key={`ownership-key-${index}`}>
                        <TableCell cellType='data' minWidth={139}> <div>{ x.player_name }</div> </TableCell>
                        { x.ownership.length == 0 ? <>
                            <TableCell cellType='data' className={(currentSorted == 'EO') ? 'selected' : ''}>{} {'-'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Owned by') ? 'selected' : ''}>{  } {'-'} </TableCell>
                            <TableCell cellType='data' className={(currentSorted == 'Captaincy') ? 'selected' : ''}>{  } {'-'} </TableCell>
                            { props.leagueType === fpl && 
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
                            { props.leagueType === fpl && 
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
        
        {ownershipSorted.length === 0 && query &&
            <Message messageType='info' messageText={props.languageContent.General?.noHitsMessage}/>
        }

        { ownershipSorted.length > 0 && 
            <Pagination 
                className="ant-pagination" 
                onChange={(number) => setPaginationNumber(number)}
                defaultCurrent={1}   
                total={ownershipSorted.length} 
            />     
        }

        { chipUsageRound?.length > 5 && 
            <div className='chips-section'>
                <div>
                    <Table tableLayoutType={props.leagueType} className='chips-table'>
                        <TableHead>
                            <TableRow>
                                <TableCell cellType='head' minWidth={chipsRoundTableWidth}>{props.languageContent.Statistics.PlayerOwnership.chip_title} {" "}{props.languageContent.General.round_short}{currentGW}</TableCell>
                                <TableCell cellType='head'>{props.languageContent.Statistics.PlayerOwnership.percent}</TableCell>
                                {/* <TableCell cellType='head'>{props.languageContent.Statistics.PlayerOwnership.percent}</TableCell> */}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsRoundTableWidth}><div>{props.languageContent.Statistics.PlayerOwnership.no_chip}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageRound[4] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                                {/* <TableCell cellType='data'>{(chipData[4] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsRoundTableWidth}><div>{props.languageContent.Statistics.PlayerOwnership.wildcard}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageRound[3] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                                {/* <TableCell cellType='data'>{(chipData[3] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsRoundTableWidth}><div>{props.leagueType === esf ? props.languageContent.Statistics.PlayerOwnership.rich_uncle : props.languageContent.Statistics.PlayerOwnership.free_hit}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageRound[0] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                                {/* <TableCell cellType='data'>{(chipData[0] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsRoundTableWidth}><div>{props.leagueType === esf ? props.languageContent.Statistics.PlayerOwnership.forward_rush: props.languageContent.Statistics.PlayerOwnership.bench_boost}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageRound[1] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                                {/* <TableCell cellType='data'>{(chipData[1] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsRoundTableWidth}><div>{props.leagueType === esf ? props.languageContent.Statistics.PlayerOwnership.two_captain : props.languageContent.Statistics.PlayerOwnership.three_captain}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageRound[2] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                                {/* <TableCell cellType='data'>{(chipData[2] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell> */}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                { chipUsageTotal && chipUsageTotal.length > 3 &&
                    <div><Table tableLayoutType={props.leagueType} className='chips-table'>
                        <TableHead>
                            <TableRow>
                                <TableCell cellType='head' minWidth={chipsAllRoundsTableWidth}>{props.languageContent.Statistics.PlayerOwnership.chip_total_usage_title}</TableCell>
                                <TableCell cellType='head'>{props.languageContent.Statistics.PlayerOwnership.percent}</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsAllRoundsTableWidth}><div>{props.languageContent.Statistics.PlayerOwnership.wildcard}{" nr. 1"}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageTotal[0] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsAllRoundsTableWidth}><div>{props.languageContent.Statistics.PlayerOwnership.wildcard}{" nr. 2"}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageTotal[1] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsAllRoundsTableWidth}><div>{props.leagueType === esf ? props.languageContent.Statistics.PlayerOwnership.rich_uncle : props.languageContent.Statistics.PlayerOwnership.free_hit}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageTotal[2] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsAllRoundsTableWidth}><div>{props.leagueType === esf ? props.languageContent.Statistics.PlayerOwnership.forward_rush : props.languageContent.Statistics.PlayerOwnership.bench_boost}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageTotal[props.leagueType === esf ? 3 : 4] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell cellType='data' minWidth={chipsAllRoundsTableWidth}><div>{props.leagueType === esf ? props.languageContent.Statistics.PlayerOwnership.two_captain : props.languageContent.Statistics.PlayerOwnership.three_captain}</div> </TableCell>
                                <TableCell cellType='data'>{(chipUsageTotal[props.leagueType === esf ? 4 : 3] / topXPlayers * 100).toFixed(1)} {'%'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table></div>
                }
                <div>
                <Table tableLayoutType={props.leagueType}>
                    <TableHead>
                        <TableRow>
                            <TableCell cellType='head' minWidth={chipsTeamInfoTableWidthCol1}>{props.languageContent.Statistics.PlayerOwnership.team_info}</TableCell>
                            <TableCell cellType='head' minWidth={chipsTeamInfoTableWidthCol2}>{props.languageContent.Statistics.PlayerOwnership.value}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell cellType='data' minWidth={chipsTeamInfoTableWidthCol1}><div>{props.languageContent.Statistics.PlayerOwnership.avg_team_value}</div> </TableCell>
                            <TableCell cellType='data' minWidth={chipsTeamInfoTableWidthCol2}>{(chipUsageRound[5]  / 10).toFixed(1)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell cellType='data' minWidth={chipsTeamInfoTableWidthCol1}><div>{props.languageContent.Statistics.PlayerOwnership.avg_transfers}</div> </TableCell>
                            <TableCell cellType='data' minWidth={chipsTeamInfoTableWidthCol2}>{(chipUsageRound[6] / 10).toFixed(1)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell cellType='data' minWidth={chipsTeamInfoTableWidthCol1}><div>{props.languageContent.Statistics.PlayerOwnership.avg_transfer_cost}</div> </TableCell>
                            <TableCell cellType='data' minWidth={chipsTeamInfoTableWidthCol2}>{"-"}{(chipUsageRound[7] / 10).toFixed(1)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table></div>
            </div>
        }
    </DefaultPageContainer>
    </>
};

export default PlayerOwnership;
