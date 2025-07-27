import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../Shared/Table/Table';
import { useState, FunctionComponent } from 'react';
import TableSortHead from '../../Shared/TableSortHead/TableSortHead';
import { PageProps } from '../../../models/shared/PageProps';
import Pagination from 'rc-pagination';
import usePlayerStatistics from '../../../hooks/usePlayerStatistics';
import { sortAndFilterPlayerStatistics } from './sortAndFilter';
import { convertCategoryToName, getMinWidth } from './playerStatisticsUtils';
import Message from '../../Shared/Messages/Messages';
import { fpl } from '../../../models/shared/PageProps';
import { defaultFormValueAllSelected } from '../../../constants/formValue';

export const PlayerStatisticsPage : FunctionComponent<PageProps> = (props) => {
    const [ sortingPositionId, setSortingPositionId ] = useState(defaultFormValueAllSelected);
    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const [ sortingTeamId, setSortingTeamId ] = useState(defaultFormValueAllSelected);
    const [ lastXGws, setLastXGws ] = useState(0);
    
    const [ query, setQuery ] = useState<string>("");
    const [ sortIndex, setSortIndex ] = useState<number>(0);
    const [ decreasing, setDecreasing ] = useState<boolean>(true);
    
    const numberOfHitsPerPagination = 15;

    const { isLoading, playerStats, errorLoading } = usePlayerStatistics(props, lastXGws);

    const { categories, teamNameAndIds, playerStatistics, totalNumberOfGws } = playerStats;
    
    const playerStatisticsFiltered = sortAndFilterPlayerStatistics(playerStatistics, query, sortingTeamId, sortingPositionId, sortIndex, decreasing);

    const totalNumberOfGwsList = Array.from({ length: totalNumberOfGws }, (_, i) => i + 1);

    return <>
        <DefaultPageContainer 
            leagueType={props.leagueType} 
            pageClassName='player-ownership-container' 
            heading={`${props.languageContent.Statistics.PlayerStatistics?.title} - ${props.leagueType === fpl ? "Premier League" : "Eliteserien"}`} 
            description={ props.languageContent.Statistics.PlayerStatistics?.title }
            pageTitle={props.languageContent.Statistics.PlayerStatistics?.title}
            isLoading={isLoading}
            errorLoading={errorLoading}
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
                    { totalNumberOfGwsList.length > 0 && <>
                        <label>{props.languageContent.General.last_x_rounds}</label>
                        <select 
                            onChange={(e) => { 
                                setLastXGws(parseInt(e.target.value));
                                setSortingTeamId(defaultFormValueAllSelected);
                            }} 
                            className="input-box" 
                            id="sort_on_dropdown" 
                            name="sort_on"
                        >
                            <option key="First" selected={lastXGws == 0} value="0">{props.languageContent.General.total_all_gws}</option>
                            {totalNumberOfGwsList.map(x => (
                                <option key={x} selected={x === lastXGws} value={x}>
                                    {x === 1 ? "Forrige runde" : `Snitt siste ${x} runder`}
                                </option>
                            ))}
                        </select>
                        </>
                    }
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

            { playerStatisticsFiltered?.length > 0 ? (
                <>
                    <div className="container-player-stats">
                        <Table tableLayoutType={props.leagueType}>
                            <TableHead>
                                <TableRow>
                                    <>
                                        <TableCell
                                            tableKey={'head'}
                                            cellType='head' 
                                            minWidth={getMinWidth('Name', lastXGws, props.leagueType, categories)} 
                                            className={'name-col'}>
                                            { props.languageContent.General.name }
                                        </TableCell>
                                        { categories.map((category, idx) => 
                                            <TableCell
                                                tableKey={idx.toString()}
                                                cellType='head' 
                                                minWidth={getMinWidth(categories[idx], lastXGws, props.leagueType, categories)} 
                                                className={(idx + 1) === categories.length ? 'last-element' : ''}
                                            >
                                                <TableSortHead 
                                                    text={convertCategoryToName(category, props.languageContent)} 
                                                    reset={sortIndex != idx} 
                                                    defaultSortType={'Increasing'} 
                                                    onclick={(increase: boolean) => { 
                                                        setSortIndex(idx);
                                                        setDecreasing(increase);
                                                    }}
                                                />
                                            </TableCell>
                                        )} 
                                    </>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {playerStatisticsFiltered
                                    .slice((pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination)
                                    .map(player_stat => 
                                        <TableRow>
                                            <TableCell
                                                tableKey={'head-inner'}
                                                cellType='data' 
                                                minWidth={getMinWidth('Name', lastXGws, props.leagueType, categories)} 
                                                className={`name-col ${sortIndex === 0 ? 'selected' : ''}`}
                                            >
                                                <div className='format-name-col'>
                                                    {player_stat.Name}
                                                </div>
                                            </TableCell>
                                            { player_stat?.player_statistics_list.map((stat, index) => 
                                                <TableCell
                                                    tableKey={`inner-${index.toString()}`}
                                                    cellType='data' 
                                                    minWidth={getMinWidth(categories[index], lastXGws, props.leagueType, categories)} 
                                                    className={`${sortIndex === index ? 'selected' : ''}`}
                                                    >
                                                    <div>
                                                        { Number(stat).toFixed(['Mins'].includes(categories[index]) ? 0 : 1) }
                                                    </div>
                                                </TableCell>
                                                
                                            )}
                                        </TableRow>
                                )}             
                            </TableBody>
                        </Table>
                    </div>
                    <Pagination 
                        className="ant-pagination" 
                        onChange={(number) => setPaginationNumber(number)}
                        defaultCurrent={1}
                        pageSize={numberOfHitsPerPagination}   
                        total={playerStatisticsFiltered.length} 
                    />     
                </> 
            ) : <>
                { query && 
                    <Message messageType='info' messageText={props.languageContent.General?.noHitsMessage}/>
                }
            </>
            }
        </DefaultPageContainer>
    </>
};

export default PlayerStatisticsPage;