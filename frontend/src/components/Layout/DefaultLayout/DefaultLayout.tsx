import { content_json } from "../../../language/languageContent";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import TopMenu from "../TopMenu/TopMenu";
import Footer from "../Footer/Footer";

import RotationPlannerEliteserienPage from '../../Pages/RotationPlannerEliteserien/RotationPlannerEliteserien';
import FixturePlannerEliteserienPage from '../../Pages/FixturePlannerEliteserien/FixturePlannerEliteserien';
import PlayerStatisticsPage from "../../Pages/PlayerStatistics/PlayerStatistics";
import RotationPlannerPage from '../../Pages/RotationPlanner/RotationPlanner';
import SearchUserNamePage from '../../Pages/SearchUserName/SearchUserName';
import RankStatisticsPage from '../../Pages/RankStatistics/RankStatistics';
import FixturePlannerPage from '../../Pages/FixturePlanner/FixturePlanner';
import PlayerOwnership from "../../Pages/PlayerOwnership/PlayerOwnership";
import PriceChange from "../../Pages/PriceChange/PriceChange";
import LeagueFrontPage from "../../Pages/LeagueFrontPage/LeagueFrontPage";
import LiveFixturesPage from "../../Pages/LiveFixtures/LiveFixtures";
import { en, esf, fdrPeriode, fdrPlanner, fdrRotation, fpl } from "../../../models/shared/PageProps";
import * as urls from '../../../static_urls/internalUrls';
import './DefaultLayout.scss';
import FixturePlannerTeamIdPage from '../../Pages/FixturePlannerTeamID/FixturePlannerTeamID';
import { languageCodeSelector } from '../../../store/selectors/languageCodeSelector';
import { useAppDispatch } from '../../../store';
import { languageActions } from '../../../store/states/languageStore';
import { languageSelector } from '../../../store/selectors/languageSelector';
import { isMenuOpenSelector } from '../../../store/selectors/isMenuOpenSelector';
import { leagueTypeSelector } from '../../../store/selectors/leagueTypeSelector';

export const DefaultLayout = () => {
    const [ langagueContent, setLangaugeContent ] = useState(useSelector(languageSelector));
    const [ doneFirstLoading, setDoneFirstLoading ] = useState(false);
    const [ isAnyMenuOpen, setIsMenuOpen ] = useState(false);
    
    const isMenuOpenFromRedux = useSelector(isMenuOpenSelector);
    const langaugeContentFromRedux = useSelector(languageSelector);
    const leagueType = useSelector(leagueTypeSelector);
    const languageCodeFromRedux = useSelector(languageCodeSelector);
    const dispatch = useAppDispatch();

    // useEffect will listen if isMenuOpen property from redux changes 
    useEffect(() => {
        let isCancelled : boolean = false;
        if (isMenuOpenFromRedux != null) {
            setIsMenuOpen(isMenuOpenFromRedux);
        }
        return () => { isCancelled = true }
    }, [isMenuOpenFromRedux]);

    // must be here
    useEffect(() => {
        if (langaugeContentFromRedux != null) {
            setLangaugeContent(langaugeContentFromRedux);
        }
    }, [langaugeContentFromRedux]);

    useEffect(() => {
        const contentLanguage = languageCodeFromRedux === en ? content_json.English : content_json.Norwegian;
        dispatch(languageActions.setLanguage(contentLanguage));

        setDoneFirstLoading(true);
    }, [languageCodeFromRedux])

    return <> 
    { doneFirstLoading && <>
        <TopMenu languageContent={langagueContent} />
        { !isAnyMenuOpen && <>
            <main className={leagueType}>
                <div className="start-container">
                    <div className="content-container">
                        <Routes>
                            <Route path="/" element={<FixturePlannerPage fixturePlanningType={fdrPlanner} leagueType={fpl} languageContent={langagueContent} />} />

                            <Route path={urls.url_premier_league} element={<FixturePlannerPage leagueType={fpl} fixturePlanningType={fdrPlanner} languageContent={langagueContent} />} />
                            <Route path={urls.url_premier_league_fdr_planner} element={<FixturePlannerPage leagueType={fpl} fixturePlanningType={fdrPlanner} languageContent={langagueContent} />} />
                            <Route path={urls.url_premier_league_fdr_planner_team_id} element={<FixturePlannerTeamIdPage leagueType={fpl} languageContent={langagueContent} />} />
                            <Route path={urls.url_premier_league_periode_planner} element={<FixturePlannerPage leagueType={fpl} fixturePlanningType={fdrPeriode} languageContent={langagueContent} />} />
                            <Route path={urls.url_premier_league_rotation_planner} element={<RotationPlannerPage leagueType={fpl} languageContent={langagueContent} fixturePlanningType={fdrRotation} />} />
                            <Route path={urls.url_premier_league_player_ownership} element={<PlayerOwnership leagueType={fpl} topXManagersDefault={10000}  languageContent={langagueContent} />} />
                            <Route path={urls.url_premier_league_player_statistics} element={<PlayerStatisticsPage leagueType={fpl} languageContent={langagueContent} />} />
                            <Route path={urls.url_premier_league_live_fixtures} element={<LiveFixturesPage leagueType={fpl} languageContent={langagueContent} />} />

                            <Route path={urls.url_eliteserien} element={<PlayerOwnership topXManagersDefault={1000} leagueType={esf} languageContent={langagueContent} />} />
                            <Route path={urls.url_eliteserien_rotation_planner} element={<RotationPlannerEliteserienPage leagueType={esf} languageContent={langagueContent} fixturePlanningType={fdrRotation} />} />
                            <Route path={urls.url_eliteserien_periode_planner} element={<FixturePlannerEliteserienPage leagueType={esf} fixturePlanningType={fdrPeriode} languageContent={langagueContent} />} />                            
                            <Route path={urls.url_eliteserien_fdr_planner} element={<FixturePlannerEliteserienPage leagueType={esf} fixturePlanningType={fdrPlanner} languageContent={langagueContent} />} />
                            <Route path={urls.url_eliteserien_fdr_planner_team_id} element={<FixturePlannerTeamIdPage leagueType={esf} languageContent={langagueContent} />} />
                            <Route path={urls.url_eliteserien_player_ownership} element={<PlayerOwnership leagueType={esf} topXManagersDefault={1000} languageContent={langagueContent} />} />
                            <Route path={urls.url_eliteserien_search_user_name} element={<SearchUserNamePage leagueType={esf} languageContent={langagueContent} />} />
                            <Route path={urls.url_eliteserien_player_statistics} element={<PlayerStatisticsPage leagueType={esf} languageContent={langagueContent} />} />
                            <Route path={urls.url_eliteserien_rank_statistics} element={<RankStatisticsPage leagueType={esf} languageContent={langagueContent} />} />
                            <Route path={urls.url_eliteserien_live_fixtures} element={<LiveFixturesPage leagueType={esf} languageContent={langagueContent} />} />
                            <Route path={urls.url_eliteserien_player_ownership} element={<PlayerOwnership topXManagersDefault={1000} leagueType={esf} languageContent={langagueContent} />} />                  
                            <Route path={urls.url_eliteserien_price_change} element={<PriceChange leagueType={esf} languageContent={langagueContent} />} />                  
                        </Routes>
                    </div>
                </div>
            </main> 
            <Footer languageContent={langagueContent}/>
            </>}
        </>
    }
    </>
};
