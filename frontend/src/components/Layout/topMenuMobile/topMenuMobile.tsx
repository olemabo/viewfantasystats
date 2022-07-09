import React, { useEffect, useState } from "react";
import "./topMenuMobile.scss";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import BarChartIcon from '@material-ui/icons/BarChart';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import store from '../../../store/index';

interface TopMenyProps {
    title: string;
    soccer_leauge: string;
}

export const TopMenuMobile: React.FunctionComponent<TopMenyProps> = (props) => {
    const menuNameOpen = "Menu";
    const menuNameClosed = "Close";
    const [ MenuOpen, setMenuOpen ] = useState(false);

    function toggleMenu() {
        setMenuOpen(wasOpened => !wasOpened);
        store.dispatch({type: "isMenuOpen", payload: !MenuOpen })
    }

    console.log(store.getState());

    return <>
    <div className="top-menu-mobile">
        <div className="fpl-linear-gradient-color-darker">
            <div className="top-menu-container">
                <div className="header-title">
                    { props.title}
                </div>
                <div className="header-menu-section" onClick={ () => toggleMenu() }>
                    <div className="header-menu-text">
                        { !MenuOpen ? menuNameOpen : menuNameClosed }
                    </div>
                    <div className="header-menu-icon">
                    { !MenuOpen ? <MenuIcon /> : <CloseIcon /> }
                    </div>
                </div>
            </div>
        </div>
        { MenuOpen && 
            <div className="mobile-sub-menu">
                <nav className="mobile-sub-menu-container">
                    <ul>
                        <li className="sub-menu-item">
                            <HomeIcon />
                            <a href="../../../">Home</a>
                        </li>
                        <li className="sub-menu-item">
                            <SportsSoccerIcon />
                            <a href="../../../fixture-planner/">Fixture Planning</a>
                        </li>
                        <li className="sub-menu-item">
                            <BarChartIcon />
                            <a href="../../../fixture-planner/">Player Statistics</a>
                        </li>
                    </ul>
            </nav>
        </div>
        }
    </div>
    </>

};

export default TopMenuMobile;