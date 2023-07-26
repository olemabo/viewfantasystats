import { UserSearchHitModel } from '../../../models/SearchUserName/UserSearchHitModel';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { PageProps, esf } from '../../../models/shared/PageProps';
import { Spinner } from '../../Shared/Spinner/Spinner';
import { store } from '../../../store/index';
import Pagination from 'rc-pagination';
import './SearchUserName.scss';
import axios from 'axios';


export const SearchUserNamePage : FunctionComponent<PageProps> = (props) => {
    const player_ownership_api_path = "/statistics/search-user-names-api/";
    
    const emptyHits: UserSearchHitModel[] = [{ hit_text: "", user_id: "", user_team_name: "", user_first_name: "", user_last_name: ""}];
    
    const [ hits, setHits ] = useState(emptyHits);
    const [ query, setQuery ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);
    const [ fantasy_manager_url, setFantasy_manager_url ] = useState("");

    useEffect(() => {
        if (store.getState()?.league_type !== esf) {
            store.dispatch({type: "league_type", payload: esf});
        }

    }, []);

    function search() {
        setIsLoading(true);
        
        var body = {
            query: query,
        };
        
        axios.post(player_ownership_api_path, body).then(x => {
            let json_data = JSON.parse(x.data);
            setFantasy_manager_url(json_data.fantasy_manager_url)
            let temp: UserSearchHitModel[] = [];
            json_data.list_of_hits.map( (ins: any) => {
                let d = JSON.parse(ins);
                temp.push({
                    hit_text: d.hit_text,
                    user_first_name: d.user_first_name,
                    user_last_name: d.user_last_name,
                    user_team_name: d.user_team_name,
                    user_id: d.user_id,
                })
            })
            setHits(temp);
            setIsLoading(false);
        })
    }

    const [ pagingationNumber, setPaginationNumber ] = useState(1);
    const [ numberOfHitsPerPagination, setNumberOfHitsPerPagination ] = useState(10);

    function paginationUpdate(pageNumber: number) {
        setPaginationNumber(pageNumber);
    }
    
    return <>
     <div className='search-user-name-container' id="rotation-planner-container">
         <h1>{props.content.Statistics.SearchUserName?.title}</h1>
        <form className="" onSubmit={(e) => {search(); e.preventDefault()}}>

            <div className='search-box'>
                <label className='hidden'>Search bar</label>
                <input onChange={(e) => setQuery(e.currentTarget.value)} placeholder={props.content.Statistics.PlayerOwnership.search_text} type="search" id="site-search" name="q"></input>
            </div>
            <input className="submit" type="submit" value={props.content.General.search_button_name}>
            </input>
        </form>

        { isLoading && <Spinner /> }

        { !isLoading && hits.length > 0 && hits[0].user_id != "" &&  
        <>
            <div className='hits-section'>
                {hits.slice( (pagingationNumber - 1) * numberOfHitsPerPagination, (pagingationNumber - 1) * numberOfHitsPerPagination + numberOfHitsPerPagination).map(x => <>
                    <div className='hit-element'>
                        <div className='user-info-section'>
                            <p>{x.user_first_name} {x.user_last_name}</p>
                            <p>{x.user_team_name}</p>
                        </div>
                        <a target="_blank" href={fantasy_manager_url.replace("X", x.user_id)}>{props.content.General.see_team}</a>
                    </div>
                </>)}
                <Pagination 
                    className="ant-pagination" 
                    onChange={(number) => paginationUpdate(number)}
                    defaultCurrent={1}   
                    total={hits.length} /> 
            </div>
        </>}
     </div></>
};

export default SearchUserNamePage;