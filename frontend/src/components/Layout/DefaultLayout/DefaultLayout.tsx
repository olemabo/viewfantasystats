import React, { useEffect, useState } from "react"; // this must be here
import TopMenu from "../TopMenu/TopMenu";
import Footer from "../Footer/Footer";
import { Routes, Route } from "react-router-dom";
import { store } from "../../../store/index";
import { useSelector } from 'react-redux';
import { FixturePlanningType } from '../../../models/fixturePlanning/FixturePlanningType';
import { content_json } from "../../../language/languageContent";


import PlayerOwnership from "../../Pages/PlayerOwnership/PlayerOwnership";
import SearchUserNamePage from '../../Pages/SearchUserName/SearchUserName';
import RankStatisticsPage from '../../Pages/RankStatistics/RankStatistics';
import FixturePlannerPage from '../../Pages/FixturePlanner/FixturePlanner';
import RotationPlannerPage from '../../Pages/RotationPlanner/RotationPlanner';
import FixturePlannerEliteserienPage from '../../Pages/FixturePlannerEliteserien/FixturePlannerEliteserien';
import RotationPlannerEliteserienPage from '../../Pages/RotationPlannerEliteserien/RotationPlannerEliteserien';
import LeagueFrontPage from "../../Pages/LeagueFrontPage/LeagueFrontPage";
import PlayerStatisticsPage from "../../Pages/PlayerStatistics/PlayerStatistics";
import LiveFixturesPage from "../../Pages/LiveFixtures/LiveFixtures";
import * as urls from '../../../internal_urls/internalUrls';

export const DefaultLayout = () => {
    const [ isAnyMenuOpen, setIsMenuOpen ] = useState(false);
    const [ langagueContent, setLangaugeContent ] = useState(store.getState().language);
    const isMenuOpenFromRedux = useSelector((state: any) => state?.isMenuOpen);
    const langaugeContentFromRedux = useSelector((state: any) => state?.language);
    const leagueTypeFromRedux = store.getState()?.league_type;
    const league_type = useSelector((state: any) => state?.league_type);

    const [ doneFirstLoading, setDoneFirstLoading ] = useState(false);
    const fpl = "FPL";
    const eliteserien = "Eliteserien";

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
        if (store?.getState()?.language_code == "en") {
            store.dispatch({type: "language", payload: content_json.English});
            setDoneFirstLoading(true);
        }
        else {
            store.dispatch({type: "language", payload: content_json.Norwegian});
            setDoneFirstLoading(true);
        }
    }, [])

    console.log(leagueTypeFromRedux, league_type)


    return <> { doneFirstLoading && 
    <div>
        <TopMenu content={langagueContent} />
        { (!isAnyMenuOpen) && 
        <><div className="showcase">
        </div>
        <div className={"front-page-bottom " + league_type}>
            <div className="start-container">
              <div className="content-container">
                  <div className="col-sm-10 max-width">
                        <Routes>
                            <Route path="/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.FDR} league_type={fpl} content={langagueContent} />} />
                            {/* <Route path="/" element={<PlayerOwnership top_x_managers_default={1000} league_type={eliteserien} content={langagueContent} />} /> */}

                            {/* <Route path="/premier-league/" element={<LeagueFrontPage league_type={fpl} content={langagueContent} />} /> */}
                            <Route path="/premier-league/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.FDR} league_type={fpl} content={langagueContent} />} />
                            <Route path="/premier-league/fdr-planner/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.FDR} league_type={fpl} content={langagueContent} />} />
                            <Route path="/premier-league/periode-planner/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.Periode} league_type={fpl} content={langagueContent} />} />
                            <Route path="/premier-league/rotation-planner/" element={<RotationPlannerPage content={langagueContent} />} />
                            <Route path="/premier-league/fixture-planner/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.FDR} league_type={fpl} content={langagueContent} />} />
                            <Route path="/premier-league/player-statistics/" element={<PlayerStatisticsPage league_type={fpl} content={langagueContent} />} />
                            <Route path="/premier-league/player-ownership/" element={<PlayerOwnership top_x_managers_default={10000} league_type={fpl} content={langagueContent} />} />

                            {/* <Route path="/eliteserien/" element={<LeagueFrontPage league_type={eliteserien} content={langagueContent} />} /> */}
                            <Route path="/eliteserien/" element={<PlayerOwnership top_x_managers_default={1000} league_type={eliteserien} content={langagueContent} />} />
                            <Route path="/eliteserien/rotation-planner/" element={<RotationPlannerEliteserienPage content={langagueContent} />} />
                            <Route path="/eliteserien/periode-planner/" element={<FixturePlannerEliteserienPage fixture_planning_type={FixturePlanningType.Periode} league_type={eliteserien} content={langagueContent} />} />                            
                            <Route path="/eliteserien/fdr-planner/" element={<FixturePlannerEliteserienPage fixture_planning_type={FixturePlanningType.FDR} league_type={eliteserien} content={langagueContent} />} />
                            <Route path="/eliteserien/player-ownership/" element={<PlayerOwnership top_x_managers_default={1000} league_type={eliteserien} content={langagueContent} />} />
                            <Route path="/eliteserien/search-user-names/" element={<SearchUserNamePage content={langagueContent} />} />
                            <Route path="/eliteserien/rank-statistics/" element={<RankStatisticsPage content={langagueContent} />} />
                            <Route path={urls.url_eliteserien_live_fixtures} element={<LiveFixturesPage league_type={eliteserien} content={langagueContent} />} />
                                                        
                            
                            <Route path="/statistics/player-ownership/" element={<PlayerOwnership top_x_managers_default={1000} league_type={eliteserien} content={langagueContent} />} />
                        

                        </Routes>
                  </div>
              </div>
            </div>
        <Footer content={langagueContent}/>
        </div></>}
        { isAnyMenuOpen && (
            <div className="footer-under-menu">
                <Footer content={langagueContent}/>
            </div>
        )}
    </div>
    }</>
};
