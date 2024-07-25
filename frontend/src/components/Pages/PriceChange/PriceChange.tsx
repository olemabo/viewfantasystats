import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import Table, { TableBody, TableCell, TableHead, TableRow } from '../../Shared/Table/Table';
import { Increasing, TableSortHead } from '../../Shared/TableSortHead/TableSortHead';
import { PageProps, fpl } from '../../../models/shared/PageProps';
import  { useState, FunctionComponent } from 'react';
import { Pagination } from '../../Shared/Pagination/Pagination';
import Message from '../../Shared/Messages/Messages';
import Popover from '../../Shared/Popover/Popover';
import '../PlayerOwnership/PlayerOwnership.scss';
import { defaultFormValueAllSelected } from '../../../constants/formValue';
import usePriceChange from '../../../hooks/usePriceChange';
import { sortAndFilterPriceChange } from './sortAndFilter';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

export const PriceChange : FunctionComponent<PageProps> = (props) => {
    const [ sortingTeamId, setSortingTeamId ] = useState(defaultFormValueAllSelected);
    const [ sortingPositionId, setSortingPositionId ] = useState(defaultFormValueAllSelected);

    const [ query, setQuery ] = useState<string>("");
    const [ sortType, setSortType ] = useState<string>("NetTransfers");
    const [ decreasing, setDecreasing ] = useState<boolean>(true);

    const  { isLoading, 
        errorLoading, 
        priceChange,
        teamNameAndIds
     } = usePriceChange(props.leagueType, props.languageContent);

    const priceChangeSorted =  sortAndFilterPriceChange(priceChange, query, sortingTeamId, sortingPositionId, sortType, decreasing);
    
    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const numberOfHitsPerPagination = 15;
    
    const sortPriceChangeData = (sortType: string, increase: boolean) => {
        setSortType(sortType);
        setDecreasing(increase);
        setCurrentSorted(sortType);
    };

    const [ currentSorted, setCurrentSorted ] = useState("NetTransfers");

    return <>
    <DefaultPageContainer 
        pageClassName='player-ownership-container'
        leagueType={props.leagueType}
        heading={props.languageContent.Statistics.PriceChange.title} 
        description={'Se eierandelen av ulike spillere fra Eliteserien blant topp 100, 1000 og 5000 managere i Eliteserien Fantasy. Siden viser statistikk rundt EO (Effective Ownership), eierandel, kaptein, visekaptein, benket og total eierandel, samt chips bruk og laginformasjon. Data hentes ut blant topp 100, 1000 og 5000 rett etter byttefrist hver runde. '}
        isLoading={isLoading}
        errorLoading={errorLoading}
        renderTitle={() => <h1>
            {props.languageContent.Statistics.PriceChange.title}
            <Popover 
                id={"rotations-planner-id"}
                alignLeft={true}
                popoverTitle={props.languageContent.Statistics.PriceChange.title} 
                iconSize={14}
                iconPosition={[-10, 0, 0, 3]}
            >
                { props.leagueType === fpl ? props.languageContent.LongTexts.priceChangeDescription : props.languageContent.LongTexts.priceChangeDescription }
            </Popover>
        </h1>}
    >
        <form className="form-stuff player-stats text-center">
                <div className='box-1'>
                    <label>{props.languageContent.General.view}</label>
                    <select 
                        onChange={(e) => setSortingPositionId(e.target.value)} 
                        className="input-box" 
                        id="sort_players_dropdown" 
                        name="sort_players"
                    >
                        <option key={defaultFormValueAllSelected} selected={sortingPositionId == defaultFormValueAllSelected} value={defaultFormValueAllSelected}>{props.languageContent.General.all_positions}</option>
                        <option key="Goalkeepers" selected={sortingPositionId == "Goalkeepers"} value="Goalkeepers">{props.languageContent.General.goalkeepers}</option>
                        <option key="Defenders" selected={sortingPositionId == "Defenders"} value="Defenders">{props.languageContent.General.defenders}</option>
                        <option key="Midfielders" selected={sortingPositionId == "Midfielders"} value="Midfielders">{props.languageContent.General.midfielders}</option>
                        <option key="Forwards" selected={sortingPositionId == "Forwards"} value="Forwards">{props.languageContent.General.forwards}</option>
                    </select>
                </div>
                
                <div className='box-2'>
                    <label>{props.languageContent.Fixture.team}</label>
                    <select 
                        onChange={(e) => setSortingTeamId(e.target.value)} 
                        className="input-box" 
                        id="sort_players_dropdown" 
                        name="sort_players"
                    >
                        <option selected={sortingTeamId == defaultFormValueAllSelected} value={defaultFormValueAllSelected}>{props.languageContent.General.all_teams}</option>
                        {teamNameAndIds.length > 0 && teamNameAndIds.map(x => (
                            <option key={x.team_id} selected={x.team_name === sortingTeamId} value={x.team_id}>{x.team_name}</option>
                        ))}
                    </select>
                </div>
                
                <div className='box-3'>
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

        {priceChangeSorted?.length > 0 && 
        <div className="container-player-stats">
            <Table tableLayoutType={props.leagueType} className='stat-table'>
                <TableHead>
                    <TableRow>
                        <TableCell cellType='head' minWidth={144}>
                            {props.languageContent.General.player}
                        </TableCell>
                        <TableCell cellType='head' minWidth={80}>
                            <TableSortHead
                                text={props.languageContent.Statistics.PriceChange.status}
                                popover_title={props.languageContent.Statistics.PriceChange.status}
                                popover_text={props.languageContent.Statistics.PriceChange.Popover.status}
                                reset={currentSorted != 'Status'}
                                onclick={(increase: boolean) => sortPriceChangeData('Status', increase)}
                            />
                        </TableCell>
                        <TableCell cellType='head' minWidth={90}>
                            <TableSortHead
                                text={props.languageContent.Statistics.PriceChange.price} 
                                popover_title={props.languageContent.Statistics.PriceChange.price}
                                popover_text={props.languageContent.Statistics.PriceChange.Popover.price}
                                reset={currentSorted != 'Price'}
                                onclick={(increase: boolean) => sortPriceChangeData('Price', increase)}
                            />
                        </TableCell>
                        <TableCell cellType='head'minWidth={105}>
                            <TableSortHead
                                text={props.languageContent.Statistics.PriceChange.percentage} 
                                popover_title={props.languageContent.Statistics.PriceChange.percentage}
                                popover_text={props.languageContent.Statistics.PriceChange.Popover.ownership}
                                reset={currentSorted != 'Percentage'}
                                onclick={(increase: boolean) => sortPriceChangeData('Percentage', increase)}
                            />
                        </TableCell>
                        <TableCell cellType='head'>
                            <TableSortHead
                                text={props.languageContent.Statistics.PriceChange.cost_change_event}
                                popover_title={props.languageContent.Statistics.PriceChange.cost_change_event}
                                popover_text={props.languageContent.Statistics.PriceChange.Popover.pricechange}
                                reset={currentSorted != 'Change'}
                                onclick={(increase: boolean) => sortPriceChangeData('Change', increase)}
                            />
                        </TableCell>
                        <TableCell cellType='head' minWidth={145}>
                            <TableSortHead
                                text={props.languageContent.Statistics.PriceChange.nettransfer}
                                popover_title={props.languageContent.Statistics.PriceChange.nettransfer}
                                popover_text={props.languageContent.Statistics.PriceChange.Popover.nettransfers}
                                reset={currentSorted != 'NetTransfers'}
                                defaultSortType={Increasing}
                                onclick={(increase: boolean) => sortPriceChangeData('NetTransfers', increase)}
                            />
                        </TableCell>
                        <TableCell cellType='head' minWidth={105} className='last-element'>
                            <TableSortHead
                                text={props.languageContent.Statistics.PriceChange.transfers_in}
                                popover_title={props.languageContent.Statistics.PriceChange.transfers_in}
                                popover_text={props.languageContent.Statistics.PriceChange.Popover.transfersin}
                                reset={currentSorted != 'TransfersIn'}
                                onclick={(increase: boolean) => sortPriceChangeData('TransfersIn', increase)}
                            />
                        </TableCell>
                        <TableCell cellType='head'minWidth={120} className='last-element'>
                            <TableSortHead
                                text={props.languageContent.Statistics.PriceChange.transfers_out}
                                popover_title={props.languageContent.Statistics.PriceChange.transfers_out}
                                popover_text={props.languageContent.Statistics.PriceChange.Popover.transfersout}
                                reset={currentSorted != 'TransfersOut'}
                                onclick={(increase: boolean) => sortPriceChangeData('TransfersOut', increase)}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {priceChangeSorted
                        .slice((pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination)
                        .map((player, index) => 
                    <TableRow key={`ownership-key-${index}`}>
                        <TableCell cellType='data' minWidth={144}><div>{player.web_name}</div> </TableCell>
                        <TableCell cellType='data' minWidth={80} className={(currentSorted == 'Status') ? 'selected' : ''}>{player.status.toUpperCase()}</TableCell>
                        <TableCell cellType='data' minWidth={90} className={(currentSorted == 'Price') ? 'selected' : ''}>{(player.now_cost / 10).toFixed(1)}</TableCell>
                        <TableCell cellType='data' minWidth={105} className={(currentSorted == 'Percentage') ? 'selected' : ''}>{player.selected_by_percent}</TableCell>
                        <TableCell cellType='data' className={(currentSorted == 'Change') ? 'selected' : ''}>{(player.cost_change_event / 10).toFixed(1)}</TableCell>
                        <TableCell cellType='data' minWidth={145} className={(currentSorted == 'NetTransfers') ? 'selected' : ''}>{
                            <>{(player.transfers_in_event - player.transfers_out_event).toFixed(0)}
                            { (player.transfers_in_event - player.transfers_out_event) === 0 ? <></> : (player.transfers_in_event - player.transfers_out_event) > 0 ? 
                            <ExpandLess style={{position: 'relative', top: '3px', left: '5px'}} color='success' fontSize={'inherit'} /> :
                            <ExpandMore style={{position: 'relative', top: '3px', left: '5px'}} color='error' fontSize={'inherit'} />
                            }                           
                            </>
                        }</TableCell>
                        <TableCell cellType='data' minWidth={105} className={(currentSorted == 'TransfersIn') ? 'selected' : ''}>{(player.transfers_in_event).toFixed(0)} </TableCell>
                        <TableCell cellType='data' minWidth={120} className={(currentSorted == 'TransfersOut') ? 'selected' : ''}>{(player.transfers_out_event).toFixed(0)} </TableCell>
                    </TableRow>
                    )}             
                </TableBody>
            </Table>
        </div>}
        
        {priceChangeSorted.length === 0 && query &&
            <Message messageType='info' messageText={props.languageContent.General?.noHitsMessage}/>
        }

        { priceChangeSorted.length > 0 && 
            <Pagination 
                className="ant-pagination" 
                onChange={(number) => setPaginationNumber(number)}
                defaultCurrent={1}   
                total={priceChangeSorted.length} 
            />     
        }
    </DefaultPageContainer>
    </>
};

export default PriceChange;
