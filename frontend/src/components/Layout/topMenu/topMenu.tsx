import { useWindowDimensions } from "../../../utils/useWindowDimensions";
import { TopMenuMobile } from "../topMenuMobile/topMenuMobile";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./topMenu.scss";
import { useSelector } from 'react-redux';
import store from '../../../store/index';


export const TopMenu = () => {
    const { height, width } = useWindowDimensions();
    const mobileMaxSize = 800;
    const fpl = "FPL";
    const eliteserien = "Eliteserien";
    const isMenuOpenFromRedux = useSelector((state: any) => state?.league_type);
    const [ leagueType, setLeagueType ] = useState("FPL");
    const webpageTitle = leagueType;

    function updateSoccerLeague(soccer_league: string) {
        store.dispatch({type: "league_type", payload: soccer_league});
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
                                        <button className="dropbtn">Fixture Planning</button>
                                        <div className="dropdown-content">
                                            <a href="../../../fixture-planner/fdr-planner/">FDR Planner</a>
                                            <a href="../../../fixture-planner/rotation-planner/">Roation Planner</a>
                                            <a href="../../../fixture-planner/periode-planner/">Period Planner</a>
                                        </div>
                                    </li>
                                </ul>
                            </nav> 
                        }
                        { leagueType == eliteserien && 
                            <nav>
                                <ul>
                                    <li className="dropdown">
                                        <button className="dropbtn">Statistikk</button>
                                        <div style={{left: '0'}} className="dropdown-content">
                                            <a className="dropbtn" href="../../../statistics/player-ownership/">Eierandel</a>
                                        </div>
                                    </li>
                                    <li className="dropdown">
                                        <button className="dropbtn">Kampprogram</button>
                                        <div style={{float: 'left'}} className="dropdown-content">
                                            <a className="dropbtn" href="../../../fixture-planner-eliteserien/">FDR Planner</a>
                                            <a className="dropbtn" href="../../../fixture-planner-eliteserien/rotation-planner/">Rotasjonsplanlegger</a>
                                            <a className="dropbtn" href="../../../fixture-planner-eliteserien/periode-planner/">Periodeplanlegger</a>
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
        <TopMenuMobile title={webpageTitle} soccer_leauge={leagueType} />
      }
    </div>
    </>
};

export default TopMenu;