import { FixturePlanningType } from '../../../models/fixturePlanning/FixturePlanningType';
import { content_json } from "../../../language/languageContent";
import React, { useEffect, useState } from "react"; // this must be here
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
import LeagueFrontPage from "../../Pages/LeagueFrontPage/LeagueFrontPage";
import LiveFixturesPage from "../../Pages/LiveFixtures/LiveFixtures";
import { en, esf, fpl } from "../../../models/shared/PageProps";
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
    const league_type = useSelector(leagueTypeSelector);
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
        <TopMenu content={langagueContent} />
        { !isAnyMenuOpen && <>
            <main className={league_type}>
                <div className="start-container">
                    <div className="content-container">
                        <Routes>
                            <Route path="/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.FDR} league_type={fpl} content={langagueContent} />} />

                            <Route path={urls.url_premier_league} element={<FixturePlannerPage league_type={fpl} fixture_planning_type={FixturePlanningType.FDR} content={langagueContent} />} />
                            <Route path={urls.url_premier_league_fdr_planner} element={<FixturePlannerPage league_type={fpl} fixture_planning_type={FixturePlanningType.FDR} content={langagueContent} />} />
                            <Route path={urls.url_premier_league_fdr_planner_team_id} element={<FixturePlannerTeamIdPage league_type={fpl} content={langagueContent} />} />
                            <Route path={urls.url_premier_league_periode_planner} element={<FixturePlannerPage league_type={fpl} fixture_planning_type={FixturePlanningType.Periode} content={langagueContent} />} />
                            <Route path={urls.url_premier_league_rotation_planner} element={<RotationPlannerPage league_type={fpl} content={langagueContent} />} />
                            <Route path={urls.url_premier_league_player_ownership} element={<PlayerOwnership league_type={fpl} top_x_managers_default={10000}  content={langagueContent} />} />
                            <Route path={urls.url_premier_league_player_statistics} element={<PlayerStatisticsPage league_type={fpl} content={langagueContent} />} />
                            <Route path={urls.url_premier_league_live_fixtures} element={<LiveFixturesPage league_type={fpl} content={langagueContent} />} />

                            <Route path={urls.url_eliteserien} element={<PlayerOwnership top_x_managers_default={1000} league_type={esf} content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_rotation_planner} element={<RotationPlannerEliteserienPage league_type={esf} content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_periode_planner} element={<FixturePlannerEliteserienPage league_type={esf} fixture_planning_type={FixturePlanningType.Periode} content={langagueContent} />} />                            
                            <Route path={urls.url_eliteserien_fdr_planner} element={<FixturePlannerEliteserienPage league_type={esf} fixture_planning_type={FixturePlanningType.FDR} content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_fdr_planner_team_id} element={<FixturePlannerTeamIdPage league_type={esf} content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_player_ownership} element={<PlayerOwnership league_type={esf} top_x_managers_default={1000} content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_search_user_name} element={<SearchUserNamePage league_type={esf} content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_player_statistics} element={<PlayerStatisticsPage league_type={esf} content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_rank_statistics} element={<RankStatisticsPage league_type={esf} content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_live_fixtures} element={<LiveFixturesPage league_type={esf} content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_player_ownership} element={<PlayerOwnership top_x_managers_default={1000} league_type={esf} content={langagueContent} />} />                  
                        </Routes>
                    </div>
                </div>
            </main> 
            <Footer content={langagueContent}/>
            </>}
        </>
    }
    </>
};
