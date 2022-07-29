import { useWindowDimensions } from "../../../utils/useWindowDimensions";
import React, { FunctionComponent, useEffect, useState } from "react";
import { content_json } from "../../../language/languageContent";
import { TopMenuMobile } from "../topMenuMobile/topMenuMobile";
import { useSelector } from 'react-redux';
import { store, persistor } from '../../../store/index';
import { Link } from "react-router-dom";
import "./topMenu.scss";

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
    
    return <>
    <div className={"top-menu " + leagueType}>
        { width > mobileMaxSize && 
            <div className={"front-page-top-sky " + leagueType}>
                <div className="top-navbar container">
                    <div className="top-navbar-language-container">
                        <button className={language == norwegain ? "" : "not-chosen"} onClick={() => updateLanguage(norwegain)}>No</button> |
                        <button className={language == english ? "" : "not-chosen"} onClick={() => updateLanguage(english)}>En</button>
                    </div>
                    <div className="top-navbar-container">
                        <Link className="circle-link fpl" onClick={() => updateSoccerLeague(fpl)} to="/fixture-planner/"></Link>
                        <Link className="circle-link eliteserien" onClick={() => updateSoccerLeague(eliteserien)} to="/fixture-planner-eliteserien/"></Link>
                    </div>
                </div>
                <div className="navbar">
                    <div className="nav-container">
                        <h1 className="logo">{leagueType == "FPL" ? "Premier League" : leagueType}</h1>
                        { leagueType == fpl && 
                            <nav>
                                {/* <div className="dropdown">
                                    <button className="dropbtn">Statistics</button>
                                    <div className="dropdown-content">
                                        <a href="../../../fixture-planner/">Player Stats</a>
                                        <a href="../../../fixture-planner/">Global Stats</a>
                                        <a href="../../../fixture-planner/">Ownership Stats</a>
                                    </div>
                                </div> */}
                                <ul>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Fixture.fixture}</button>
                                        <div className="dropdown-content">
                                            <a href="../../../fixture-planner/fdr-planner/">{props.content.Fixture.FixturePlanner.title}</a>
                                            <a href="../../../fixture-planner/rotation-planner/">{props.content.Fixture.RotationPlanner.title}</a>
                                            <a href="../../../fixture-planner/periode-planner/">{props.content.Fixture.PeriodPlanner.title}</a>
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
                                            <a className="dropbtn" href="../../../statistics/player-ownership/">{props.content.Statistics.PlayerOwnership.title}</a>
                                        </div>
                                    </li>
                                    <li className="dropdown">
                                        <button className="dropbtn">{props.content.Fixture.fixture}</button>
                                        <div style={{float: 'left'}} className="dropdown-content">
                                            <a className="dropbtn" href="../../../fixture-planner-eliteserien/">{props.content.Fixture.FixturePlanner.title}</a>
                                            <a className="dropbtn" href="../../../fixture-planner-eliteserien/rotation-planner/">{props.content.Fixture.RotationPlanner.title}</a>
                                            <a className="dropbtn" href="../../../fixture-planner-eliteserien/periode-planner/">{props.content.Fixture.PeriodPlanner.title}</a>
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