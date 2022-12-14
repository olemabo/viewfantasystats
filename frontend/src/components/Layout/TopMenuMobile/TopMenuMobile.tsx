import React, { useEffect, useState } from "react";
import "./TopMenuMobile.scss";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import BarChartIcon from '@material-ui/icons/BarChart';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import { content_json } from "../../../language/languageContent";

import { store } from '../../../store/index';
import { Link } from "react-router-dom";
import * as urls from '../../../internal_urls/internalUrls';
import { LanguageSelector, LeagueSelector } from "../../Shared/LeagueAndLanguageSelector/LeagueAndLanguageSelector";


interface TopMenyProps {
    title: string;
    soccer_leauge: string;
    content: any;
}

export const TopMenuMobile: React.FunctionComponent<TopMenyProps> = (props) => {
    const fpl = "FPL";
    const eliteserien = "Eliteserien";
    const norwegain = "no";
    const english = "en";
    
    function toggleMenu() {
        setMenuOpen(wasOpened => !wasOpened);
        store.dispatch({type: "isMenuOpen", payload: !MenuOpen })
    }
    
    function updateSoccerLeague(soccer_league: string) {
        store.dispatch({type: "league_type", payload: soccer_league});
    }
    
    function closeMenu() {
        store.dispatch({type: "isMenuOpen", payload: false })
    }

    const [ language, setLanguage] = useState(store.getState().language_code);
    const [ MenuOpen, setMenuOpen ] = useState(false);
    
    useEffect(() => {
        setMenuOpen(false);
        store.dispatch({type: "isMenuOpen", payload: false })
    }, [])

    console.log(MenuOpen)
    
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
    
    let league_type = store.getState()?.league_type;

    return <>
    <div className="top-menu-mobile">
        <div className="fpl-linear-gradient-color-darker">
            <div className="top-menu-container">
                <div className="header-title">
                    { props?.title}
                </div>
                <div className="header-menu-section">
                    {/* <div className="top-menu-mobile-circle-container">
                        { league_type == eliteserien && <Link className="circle-link fpl" onClick={() => updateSoccerLeague(fpl)} to="/fixture-planner/"></Link> }
                        { league_type == fpl && <Link className="circle-link eliteserien" onClick={() => updateSoccerLeague(eliteserien)} to="/fixture-planner-eliteserien/"></Link> }
                    </div> */}
                    <div onClick={ () => toggleMenu() } className="header-menu-text">
                        { !MenuOpen ? props.content.General.menu : props.content.General.close }
                    </div>
                    <div onClick={ () => toggleMenu() } className="header-menu-icon">
                    { !MenuOpen ? <MenuIcon /> : <CloseIcon /> }
                    </div>
                </div>
            </div>
        </div>
        { MenuOpen && 
            <div className="mobile-sub-menu">
                <div className="top-menu-mobile-circle-container">
                    <div className="top-navbar-mobile-langauge-container">
                        {/* <button className={language == norwegain ? "" : "not-chosen"} onClick={() => updateLanguage(norwegain)}>No</button> |
                        <button className={language == english ? "" : "not-chosen"} onClick={() => updateLanguage(english)}>En</button> */}
                        { language == norwegain && 
                        <LanguageSelector 
                            text={'English'}
                            onclick={() => updateLanguage(english)} />
                        }
                        { language == english && 
                        <LanguageSelector 
                            text={'Norsk'}
                            onclick={() => updateLanguage(norwegain)}  />
                        }
                    </div>
                    <div>
                        {/* { league_type == eliteserien && <Link className="circle-link" onClick={() => updateSoccerLeague(fpl)} to={"/" + urls.url_premier_league}>FPL</Link> }
                        { league_type == fpl && <Link className="circle-link" onClick={() => updateSoccerLeague(eliteserien)} to={"/" + urls.url_elitserien}>ESF</Link> } */}
                        { league_type === eliteserien && 
                            <LeagueSelector 
                                text={'FPL'}
                                onclick={() => updateSoccerLeague(fpl)}
                                url={"/" + urls.url_premier_league}  />
                        }
                        { league_type === fpl && 
                            <LeagueSelector 
                                text={'ESF'}
                                onclick={() => updateSoccerLeague(eliteserien)}
                                url={"/" + urls.url_elitserien}  />
                        }
                    </div>
                </div>
                <nav className="mobile-sub-menu-container">
                    <ul>
                        { league_type == eliteserien && <>
                            {/* <h2>Fixture Planning</h2> */}
                            <li className="sub-menu-item">
                                {/* <HomeIcon /> */}
                                <a onClick={() => closeMenu()} href={"../../../" + urls.url_elitserien_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                {/* <SportsSoccerIcon /> */}
                                <a onClick={() => closeMenu()} href={"../../../" + urls.url_eliteserien_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
                            </li>
                            <li onClick={() => closeMenu()} className="sub-menu-item">
                                {/* <BarChartIcon /> */}
                                <a href={"../../../" + urls.url_eliteserien_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
                            </li>
                            {/* <h2>Statistics</h2> */}
                            <li onClick={() => closeMenu()} className="sub-menu-item">
                                <a href={"../../../" + urls.url_eliteserien_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>
                            </li>
                            <li onClick={() => closeMenu()} className="sub-menu-item">
                                <a href={"../../../" + urls.url_eliteserien_rank_statistics}>{props.content.Statistics.RankStatistics?.title}</a>
                            </li>
                            </>
                        }   

                        { league_type == fpl && <>
                            <li className="sub-menu-item">
                                {/* <HomeIcon /> */}
                                <a onClick={() => closeMenu()} href={"../../../" + urls.url_premier_league_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                {/* <SportsSoccerIcon /> */}
                                <a onClick={() => closeMenu()} href={"../../../" + urls.url_premier_league_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                {/* <BarChartIcon /> */}
                                <a onClick={() => closeMenu()} href={"../../../" + urls.url_premier_league_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
                            </li>
                            <li onClick={() => closeMenu()} className="sub-menu-item">
                                <a href={"../../../" + urls.url_premier_league_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>
                            </li>

                            <li onClick={() => closeMenu()} className="sub-menu-item">
                                <a href={"../../../" + urls.url_premier_league_player_statistics}>{props.content.Statistics.PlayerStatistics?.title}</a>
                            </li>
                            </>
                        }
                    </ul>
            </nav>
        </div>
        }
    </div>
    </>

};

export default TopMenuMobile;