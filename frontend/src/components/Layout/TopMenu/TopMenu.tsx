import { LanguageSelector, LeagueSelector } from "../../Shared/LeagueAndLanguageSelector/LeagueAndLanguageSelector";
import { LanguageProps, fpl, esf, no, en } from '../../../models/shared/PageProps';
import { useWindowDimensions } from "../../../utils/useWindowDimensions";
import React, { FunctionComponent, useEffect, useState } from "react";
import { content_json } from "../../../language/languageContent";
import { TopMenuMobile } from '../TopMenuMobile/TopMenuMobile';
import * as urls from '../../../static_urls/internalUrls';
import { store } from '../../../store/index';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import "./TopMenu.scss";


export const TopMenu : FunctionComponent<LanguageProps> = (props) => {
    const { height, width } = useWindowDimensions();
    const mobileMaxSize = 800;
        
    const isMenuOpenFromRedux = useSelector((state: any) => state?.league_type);
    const [ leagueType, setLeagueType ] = useState(fpl);
    const [ language, setLanguage] = useState(store.getState().language_code);

    function updateSoccerLeague(soccer_league: string) {
        store.dispatch({type: "league_type", payload: soccer_league});
    }

    function updateLanguage(lang: string) {
        const currentLanguage = lang === en ? en : no;
        const currentContent = lang === en ? content_json.English : content_json.Norwegian;
        store.dispatch({type: "language", payload: currentContent});
        store.dispatch({type: "language_code", payload: currentLanguage});
        setLanguage(currentLanguage);
    }

    // useEffect will listen if isMenuOpen property from redux changes
    useEffect(() => {
        let isCancelled : boolean = false;
        setLeagueType(isMenuOpenFromRedux);
        return () => { isCancelled = true }
    }, [isMenuOpenFromRedux]);

    if (width > mobileMaxSize && isMenuOpenFromRedux) {
        store.dispatch({type: "isMenuOpen", payload: false});
    }
    
    return <>
    <header className={"top-menu " + leagueType}>
        { width > mobileMaxSize && 
            <div className={"front-page-top-sky " + leagueType}>
                <div className="top-navbar container">
                    <div className="top-navbar-language-container">
                        { language === no && 
                            <LanguageSelector 
                                text={'English'}
                                onclick={() => updateLanguage(en)} /> }
                        { language === en && 
                            <LanguageSelector 
                                text={'Norsk'}
                                onclick={() => updateLanguage(no)}  /> }
                    </div>
                    <div className="top-navbar-container">
                        { leagueType === esf && 
                            <LeagueSelector 
                                text={'FPL'}
                                onclick={() => updateSoccerLeague(fpl)}
                                url={"/" + urls.url_premier_league}  /> }
                        { leagueType === fpl && 
                            <LeagueSelector 
                                text={'ESF'}
                                onclick={() => updateSoccerLeague(esf)}
                                url={"/" + urls.url_eliteserien}  /> }
                    </div>
                </div>
                <div className="navbar">
                    <div className="nav-container">
                        <h1 className="logo">
                            <Link to={"/" + (leagueType === fpl ? urls.url_premier_league : urls.url_eliteserien)}>
                                <div>{"Fantasy Stats "}</div>
                                { "" +  (leagueType === fpl ? "Premier League" : "Eliteserien")}
                            </Link>
                        </h1>
                        { leagueType == fpl && 
                            <nav>
                                <ul>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Statistics.statistic}</button>
                                        <div style={{left: '0'}} className="dropdown-content">
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_player_statistics}>{props.content.Statistics.PlayerStatistics?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_live_fixtures}>{props.content.Statistics.LiveFixtures?.title}</a>
                                        </div>
                                    </li>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Fixture.fixture}</button>
                                        <div className="dropdown-content">
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_fdr_planner_team_id}>{props.content.Fixture.TeamPlanner?.title}</a>
                                        </div>
                                    </li>
                                </ul>
                            </nav> 
                        }
                        { leagueType == esf && 
                            <nav>
                                <ul>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Statistics.statistic}</button>
                                        <div style={{left: '0'}} className="dropdown-content">
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>
                                            {/* <a className="dropbtn" href={"/" + urls.url_eliteserien_search_user_name}>{props.content.Statistics.SearchUserName?.title}</a> */}
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_live_fixtures}>{props.content.Statistics.LiveFixtures?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_rank_statistics}>{props.content.Statistics.RankStatistics?.title}</a>
                                        </div>
                                    </li>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Fixture.fixture}</button>
                                        <div style={{float: 'left'}} className="dropdown-content">
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_fdr_planner_team_id}>{props.content.Fixture.TeamPlanner?.title}</a>
                                        </div>
                                    </li>
                                </ul>
                            </nav> 
                        }
                    </div>
                </div>
          </div>
      }
      { width <= mobileMaxSize && 
        <TopMenuMobile 
            title={leagueType == fpl ? props.content.General.premier_league : props.content.General.eliteserien} 
            league_type={leagueType} 
            content={props.content}
        />
      }
    </header>
    </>
};

export default TopMenu;