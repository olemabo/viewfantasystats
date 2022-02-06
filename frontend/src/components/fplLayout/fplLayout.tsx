import React, { FunctionComponent, useEffect, useState } from "react"; // this must be here
import TopMenu from "../topMenu/topMenu";
import Footer from "../footer/footer";
import FixturePlanner from "../fixturePlanner/FixturePlanner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store from "../../store/index";
import { useSelector } from 'react-redux'


export const FPLLayout = () => {
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
                      <Router>
                          <Routes>
                              <Route path="/" element={<p>Front Page</p>}></Route>
                              <Route path="/fixture-planner" element={<FixturePlanner />} />
                          </Routes>
                      </Router>
                  </div>
              </div>
            </div><Footer />
        </div></>}
        { isAnyMenuOpen && (
            <div className="footer-under-menu">
                <Footer />
            </div>
        )}
    </div>
    </>
};
