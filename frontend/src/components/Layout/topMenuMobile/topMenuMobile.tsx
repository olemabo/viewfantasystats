import React, { useEffect, useState } from "react";
import "./topMenuMobile.scss";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import BarChartIcon from '@material-ui/icons/BarChart';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';

import store from '../../../store/index';
import { Link } from "react-router-dom";


interface TopMenyProps {
    title: string;
    soccer_leauge: string;
}

export const TopMenuMobile: React.FunctionComponent<TopMenyProps> = (props) => {
    const menuNameOpen = "Menu";
    const menuNameClosed = "Close";
    const [ MenuOpen, setMenuOpen ] = useState(false);
    const fpl = "FPL";
    const eliteserien = "Eliteserien";
    function toggleMenu() {
        setMenuOpen(wasOpened => !wasOpened);
        store.dispatch({type: "isMenuOpen", payload: !MenuOpen })
    }

    function updateSoccerLeague(soccer_league: string) {
        store.dispatch({type: "league_type", payload: soccer_league});
    }

    console.log(store.getState());

    let league_type = store.getState()?.league_type;

    return <>
    <div className="top-menu-mobile">
        <div className="fpl-linear-gradient-color-darker">
            <div className="top-menu-container">
                <div className="header-title">
                    { props.title}
                </div>
                <div className="header-menu-section">
                    <div className="top-menu-mobile-circle-container">
                        { league_type == eliteserien && <Link className="circle-link fpl" onClick={() => updateSoccerLeague(fpl)} to="/fixture-planner/"></Link> }
                        { league_type == fpl && <Link className="circle-link eliteserien" onClick={() => updateSoccerLeague(eliteserien)} to="/fixture-planner-eliteserien/"></Link> }
                    </div>
                    <div onClick={ () => toggleMenu() } className="header-menu-text">
                        { !MenuOpen ? menuNameOpen : menuNameClosed }
                    </div>
                    <div onClick={ () => toggleMenu() } className="header-menu-icon">
                    { !MenuOpen ? <MenuIcon /> : <CloseIcon /> }
                    </div>
                </div>
            </div>
        </div>
        { MenuOpen && 
            <div className="mobile-sub-menu">
                <nav className="mobile-sub-menu-container">
                    <ul>
                        { league_type == eliteserien && <>
                            {/* <h2>Fixture Planning</h2> */}
                            <li className="sub-menu-item">
                                {/* <HomeIcon /> */}
                                <a href="../../../fixture-planner-eliteserien/fdr-planner/">FDR Planner</a>
                            </li>
                            <li className="sub-menu-item">
                                {/* <SportsSoccerIcon /> */}
                                <a href="../../../fixture-planner-eliteserien/rotation-planner/">Rotation Planner</a>
                            </li>
                            <li className="sub-menu-item">
                                {/* <BarChartIcon /> */}
                                <a href="../../../fixture-planner-eliteserien/periode-planner/">Periode Planner</a>
                            </li>
                            {/* <h2>Statistics</h2> */}
                            <li className="sub-menu-item">
                                <a href="../../../statistics/player-ownership/">Player Ownership</a>
                            </li>
                            </>
                        }   

                        { league_type == fpl && <>
                            <li className="sub-menu-item">
                                {/* <HomeIcon /> */}
                                <a href="../../../fixture-planner/fdr-planner/">FDR Planner</a>
                            </li>
                            <li className="sub-menu-item">
                                {/* <SportsSoccerIcon /> */}
                                <a href="../../../fixture-planner/rotation-planner/">Rotation Planner</a>
                            </li>
                            <li className="sub-menu-item">
                                {/* <BarChartIcon /> */}
                                <a href="../../../fixture-planner/periode-planner/">Periode Planner</a>
                            </li></>
                        }
                    </ul>
            </nav>
        </div>
        }
    </div>
    </>

};

export default TopMenuMobile;