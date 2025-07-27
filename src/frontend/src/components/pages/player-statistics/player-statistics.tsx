"use client"

import { Table, TableBody, TableCell, TableHead, TableRow } from '../../shared/ui/table/Table';
import { useState } from 'react';
import TableSortHead from '../../shared/ui/tableSortHead/TableSortHead';
import usePlayerStatistics from '../../../hooks/usePlayerStatistics';
import { sortAndFilterPlayerStatistics } from './sortAndFilter';
import { convertCategoryToName, getMinWidth } from './playerStatisticsUtils';
import Message from '../../shared/Messages/Messages';
import { defaultFormValueAllSelected } from '../../../constants/formValue';
import { LeagueProps, LeagueType } from '@/types/league';
import { useTranslations } from 'next-intl';
import { TeamNameAndIdModel } from '@/models/playerOwnership/TeamNameAndIdModel';
import { PlayerStatisticsModel } from '@/models/playerStatistics/PlayerStatisticsModel';
import { useRouter } from 'next/navigation';
import '../player-ownership/player-ownership.css';
import { Pagination } from '@/components/shared/pagination/pagination';

type PlayerStatisticsProps = {
    categories: string[];
    teamNameAndIds: TeamNameAndIdModel[];
    playerStatistics: PlayerStatisticsModel[];
    totalNumberOfGws: number;
    leagueType: LeagueType;
    lastXGws: number;
}

export function PlayerStatisticsPage({ 
    categories,
    teamNameAndIds,
    playerStatistics,
    totalNumberOfGws,
    leagueType,
    lastXGws
}: PlayerStatisticsProps) {
    const t = useTranslations('Statistics.PlayerOwnership');
    const g = useTranslations('General');
    const f = useTranslations('Fixture');
    const router = useRouter();

    const [ sortingPositionId, setSortingPositionId ] = useState(defaultFormValueAllSelected);
    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const [ sortingTeamId, setSortingTeamId ] = useState(defaultFormValueAllSelected);
    
    const [ query, setQuery ] = useState<string>("");
    const [ sortIndex, setSortIndex ] = useState<number>(0);
    const [ decreasing, setDecreasing ] = useState<boolean>(true);
    
    const handleLastXGwsChange = (value: number) => {
        const currentParams = new URLSearchParams(window.location.search);
        if (value === 0) {
            currentParams.delete('lastXGws');
        } else {
            currentParams.set('lastXGws', value.toString());
        }
        router.replace(`?${currentParams.toString()}`, { scroll: false });
    };

    const convertCategoryToName = (category: string): string => {
        const categoryMap: Record<string, string> = {
            "Points": g("points"),
            "Goals": g("goal"),
            "Yellow Cards": g("yellow_cards"),
            "Red Cards": g("red_cards"),
        };
        return categoryMap[category] || category;
    };

    const numberOfHitsPerPagination = 15;
    
    const playerStatisticsFiltered = sortAndFilterPlayerStatistics(playerStatistics, query, sortingTeamId, sortingPositionId, sortIndex, decreasing);

    const totalNumberOfGwsList = Array.from({ length: totalNumberOfGws }, (_, i) => i + 1);

    return <>
            <form className="form-stuff player-stats text-center">
                <div className='box-1'>
                    <label>{g("view")}</label>
                    <select 
                        onChange={(e) => setSortingPositionId(e.target.value)} 
                        className="input-box" 
                        id="sort_players_dropdown" 
                        name="sort_players"
                    >
                        <option key={defaultFormValueAllSelected} selected={sortingPositionId == defaultFormValueAllSelected} value={defaultFormValueAllSelected}>{g("all_positions")}</option>
                        <option key="Goalkeepers" selected={sortingPositionId == "Goalkeepers"} value="Goalkeepers">{g("goalkeepers")}</option>
                        <option key="Defenders" selected={sortingPositionId == "Defenders"} value="Defenders">{g("defenders")}</option>
                        <option key="Midfielders" selected={sortingPositionId == "Midfielders"} value="Midfielders">{g("midfielders")}</option>
                        <option key="Forwards" selected={sortingPositionId == "Forwards"} value="Forwards">{g("forwards")}</option>
                    </select>
                </div>
                
                <div className='box-2'>
                    <label>{f("team")}</label>
                    <select 
                        onChange={(e) => setSortingTeamId(e.target.value)} 
                        className="input-box" 
                        id="sort_players_dropdown" 
                        name="sort_players"
                    >
                        <option selected={sortingTeamId == defaultFormValueAllSelected} value={defaultFormValueAllSelected}>{g("all_teams")}</option>
                        {teamNameAndIds.length > 0 && teamNameAndIds.map(x => (
                            <option key={x.team_id} selected={x.team_name === sortingTeamId} value={x.team_id}>{x.team_name}</option>
                        ))}
                    </select>
                </div>
                
                <div className='box-3'>
                    { totalNumberOfGwsList.length > 0 && <>
                        <label>{g("last_x_rounds")}</label>
                        <select 
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                handleLastXGwsChange(val);
                                setSortingTeamId(defaultFormValueAllSelected);
                            }} 
                            className="input-box" 
                            id="sort_on_dropdown" 
                            name="sort_on"
                        >
                            <option key="First" selected={lastXGws == 0} value="0">{g("total_all_gws")}</option>
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
                        placeholder={t("search_text")} 
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
                        <Table tableLayoutType={leagueType}>
                            <TableHead>
                                <TableRow>
                                    <>
                                        <TableCell
                                            tableKey={'head'}
                                            cellType='head' 
                                            minWidth={getMinWidth('Name', lastXGws, leagueType, categories)} 
                                            className={'name-col'}>
                                            { g("name") }
                                        </TableCell>
                                        { categories.map((category, idx) => 
                                            <TableCell
                                                tableKey={idx.toString()}
                                                cellType='head' 
                                                minWidth={getMinWidth(categories[idx], lastXGws, leagueType, categories)} 
                                                className={(idx + 1) === categories.length ? 'last-element' : ''}
                                            >
                                                <TableSortHead 
                                                    text={convertCategoryToName(category)} 
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
                                                minWidth={getMinWidth('Name', lastXGws, leagueType, categories)} 
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
                                                    minWidth={getMinWidth(categories[index], lastXGws, leagueType, categories)} 
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
                    <Message messageType='info' messageText={g("noHitsMessage")}/>
                }
            </>
            }
    </>
};

export default PlayerStatisticsPage;