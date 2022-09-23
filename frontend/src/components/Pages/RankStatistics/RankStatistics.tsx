import React, { useState, useEffect, FunctionComponent } from 'react';

import Pagination from 'rc-pagination';
import axios from 'axios';

import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { TableSortHead } from './../../Shared/TableSortHead/TableSortHead';
import { RankModel } from '../../../models/RankStatistics/RankStatistics';
import { LanguageProps } from '../../../models/shared/LanguageProps';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { store } from '../../../store/index';
import OpenInNew from '@material-ui/icons/OpenInNew';

import '../../../components/Shared/Pagination/Pagination.scss';
import './RankStatistics.scss';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const RankStatisticsPage : FunctionComponent<LanguageProps> = (props) => {
    const player_ownership_api_path = "/statistics/rank-statistics-api/";
    
    const initial_last_x_years = 3;
    const emptyRanks: RankModel[] = [{ user_id: "", name: "", avg_rank: -1, avg_points: -1, avg_rank_ranking: -1, avg_points_ranking: -1}];
    
    const [ ranks, setRanks ] = useState(emptyRanks);
    const [ ranksToShow, setRanksToShow ] = useState(emptyRanks);
    const [ last_x_years, setLast_x_years ] = useState(3);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ fantasy_manager_url, setFantasy_manager_url ] = useState("");
    const [ number_of_last_years, setNumber_of_last_years ] = useState(0);
    const [ query, setQuery ] = useState("");
    const  [ firstLoading, setFirstLoading ] = useState(true);

    useEffect(() => {
        if (store.getState()?.league_type != "Eliteserien") {
            store.dispatch({type: "league_type", payload: "Eliteserien"});
        }

        search(initial_last_x_years);

    }, []);

    function search(last_x_years: number) {
        setIsLoading(true);
        
        var body = {
            last_x_years: last_x_years,
        };
        
        axios.post(player_ownership_api_path, body).then(x => {
            let json_data = JSON.parse(x.data);
            setFantasy_manager_url(json_data.fantasy_manager_url)
            let temp: RankModel[] = [];
            json_data.list_of_ranks.map( (ins: any) => {
                let d = JSON.parse(ins);
                temp.push({
                    user_id: d.user_id,
                    name: d.name,
                    avg_rank: d.avg_rank,
                    avg_points: d.avg_points,
                    avg_rank_ranking: d.avg_rank_ranking,
                    avg_points_ranking: d.avg_points_ranking,
                })
            })
            setNumber_of_last_years(json_data.number_of_last_years);
            setRanks(temp);
            setRanksToShow(temp);
            setIsLoading(false);
            if (query) { searchUsers(query); }
            if (firstLoading) { setFirstLoading(false); }
        })
    }

    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const [ numberOfHitsPerPagination, setNumberOfHitsPerPagination ] = useState(15);

    function paginationUpdate(pageNumber: number) {
        setPaginationNumber(pageNumber);
    }

    function searchUsers(keyword: string) {
        let temp: RankModel[] = [];
        ranks.map(x => {
            if (x.name.includes(keyword)) {
                temp.push(x);
            }
        })
        console.log(temp)
        setRanksToShow(temp);
        setQuery(keyword);
    }

    function changeLastXYears(last_x_years: number) {
        search(last_x_years);
        setLast_x_years(last_x_years);
        setCurrentSorted('Rank');
    }

    const propComparator = (prop:number, increasing: boolean) =>
    (a:RankModel, b:RankModel) => {
        if (prop == 0) {
            if ( a.avg_rank < b.avg_rank){
                return increasing ? -1 : 1;
            }
            if (a.avg_rank > b.avg_rank){
                return increasing ? 1 : -1;
            }
            return 0;
        }
        if (prop == 1) {
            if ( a.avg_points > b.avg_points){
                return increasing ? -1 : 1;
            }
            if (a.avg_points < b.avg_points){
                return increasing ? 1 : -1;
            }
            return 0;
        }
        return 0;
    } 

    function sortRankingData(sortType: number, increase: boolean) {
        let temp = [...ranksToShow];
        let sorted = temp.sort(propComparator(sortType, increase));
        setRanksToShow(sorted);
        if (sortType == 0) { setCurrentSorted('Rank')}
        if (sortType == 1) { setCurrentSorted('Points')}
    }   

    const [ currentSorted, setCurrentSorted ] = useState("Rank");

    let title = props.content.Statistics.RankStatistics?.title;

    return <>
    <DefaultPageContainer pageClassName='search-user-name-container' heading={title + " - " + store.getState().league_type} description={title}>
    <h1>{title}</h1>
        { !firstLoading && <>

        <form className="form-stuff text-center">
            <div className='last-x-seasons-select'>
                <label>{props.content.Statistics.RankStatistics.last_season}</label>
                <select onChange={(e) => changeLastXYears(parseInt(e.target.value))} className="input-box" id="sort_on_dropdown" name="sort_on">
                    { Array.from(Array(number_of_last_years), (e, i) => 
                        <option selected={last_x_years == (i + 1)} value={(i + 1).toString()}>
                            { i == 0 && props.content.General.previous + " " + props.content.General.season }
                            { i > 0 && props.content.General.last + " " + (i+ 1).toString() + " " + props.content.General.seasons}
                            </option> )}
                </select>
            </div>

            <div className='box-4'></div>

            <div className='box-5'>
                <label className='hidden'>Search bar</label>
                <input onChange={(e) => searchUsers(e.target.value)} placeholder={props.content.Statistics.PlayerOwnership.search_text} className='input-box' type="search" id="site-search" name="q"></input>
            </div>
        </form></>
        }

        { isLoading && 
            <Spinner />
        }

        { !isLoading && ranksToShow.length > 0 && ranksToShow[0].user_id != "" &&  
        <>
            <div className="container-player-stats">
            <table>
                <thead>
                    <tr>
                        <th className="narrow">{props.content.General.rank}</th>
                        <th className="name-col">{props.content.General.name}</th>
                        <th><TableSortHead defaultSortType={'Increasing'} text={props.content.Statistics.RankStatistics.rank} reset={currentSorted != 'Rank'} onclick={(increase: boolean) => sortRankingData(0, increase)}/></th>
                        <th><TableSortHead text={props.content.Statistics.RankStatistics.points} reset={currentSorted != 'Points'} onclick={(increase: boolean) => sortRankingData(1, increase)}/></th>
                        <th className="">{props.content.General.see_team}</th>
                    </tr>
                </thead>

                <tbody>
                    { ranksToShow.slice( (pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination).map( (x, index) => 
                    <tr>
                        <td className="narrow">{ currentSorted == "Rank" ? (x.avg_rank_ranking) : (x.avg_points_ranking) }</td>
                        <td className="name-col"> <div className="format-name-col">{ x.name }</div> </td>
                        <td className="">{ x.avg_rank }</td>
                        <td className="">{ x.avg_points } </td>
                        <td className="">
                            <a target="_blank" href={fantasy_manager_url.replace("X", x.user_id)}>
                                {props.content.General.see_team}
                                <OpenInNew fontSize='small' />
                            </a>
                        </td>
                    </tr>
                    )}             
                </tbody>
            </table>
            </div>                

            { !isLoading && ranksToShow.length > 0 && 
                <Pagination 
                    className="ant-pagination" 
                    onChange={(number) => paginationUpdate(number)}
                    defaultCurrent={1}   
                    total={ranksToShow.length} /> 
            }
        </>}
    </DefaultPageContainer>
    </>
};

export default RankStatisticsPage;
