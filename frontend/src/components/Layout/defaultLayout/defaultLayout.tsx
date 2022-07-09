import React, { FunctionComponent, useEffect, useState } from "react"; // this must be here
import TopMenu from "../topMenu/topMenu";
import Footer from "../footer/footer";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import store from "../../../store/index";
import { useSelector } from 'react-redux';
import FixturePlanner from "../../FPL/fixturePlanner/fixturePlanner";
import RotationPlanner from "../../FPL/rotationPlanner/rotationPlanner";
import PeriodePlanner from "../../FPL/periodePlanner/periodePlanner";
import EliteserienFixturePlanner from "../../Eliteserien/eliteserienFixturePlanner/eliteserienFixturePlanner";
import EliteserienRotationPlanner from "../../Eliteserien/rotationPlanner/eliteserienRotationPlanner";
import EliteserienPeriodePlanner from "../../Eliteserien/periodePlanner/eliteserienPeriodePlanner";

export const DefaultLayout = () => {
    const [ isAnyMenuOpen, setIsMenuOpen ] = useState(false);
    
    const isMenuOpenFromRedux = useSelector((state: any) => state?.isMenuOpen);

    // useEffect will listen if isMenuOpen property from redux changes
    useEffect(() => {
        let isCancelled : boolean = false;
        if (isMenuOpenFromRedux != null) {
            setIsMenuOpen(isMenuOpenFromRedux);
        }
        return () => { isCancelled = true }
    }, [isMenuOpenFromRedux]);

    return <>
    <div>
        <TopMenu />
        { (!isAnyMenuOpen) && 
        <><div className="showcase">
        </div>
        <div className="front-page-bottom">
            <div className="start-container">
              <div className="content-container">
                  <div className="col-sm-10 max-width">
                        <Routes>
                            <Route path="/" element={<p>Front Page</p>}></Route>
                            <Route path="/fixture-planner/" element={<FixturePlanner />} />
                            <Route path="/fixture-planner/fdr-planner/" element={<FixturePlanner />} />
                            <Route path="/fixture-planner/periode-planner/" element={<PeriodePlanner />} />
                            <Route path="/fixture-planner/rotation-planner/" element={<RotationPlanner />} />
                            <Route path="/fixture-planner-eliteserien/" element={<EliteserienFixturePlanner />} />
                            <Route path="/fixture-planner-eliteserien/fdr-planner/" element={<EliteserienFixturePlanner />} />
                            <Route path="/fixture-planner-eliteserien/rotation-planner/" element={<EliteserienRotationPlanner />} />
                            <Route path="/fixture-planner-eliteserien/periode-planner/" element={<EliteserienPeriodePlanner />} />
                        </Routes>
                  </div>
              </div>
            </div>
        <Footer />
        </div></>}
        { isAnyMenuOpen && (
            <div className="footer-under-menu">
                <Footer />
            </div>
        )}
    </div>
    </>
};
