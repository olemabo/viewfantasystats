"use client"

import { LeagueSelector } from "../../shared/league-and-language-selector/league-and-language-selector";
import { fpl, esf } from '../../../models/shared/PageProps';
import "./top-menu-2.css";
import MenuContainer from "./top-menu-section";
import { LeagueProps } from "@/types/league";
import Link from "next/link";
import LocaleSwitcher from "./local-switcher";
import { LanguageProps } from "@/types/language";
import { useTranslations } from "next-intl";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import TopMenuMobileSection from "../topMenuMobile/top-menu-mobile-section";

type TopMenuProps = LeagueProps & LanguageProps;

export default function TopMenu({leagueType, language }: TopMenuProps) {
    const t = useTranslations('General');
    const [ isMobileMenuOpen, setMobileMenuOpen ] = useState(false);

    function toggleMenu() {
        setMobileMenuOpen(wasOpened => {
            const willOpen = !wasOpened;
            if (willOpen) {
            document.body.classList.add("mobile-menu-open");
            } else {
            document.body.classList.remove("mobile-menu-open");
            }
            return willOpen;
        });
    }

    return <>
    <header className={`top-menu ${leagueType}`}>
        <div className={"front-page-top-sky " + leagueType}>
            <div className="menu-container container">
                
                <div className="left-container">
                    <div className="logos">
                        <Link href={`/${(leagueType === fpl ? "no/premier-league" : "no/elitserien")}`}>
                            <div className="logo-full">{"Fantasy Stats "}</div>
                            { "" +  (leagueType === fpl ? "Premier League" : "Eliteserien")}
                        </Link>
                    </div>
                </div>

                <div className="right-container">
                    <div className="top-area">
                        <div className="top-navbar-language-container">
                            <LocaleSwitcher language={language} />
                        </div>
                        <div className="top-navbar-container">
                            { leagueType === esf && 
                                <LeagueSelector 
                                    text={fpl.toUpperCase()}
                                    url={`/${language}/premier-league`} 
                                /> }
                            { leagueType === fpl && 
                                <LeagueSelector 
                                    text={esf.toUpperCase()}
                                    url={`/${language}/eliteserien`}  
                                /> }
                        </div>
                    </div>
                    <div className="hamburger-menu">
                        <button onClick={toggleMenu} className="header-menu-text">
                            { !isMobileMenuOpen ? 
                            <>
                                <span>{t("menu")}</span>
                                <MenuIcon />
                            </> : 
                            <>
                                <span>{t("close")}</span>
                                <CloseIcon />
                            </>
                            }
                        </button>
                    </div>
                    <div className="bottom-area">
                        <MenuContainer leagueType={leagueType} />
                    </div>
                </div>

            </div>
        </div>
        { isMobileMenuOpen && 
            <div className="mobile-sub-menu-container">
                <div className="language-and-league-selectors">
                    <div className="top-navbar-language-container">
                        <LocaleSwitcher language={language} />
                    </div>
                    <div className="top-navbar-container">
                        { leagueType === esf && 
                            <LeagueSelector 
                                text={fpl.toUpperCase()}
                                url={`/${language}/premier-league`} 
                            /> }
                        { leagueType === fpl && 
                            <LeagueSelector 
                                text={esf.toUpperCase()}
                                url={`/${language}/eliteserien`}  
                            /> }
                    </div>
                </div>
                <TopMenuMobileSection closeMenu={() => (setMobileMenuOpen(false))} leagueType={leagueType} />
            </div>
        }
    </header>
    </>
};