// "use client"

// import { LanguageSelector, LeagueSelector } from "../../shared/league-and-language-selector/league-and-language-selector";
// import { LeagueType, PageProps, en, esf, fpl, no } from "../../../models/shared/PageProps";
// // import { languageCodeSelector } from "../../../store/selectors/languageCodeSelector";
// // import { leagueTypeSelector } from "../../../store/selectors/leagueTypeSelector";
// // import { LanguageCodeActions } from "../../../store/states/languageCodeStore";
// // import { IsMenuOpenActions } from "../../../store/states/isMenuOpenStore";
// // import { LeagueTypeActions } from "../../../store/states/leagueTypeStore";
// // import { languageActions } from "../../../store/states/languageStore";
// // import * as urls from '../../../staticUrls/internalUrls';
// import React, { useEffect, useState } from "react";
// import CloseIcon from '@mui/icons-material/Close';
// import MenuIcon from '@mui/icons-material/Menu';
// // import { useAppDispatch } from "../../../store";
// // import { useSelector } from "react-redux";
// import "./TopMenuMobile.scss";
// import TopMenuMobileSection from "./top-menu-mobile-section";
// import { useTranslations } from "next-intl";
// import { Locale } from "@/i18n/routing";
// import { usePathname } from "next/navigation";


// export const TopMenuMobile: React.FunctionComponent<PageProps & { title: string}> = ({
//     title,
//     leagueType
// }) => {
//     const t = useTranslations('General');
//     const pathname = usePathname();
    
//     // const dispatch = useAppDispatch();

//     // function toggleMenu() {
//     //     setMenuOpen(wasOpened => !wasOpened);
//     //     dispatch(IsMenuOpenActions.setisMenuOpen(!MenuOpen));
//     // }
    
//     // function updateSoccerLeague(leagueType: LeagueType) {
//     //     dispatch(LeagueTypeActions.setLeagueType(leagueType));
//     // }
    
//     // function closeMenu() {
//     //     dispatch(IsMenuOpenActions.setisMenuOpen(false));
//     // }
    
//     // const [ language, setLanguage] = useState(useSelector(languageCodeSelector));
//     // const [ MenuOpen, setMenuOpen ] = useState(false);
    
//     // useEffect(() => {
//     //     setMenuOpen(false);
//     //     dispatch(IsMenuOpenActions.setisMenuOpen(false));
//     // }, [])
    
//     // function updateLanguage(lang: string) {
//     //     const currentLanguage = lang === en ? en : no;
//     //     const currentContent = lang === en ? content_json.English : content_json.Norwegian;
        
//     //     dispatch(languageActions.setLanguage(currentContent));
//     //     dispatch(LanguageCodeActions.setLanguageCode(currentLanguage));

//     //     setLanguage(currentLanguage);
//     // }
    
    
//     const redirectedPathname = (locale: Locale) => {
//         if (!pathname) return "/";
//         const segments = pathname.split("/");
//         segments[1] = locale;
//         return segments.join("/");
//       };

//     return <>
//     <div className="top-menu-mobile">
//         <div className="fpl-linear-gradient-color-darker">
//             <div className="top-menu-container">
//                 <div className="header-title">
//                     { title}
//                 </div>
//                 <div className="header-menu-section">
//                     <div onClick={ () => toggleMenu() } className="header-menu-text">
//                         { !MenuOpen ? t("menu") : t("close") }
//                     </div>
//                     <div onClick={ () => toggleMenu() } className="header-menu-icon">
//                     { !MenuOpen ? <MenuIcon /> : <CloseIcon /> }
//                     </div>
//                 </div>
//             </div>
//         </div>
//         { MenuOpen && 
//             <div className="mobile-sub-menu">
//                 <div className="top-menu-mobile-circle-container">
//                     <div className="top-navbar-mobile-langauge-container">
//                         { language == no && 
//                             <LanguageSelector 
//                                 text='English'
//                                 onclick={() => updateLanguage(en)} 
//                             />
//                         }
//                         { language == en && 
//                             <LanguageSelector 
//                                 text='Norsk'
//                                 onclick={() => updateLanguage(no)}  
//                             />
//                         }
//                     </div>
//                     <div>
//                         { leagueType === esf && 
//                             <LeagueSelector 
//                                 text='FPL'
//                                 url={`/${language}/premier-league`}
//                             />
//                         }
//                         { leagueType === fpl && 
//                             <LeagueSelector 
//                                 text='ESF'
//                                 url={`/${language}/eliteserien`}    />
//                         }
//                     </div>
//                 </div>
//                 <nav className="mobile-sub-menu-container">
//                     <ul>
//                         <TopMenuMobileSection 
//                             leagueType={leagueType}
//                             closeMenu={closeMenu}
//                         />
//                     </ul>
//             </nav>
//         </div>
//         }
//     </div>
//     </>
// };

// export default TopMenuMobile;