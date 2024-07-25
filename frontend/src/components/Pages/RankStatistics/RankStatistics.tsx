import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../Shared/Table/Table';
import { TableSortHead } from './../../Shared/TableSortHead/TableSortHead';
import useRankStatistics from '../../../hooks/useRankStatistics';
import { Pagination } from '../../Shared/Pagination/Pagination';
import { PageProps } from '../../../models/shared/PageProps';
import { sortAndFilterRankData } from './sortAndFilter';
import { useState, FunctionComponent } from 'react';
import { Link } from '../../Shared/Link/Link';
import './RankStatistics.scss';
import Message from '../../Shared/Messages/Messages';

export const RankStatisticsPage : FunctionComponent<PageProps> = (props) => {
    const [ lastNumberOfYears, setLastNumberOfYears ] = useState(3);
    const { ranks, fantasyManagerUrl, numberOfLastYears, isLoading, errorLoading } = useRankStatistics(lastNumberOfYears, props.languageContent);

    const [ query, setQuery ] = useState<string>("");
    const [ sortType, setSortType ] = useState<string>("Rank");
    const [ decreasing, setDecreasing ] = useState<boolean>(true);

    const [ pagingationNumber, setPaginationNumber ] = useState<number>(1);
    const numberOfHitsPerPagination = 15;

    function changeLastXYears(lastXYears: number) {
        setLastNumberOfYears(lastXYears);
        setSortType('Rank');
        setPaginationNumber(1);
    };
    
    const ranksFiltered = sortAndFilterRankData(ranks, query, sortType, decreasing);
    
    const title = props.languageContent.Statistics.RankStatistics?.title;
    
    return <>
    <DefaultPageContainer 
        leagueType={props.leagueType} 
        pageClassName='search-user-name-container' 
        heading={title} 
        description={title}
        pageTitle={title}
        errorLoading={errorLoading}
        isLoading={isLoading}
    >
        <form className="form-stuff text-center">
            <div className='last-x-seasons-select'>
                <label>{props.languageContent.Statistics.RankStatistics.last_season}</label>
                <select onChange={(e) => changeLastXYears(parseInt(e.target.value))} className="input-box" id="sort_on_dropdown" name="sort_on">
                    { Array.from(Array(numberOfLastYears), (e, i) => 
                        <option 
                            key={`option-${i}`}
                            selected={lastNumberOfYears == (i + 1)} 
                            value={(i + 1).toString()}>
                            { i == 0 && props.languageContent.General.previous + " " + props.languageContent.General.season }
                            { i > 0 && props.languageContent.General.last + " " + (i+ 1).toString() + " " + props.languageContent.General.seasons}
                        </option>
                    )}
                </select>
            </div>

            <div className='box-4'></div>

            <div className='box-5'>
                <label htmlFor="site-search" className='hidden'>Search bar</label>
                <input onChange={(e) => setQuery(e.target.value)} placeholder={props.languageContent.Statistics.PlayerOwnership.search_text} className='input-box' type="search" id="site-search" name="q"></input>
            </div>
        </form>

        { ranksFiltered.length > 0 ?  
        <>
            <div className="container-player-stats">
                <Table tableLayoutType='esf' className='stat-table'>
                    <TableHead>
                        <TableRow key='table-head'>
                            <TableCell cellType='head' className="narrow">{props.languageContent.General.rank}</TableCell>
                            <TableCell cellType='head' className="name-col">{props.languageContent.General.teamname}</TableCell>
                            <TableCell cellType='head' minWidth={145}>
                                <TableSortHead 
                                    defaultSortType={'Increasing'} 
                                    text={props.languageContent.Statistics.RankStatistics.rank} 
                                    reset={sortType !== 'Rank'} 
                                    onclick={(increase: boolean) => {
                                        setSortType("Rank");
                                        setDecreasing(increase);
                                    }}/>
                                </TableCell>
                            <TableCell cellType='head' minWidth={145}>
                                <TableSortHead 
                                    text={props.languageContent.Statistics.RankStatistics.points} 
                                    reset={sortType !== 'Points'} 
                                    onclick={(increase: boolean) => {
                                        setSortType("Points");
                                        setDecreasing(increase);
                                    }}/>
                                </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { ranksFiltered.slice( (pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination).map( (x, index) => 
                        <TableRow key={`table-body-${index}`}>
                            <TableCell cellType='data' className="narrow">
                                { sortType == "Rank" ? (x.avg_rank_ranking) : (x.avg_points_ranking) }
                            </TableCell>
                            <TableCell cellType='data' className="name-col">
                                <Link href={fantasyManagerUrl.replace("X", x.user_id)} target='_blank'>
                                    { x.team_name }
                                </Link>
                            </TableCell>
                            <TableCell cellType='data' minWidth={145}>{ x.avg_rank }</TableCell>
                            <TableCell cellType='data' minWidth={145}>{ x.avg_points } </TableCell>
                        </TableRow>
                        )}             
                    </TableBody>
                </Table>
            </div>                

            { ranksFiltered.length > 0 && 
                <Pagination 
                    className="ant-pagination" 
                    onChange={(number) => setPaginationNumber(number)}
                    defaultCurrent={1}   
                    defaultPageSize={numberOfHitsPerPagination}
                    total={ranksFiltered.length} 
                /> 
            }
        </> : <>
            { query && 
                <Message messageType='info' messageText={props.languageContent.General?.noHitsMessage}/>
            }
        </>
        }
    </DefaultPageContainer>
    </>
};

export default RankStatisticsPage;
