import { LanguageSelector, LeagueSelector } from "../../Shared/LeagueAndLanguageSelector/LeagueAndLanguageSelector";
import { PageProps, en, esf, fpl, no } from "../../../models/shared/PageProps";
import { content_json } from "../../../language/languageContent";
import * as urls from '../../../static_urls/internalUrls';
import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { store } from '../../../store/index';
import "./TopMenuMobile.scss";


export const TopMenuMobile: React.FunctionComponent<PageProps & { title: string}> = (props) => {
    
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
    
    function updateLanguage(lang: string) {
        const currentLanguage = lang === en ? en : no;
        const currentContent = lang === en ? content_json.English : content_json.Norwegian;
        store.dispatch({type: "language", payload: currentContent});
        store.dispatch({type: "language_code", payload: currentLanguage});
        setLanguage(currentLanguage);
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
                        { language == no && 
                        <LanguageSelector 
                            text={'English'}
                            onclick={() => updateLanguage(en)} />
                        }
                        { language == en && 
                        <LanguageSelector 
                            text={'Norsk'}
                            onclick={() => updateLanguage(no)}  />
                        }
                    </div>
                    <div>
                        { league_type === esf && 
                            <LeagueSelector 
                                text={'FPL'}
                                onclick={() => updateSoccerLeague(fpl)}
                                url={"/" + urls.url_premier_league}  />
                        }
                        { league_type === fpl && 
                            <LeagueSelector 
                                text={'ESF'}
                                onclick={() => updateSoccerLeague(esf)}
                                url={"/" + urls.url_eliteserien}  />
                        }
                    </div>
                </div>
                <nav className="mobile-sub-menu-container">
                    <ul>
                        { league_type == esf && <>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_eliteserien_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_eliteserien_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_eliteserien_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_eliteserien_fdr_planner_team_id}>{props.content.Fixture.TeamPlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_eliteserien_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_eliteserien_live_fixtures}>{props.content.Statistics.LiveFixtures?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_eliteserien_rank_statistics}>{props.content.Statistics.RankStatistics?.title}</a>
                            </li>
                            </>
                        }   

                        { league_type == fpl && <>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_premier_league_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_premier_league_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_premier_league_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_premier_league_fdr_planner_team_id}>{props.content.Fixture.TeamPlanner?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_premier_league_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_premier_league_live_fixtures}>{props.content.Statistics.LiveFixtures?.title}</a>
                            </li>
                            <li className="sub-menu-item">
                                <a onClick={() => closeMenu()} href={"/" + urls.url_premier_league_player_statistics}>{props.content.Statistics.PlayerStatistics?.title}</a>
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