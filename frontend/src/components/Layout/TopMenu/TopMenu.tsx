import { LanguageSelector, LeagueSelector } from "../../Shared/LeagueAndLanguageSelector/LeagueAndLanguageSelector";
import { LanguageProps, fpl, esf, no, en, LeagueType } from '../../../models/shared/PageProps';
import { languageCodeSelector } from "../../../store/selectors/languageCodeSelector";
import { leagueTypeSelector } from "../../../store/selectors/leagueTypeSelector";
import { LanguageCodeActions } from "../../../store/states/languageCodeStore";
import { LeagueTypeActions } from "../../../store/states/leagueTypeStore";
import { IsMenuOpenActions } from "../../../store/states/isMenuOpenStore";
import { useWindowDimensions } from "../../../utils/useWindowDimensions";
import { languageActions } from "../../../store/states/languageStore";
import { content_json } from "../../../language/languageContent";
import { TopMenuMobile } from '../TopMenuMobile/TopMenuMobile';
import * as urls from '../../../static_urls/internalUrls';
import { FunctionComponent, useEffect, useState } from "react";
import { useAppDispatch } from "../../../store";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import "./TopMenu.scss";


export const TopMenu : FunctionComponent<LanguageProps> = (props) => {
    const { width } = useWindowDimensions();
    const mobileMaxSize = 800;
    const dispatch = useAppDispatch();

    const leagueType = useSelector(leagueTypeSelector);
    const [ language, setLanguage] = useState(useSelector(languageCodeSelector));

    useEffect(() => {
        if (width > mobileMaxSize && leagueType) {
            dispatch(IsMenuOpenActions.setisMenuOpen(false));
        }
    }, [width, leagueType, dispatch]);

    function updateSoccerLeague(leagueType: LeagueType) {
        dispatch(LeagueTypeActions.setLeagueType(leagueType));
    }

    function updateLanguage(lang: string) {
        const currentLanguage = lang === en ? en : no;
        const currentContent = lang === en ? content_json.English : content_json.Norwegian;
        
        dispatch(languageActions.setLanguage(currentContent));
        dispatch(LanguageCodeActions.setLanguageCode(currentLanguage));
        
        setLanguage(currentLanguage);
    }
    
    return <>
    <header className={"top-menu " + leagueType}>
        { width > mobileMaxSize && 
            <div className={"front-page-top-sky " + leagueType}>
                <div className="top-navbar container">
                    <div className="top-navbar-language-container">
                        { language === no && 
                            <LanguageSelector 
                                text='English'
                                onclick={() => updateLanguage(en)} /> }
                        { language === en && 
                            <LanguageSelector 
                                text='Norsk'
                                onclick={() => updateLanguage(no)}  /> }
                    </div>
                    <div className="top-navbar-container">
                        { leagueType === esf && 
                            <LeagueSelector 
                                text={fpl.toUpperCase()}
                                onclick={() => updateSoccerLeague(fpl)}
                                url={"/" + urls.url_premier_league}  /> }
                        { leagueType === fpl && 
                            <LeagueSelector 
                                text={esf.toUpperCase()}
                                onclick={() => updateSoccerLeague(esf)}
                                url={"/" + urls.url_eliteserien}  /> }
                    </div>
                </div>
                <div className="navbar">
                    <div className="nav-container">
                        <h1 className="logo">
                            <Link to={`/${(leagueType === fpl ? urls.url_premier_league : urls.url_eliteserien)}`}>
                                <div>{"Fantasy Stats "}</div>
                                { "" +  (leagueType === fpl ? "Premier League" : "Eliteserien")}
                            </Link>
                        </h1>
                        { leagueType == fpl && 
                            <nav>
                                <ul>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.languageContent.Statistics.statistic}</button>
                                        <div style={{left: '0'}} className="dropdown-content">
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_player_ownership}>{props.languageContent.Statistics.PlayerOwnership?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_live_fixtures}>{props.languageContent.Statistics.LiveFixtures?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_player_statistics}>{props.languageContent.Statistics.PlayerStatistics?.title}</a>
                                        </div>
                                    </li>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.languageContent.Fixture.fixture}</button>
                                        <div className="dropdown-content">
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_fdr_planner}>{props.languageContent.Fixture.FixturePlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_rotation_planner}>{props.languageContent.Fixture.RotationPlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_periode_planner}>{props.languageContent.Fixture.PeriodPlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_premier_league_fdr_planner_team_id}>{props.languageContent.Fixture.TeamPlanner?.title}</a>
                                        </div>
                                    </li>
                                </ul>
                            </nav> 
                        }
                        { leagueType == esf && 
                            <nav>
                                <ul>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.languageContent.Statistics.statistic}</button>
                                        <div style={{left: '0'}} className="dropdown-content">
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_player_ownership}>{props.languageContent.Statistics.PlayerOwnership?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_live_fixtures}>{props.languageContent.Statistics.LiveFixtures?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_player_statistics}>{props.languageContent.Statistics.PlayerStatistics?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_price_change}>{props.languageContent.Statistics.PriceChange?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_rank_statistics}>{props.languageContent.Statistics.RankStatistics?.title}</a>
                                        </div>
                                    </li>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.languageContent.Fixture.fixture}</button>
                                        <div style={{float: 'left'}} className="dropdown-content">
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_fdr_planner}>{props.languageContent.Fixture.FixturePlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_rotation_planner}>{props.languageContent.Fixture.RotationPlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_periode_planner}>{props.languageContent.Fixture.PeriodPlanner?.title}</a>
                                            <a className="dropbtn" href={"/" + urls.url_eliteserien_fdr_planner_team_id}>{props.languageContent.Fixture.TeamPlanner?.title}</a>
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
            title={leagueType == fpl ? props.languageContent.General.premier_league : props.languageContent.General.eliteserien} 
            leagueType={leagueType} 
            languageContent={props.languageContent}
        />
      }
    </header>
    </>
};

export default TopMenu;