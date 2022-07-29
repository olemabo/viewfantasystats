import React, { FunctionComponent, useEffect, useState } from "react"; // this must be here
import TopMenu from "../topMenu/topMenu";
import Footer from "../footer/footer";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { store, persistor} from "../../../store/index";
import { useSelector } from 'react-redux';
import FixturePlanner from "../../FPL/fixturePlanner/fixturePlanner";
import RotationPlanner from "../../FPL/rotationPlanner/rotationPlanner";
import PeriodePlanner from "../../FPL/periodePlanner/periodePlanner";
import EliteserienFixturePlanner from "../../Eliteserien/eliteserienFixturePlanner/eliteserienFixturePlanner";
import EliteserienRotationPlanner from "../../Eliteserien/rotationPlanner/eliteserienRotationPlanner";
import EliteserienPeriodePlanner from "../../Eliteserien/periodePlanner/eliteserienPeriodePlanner";
import PlayerOwnership from "../../Eliteserien/playerOwnership/playerOwnership";

export const DefaultLayout = () => {
    const [ isAnyMenuOpen, setIsMenuOpen ] = useState(false);
    const [ langagueContent, setLangaugeContent ] = useState(store.getState().language);
    const isMenuOpenFromRedux = useSelector((state: any) => state?.isMenuOpen);
    const langaugeContentFromRedux = useSelector((state: any) => state?.language);

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
                            <Route path="/" element={<FixturePlanner content={langagueContent} />}></Route>
                            <Route path="/fixture-planner/" element={<FixturePlanner content={langagueContent} />} />
                            <Route path="/fixture-planner/fdr-planner/" element={<FixturePlanner content={langagueContent} />} />
                            <Route path="/fixture-planner/periode-planner/" element={<PeriodePlanner content={langagueContent} />} />
                            <Route path="/fixture-planner/rotation-planner/" element={<RotationPlanner content={langagueContent} />} />
                            <Route path="/fixture-planner-eliteserien/" element={<EliteserienFixturePlanner content={langagueContent} />} />
                            <Route path="/fixture-planner-eliteserien/fdr-planner/" element={<EliteserienFixturePlanner content={langagueContent} />} />
                            <Route path="/fixture-planner-eliteserien/rotation-planner/" element={<EliteserienRotationPlanner content={langagueContent} />} />
                            <Route path="/fixture-planner-eliteserien/periode-planner/" element={<EliteserienPeriodePlanner content={langagueContent} />} />
                            <Route path="/statistics/player-ownership/" element={<PlayerOwnership content={langagueContent} />} />
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
