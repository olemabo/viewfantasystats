"use server"

import { LanguageSelector, LeagueSelector } from "../../shared/LeagueAndLanguageSelector/LeagueAndLanguageSelector";
import { fpl, esf, no, en, LeagueType } from '../../../models/shared/PageProps';
import { useWindowDimensions } from "../../../utils/useWindowDimensions";
import { TopMenuMobile } from '../topMenuMobile/TopMenuMobile';
import "./top-menu.css";
import MenuContainer from "./top-menu-section";
import { LeagueProps } from "@/types/league";
import Link from "next/link";
import LocaleSwitcher from "./local-switcher";
import { LanguageProps } from "@/types/language";

type TopMenuProps = LeagueProps & LanguageProps;

export default async function TopMenu({leagueType, language }: TopMenuProps) {
    // const { width } = useWindowDimensions();
    const mobileMaxSize = 800;

    // useEffect(() => {
    //     if (width > mobileMaxSize && leagueType) {
    //         dispatch(IsMenuOpenActions.setisMenuOpen(false));
    //     }
    // }, [width, leagueType, dispatch]);
    
    return <>
    <header className={`top-menu ${leagueType}`}>
        {/* { width > mobileMaxSize &&  */}
            <div className={"front-page-top-sky " + leagueType}>
                <div className="top-navbar container">
                    <div className="top-navbar-language-container">
                        <LocaleSwitcher language={language} />
                    </div>
                    {/* <div className="top-navbar-container">
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
                    </div> */}
                </div>
                <div className="navbar">
                    <div className="nav-container">
                        <h1 className="logo">
                            <Link href={`/${(leagueType === fpl ? "no/premier-league" : "no/elitserien")}`}>
                                <div>{"Fantasy Stats "}</div>
                                { "" +  (leagueType === fpl ? "Premier League" : "Eliteserien")}
                            </Link>
                        </h1>
                        <MenuContainer leagueType={leagueType} />
                    </div>
                </div>
          </div>
      {/* } */}
      {/* { width <= mobileMaxSize && 
        <TopMenuMobile 
            title={leagueType == fpl ? languageContent.General.premier_league : languageContent.General.eliteserien} 
            leagueType={leagueType} 
            languageContent={languageContent}
        />
      } */}
    </header>
    </>
};