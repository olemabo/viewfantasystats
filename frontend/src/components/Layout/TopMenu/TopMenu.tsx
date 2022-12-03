import { useWindowDimensions } from "../../../utils/useWindowDimensions";
import React, { FunctionComponent, useEffect, useState } from "react";
import { content_json } from "../../../language/languageContent";
import { TopMenuMobile } from '../TopMenuMobile/TopMenuMobile';
import * as urls from '../../../internal_urls/internalUrls';
import { store } from '../../../store/index';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import "./TopMenu.scss";
import PublicIcon from '@material-ui/icons/Public';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import { LanguageSelector, LeagueSelector } from "../../Shared/LeagueAndLanguageSelector/LeagueAndLanguageSelector";

type LanguageProps = {
    content: any;
}

export const TopMenu : FunctionComponent<LanguageProps> = (props) => {
    const { height, width } = useWindowDimensions();
    const mobileMaxSize = 800;
    
    const norwegain = "no";
    const english = "en";
    
    const fpl = "FPL";
    const eliteserien = "Eliteserien";
    
    const isMenuOpenFromRedux = useSelector((state: any) => state?.league_type);
    const [ leagueType, setLeagueType ] = useState("FPL");
    const [ language, setLanguage] = useState(store.getState().language_code);

    function updateSoccerLeague(soccer_league: string) {
        store.dispatch({type: "league_type", payload: soccer_league});
    }

    function updateLanguage(lang: string) {
        if (lang == english) {
            store.dispatch({type: "language", payload: content_json.English});
            store.dispatch({type: "language_code", payload: english});
            setLanguage(english);
        }
        else if (lang == norwegain) {
            store.dispatch({type: "language", payload: content_json.Norwegian});
            store.dispatch({type: "language_code", payload: norwegain});
            setLanguage(norwegain);
        }
        else {
            store.dispatch({type: "language", payload: content_json.Norwegian});
            store.dispatch({type: "language_code", payload: norwegain});
            setLanguage(norwegain);
        }
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
    <div className={"top-menu " + leagueType}>
        { width > mobileMaxSize && 
            <div className={"front-page-top-sky " + leagueType}>
                <div className="top-navbar container">
                    <div className="top-navbar-language-container">
                        {/* <button className={language == norwegain ? "" : "not-chosen"} onClick={() => updateLanguage(norwegain)}>No</button> |
                        <button className={language == english ? "" : "not-chosen"} onClick={() => updateLanguage(english)}>En</button> */}
                        { language === norwegain && 
                        <LanguageSelector 
                            text={'English'}
                            onclick={() => updateLanguage(english)} />
                        }
                        { language === english && 
                        <LanguageSelector 
                            text={'Norsk'}
                            onclick={() => updateLanguage(norwegain)}  />
                        }
                    </div>
                    <div className="top-navbar-container">
                        {/* { leagueType == eliteserien && <Link className="circle-link fpl" onClick={() => updateSoccerLeague(fpl)} to={"/" + urls.url_premier_league}>FPL</Link>}
                        { leagueType == fpl &&<Link className="circle-link eliteserien" onClick={() => updateSoccerLeague(eliteserien)} to={"/" + urls.url_elitserien}>ESF</Link>} */}
                        { leagueType === eliteserien && 
                        <LeagueSelector 
                            text={'FPL'}
                            onclick={() => updateSoccerLeague(fpl)}
                            url={"/" + urls.url_premier_league}  />
                        }
                        { leagueType === fpl && 
                        <LeagueSelector 
                            text={'ESF'}
                            onclick={() => updateSoccerLeague(eliteserien)}
                            url={"/" + urls.url_elitserien}  />
                        }
                    </div>
                </div>
                <div className="navbar">
                    <div className="nav-container">
                        <h1 className="logo">
                            <Link to={"/" + (leagueType === "FPL" ? urls.url_premier_league : urls.url_elitserien)}>
                                <div>{"Fantasy Stats "}</div>
                                { "" +  (leagueType == "FPL" ? "Premier League" : leagueType)}
                            </Link>
                        </h1>
                        { leagueType == fpl && 
                            <nav>
                                <ul>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Statistics.statistic}</button>
                                        <div style={{left: '0'}} className="dropdown-content">
                                            <a className="dropbtn" href={"../../../" + urls.url_premier_league_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>
                                            <a className="dropbtn" href={"../../../" + urls.url_premier_league_player_statistics}>{props.content.Statistics.PlayerStatistics?.title}</a>
                                        </div>
                                    </li>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Fixture.fixture}</button>
                                        <div className="dropdown-content">
                                            <a className="dropbtn" href={"../../../" + urls.url_premier_league_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
                                            <a className="dropbtn" href={"../../../" + urls.url_premier_league_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
                                            <a className="dropbtn" href={"../../../" + urls.url_premier_league_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
                                        </div>
                                    </li>
                                </ul>
                            </nav> 
                        }
                        { leagueType == eliteserien && 
                            <nav>
                                <ul>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Statistics.statistic}</button>
                                        <div style={{left: '0'}} className="dropdown-content">
                                            <a className="dropbtn" href={"../../../" + urls.url_eliteserien_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>
                                            {/* <a className="dropbtn" href={"../../../" + urls.url_eliteserien_search_user_name}>{props.content.Statistics.SearchUserName?.title}</a> */}
                                            <a className="dropbtn" href={"../../../" + urls.url_eliteserien_rank_statistics}>{props.content.Statistics.RankStatistics?.title}</a>
                                        </div>
                                    </li>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Fixture.fixture}</button>
                                        <div style={{float: 'left'}} className="dropdown-content">
                                            <a className="dropbtn" href={"../../../" + urls.url_elitserien_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
                                            <a className="dropbtn" href={"../../../" + urls.url_eliteserien_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
                                            <a className="dropbtn" href={"../../../" + urls.url_eliteserien_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
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
            soccer_leauge={leagueType} 
            content={props.content}
        />
      }
    </div>
    </>
};

export default TopMenu;