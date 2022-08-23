import React, { useEffect, useState } from "react"; // this must be here
import TopMenu from "../TopMenu/TopMenu";
import Footer from "../Footer/Footer";
import { Routes, Route } from "react-router-dom";
import { store } from "../../../store/index";
import { useSelector } from 'react-redux';
import { FixturePlanningType } from '../../../models/fixturePlanning/FixturePlanningType';


import PlayerOwnership from "../../Pages/PlayerOwnership/PlayerOwnership";
import SearchUserNamePage from '../../Pages/SearchUserName/SearchUserName';
import RankStatisticsPage from '../../Pages/RankStatistics/RankStatistics';
import FixturePlannerPage from '../../Pages/FixturePlanner/FixturePlanner';
import RotationPlannerPage from '../../Pages/RotationPlanner/RotationPlanner';
import FixturePlannerEliteserienPage from '../../Pages/FixturePlannerEliteserien/FixturePlannerEliteserien';
import RotationPlannerEliteserienPage from '../../Pages/RotationPlannerEliteserien/RotationPlannerEliteserien';


export const DefaultLayout = () => {
    const [ isAnyMenuOpen, setIsMenuOpen ] = useState(false);
    const [ langagueContent, setLangaugeContent ] = useState(store.getState().language);
    const isMenuOpenFromRedux = useSelector((state: any) => state?.isMenuOpen);
    const langaugeContentFromRedux = useSelector((state: any) => state?.language);
    const leagueTypeFromRedux = store.getState()?.league_type;
    
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

    return <>
    <div>
        <TopMenu content={langagueContent} />
        { (!isAnyMenuOpen) && 
        <><div className="showcase">
        </div>
        <div className="front-page-bottom">
            <div className="start-container">
              <div className="content-container">
                  <div className="col-sm-10 max-width">
                        <Routes>
                            {/* <Route path="/" element={<FixturePlanner league_type={fpl} content={langagueContent} />}></Route> */}
                            {/* <Route path="/fixture-planner/" element={<FixturePlanner league_type={fpl} content={langagueContent} />} /> */}
                            {/* <Route path="/fixture-planner/fdr-planner/" element={<FixturePlanner league_type={fpl} content={langagueContent} />} /> */}
                            {/* <Route path="/fixture-planner/periode-planner/" element={<PeriodePlanner content={langagueContent} />} /> */}
                            <Route path="/fixture-planner/rotation-planner/" element={<RotationPlannerPage content={langagueContent} />} />
                            <Route path="/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.FDR} league_type={fpl} content={langagueContent} />}></Route>
                            <Route path="/fixture-planner/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.FDR} league_type={fpl} content={langagueContent} />} />
                            <Route path="/fixture-planner/fdr-planner/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.FDR} league_type={fpl} content={langagueContent} />} />
                            <Route path="/fixture-planner/periode-planner/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.Periode} league_type={fpl} content={langagueContent} />} />
                            {/* <Route path="/fixture-planner/rotation-planner/" element={<FixturePlannerPage fixture_planning_type={FixturePlanningType.Rotation} league_type={fpl} content={langagueContent} />} /> */}
                            <Route path="/fixture-planner-eliteserien/" element={<FixturePlannerEliteserienPage fixture_planning_type={FixturePlanningType.FDR} league_type={eliteserien} content={langagueContent} />} />
                            <Route path="/fixture-planner-eliteserien/fdr-planner/" element={<FixturePlannerEliteserienPage fixture_planning_type={FixturePlanningType.FDR} league_type={eliteserien} content={langagueContent} />} />
                            <Route path="/fixture-planner-eliteserien/rotation-planner/" element={<RotationPlannerEliteserienPage content={langagueContent} />} />
                            <Route path="/fixture-planner-eliteserien/periode-planner/" element={<FixturePlannerEliteserienPage fixture_planning_type={FixturePlanningType.Periode} league_type={eliteserien} content={langagueContent} />} />
                            <Route path="/statistics/player-ownership/" element={<PlayerOwnership top_x_managers_default={1000} league_type={eliteserien} content={langagueContent} />} />
                            <Route path="/statistics-premier-league/player-ownership/" element={<PlayerOwnership top_x_managers_default={10000} league_type={fpl} content={langagueContent} />} />
                            <Route path="/statistics/search-user-names/" element={<SearchUserNamePage content={langagueContent} />} />
                            <Route path="/statistics/rank-statistics/" element={<RankStatisticsPage content={langagueContent} />} />
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
    </>
};
