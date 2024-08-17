import { LanguageSelector, LeagueSelector } from "../../Shared/LeagueAndLanguageSelector/LeagueAndLanguageSelector";
import { LeagueType, PageProps, en, esf, fpl, no } from "../../../models/shared/PageProps";
import { languageCodeSelector } from "../../../store/selectors/languageCodeSelector";
import { leagueTypeSelector } from "../../../store/selectors/leagueTypeSelector";
import { LanguageCodeActions } from "../../../store/states/languageCodeStore";
import { IsMenuOpenActions } from "../../../store/states/isMenuOpenStore";
import { LeagueTypeActions } from "../../../store/states/leagueTypeStore";
import { languageActions } from "../../../store/states/languageStore";
import { content_json } from "../../../language/languageContent";
import * as urls from '../../../staticUrls/internalUrls';
import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import "./TopMenuMobile.scss";
import TopMenuMobileSection from "./TopMenuMobileSection";
import { leagueUrls } from "../../../staticUrls/menuUrls";


export const TopMenuMobile: React.FunctionComponent<PageProps & { title: string}> = ({
    languageContent, title
}) => {
    const dispatch = useAppDispatch();

    function toggleMenu() {
        setMenuOpen(wasOpened => !wasOpened);
        dispatch(IsMenuOpenActions.setisMenuOpen(!MenuOpen));
    }
    
    function updateSoccerLeague(leagueType: LeagueType) {
        dispatch(LeagueTypeActions.setLeagueType(leagueType));
    }
    
    function closeMenu() {
        dispatch(IsMenuOpenActions.setisMenuOpen(false));
    }
    
    const [ language, setLanguage] = useState(useSelector(languageCodeSelector));
    const [ MenuOpen, setMenuOpen ] = useState(false);
    
    useEffect(() => {
        setMenuOpen(false);
        dispatch(IsMenuOpenActions.setisMenuOpen(false));
    }, [])
    
    function updateLanguage(lang: string) {
        const currentLanguage = lang === en ? en : no;
        const currentContent = lang === en ? content_json.English : content_json.Norwegian;
        
        dispatch(languageActions.setLanguage(currentContent));
        dispatch(LanguageCodeActions.setLanguageCode(currentLanguage));

        setLanguage(currentLanguage);
    }
    
    const leagueType = useSelector(leagueTypeSelector);

    return <>
    <div className="top-menu-mobile">
        <div className="fpl-linear-gradient-color-darker">
            <div className="top-menu-container">
                <div className="header-title">
                    { title}
                </div>
                <div className="header-menu-section">
                    <div onClick={ () => toggleMenu() } className="header-menu-text">
                        { !MenuOpen ? languageContent.General.menu : languageContent.General.close }
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
                        { leagueType === esf && 
                            <LeagueSelector 
                                text='FPL'
                                onclick={() => updateSoccerLeague(fpl)}
                                url={"/" + urls.url_premier_league}  />
                        }
                        { leagueType === fpl && 
                            <LeagueSelector 
                                text='ESF'
                                onclick={() => updateSoccerLeague(esf)}
                                url={"/" + urls.url_eliteserien}  />
                        }
                    </div>
                </div>
                <nav className="mobile-sub-menu-container">
                    <ul>
                        { leagueType == esf && 
                            <TopMenuMobileSection 
                                sectionUrls={leagueUrls.urlsEsf}
                                languageContent={languageContent}
                                closeMenu={closeMenu}
                            />
                        }   

                        { leagueType == fpl && 
                            <TopMenuMobileSection 
                                sectionUrls={leagueUrls.urlsFpl}
                                languageContent={languageContent} 
                                closeMenu={closeMenu}
                            />
                        }
                    </ul>
            </nav>
        </div>
        }
    </div>
    </>
};

export default TopMenuMobile;