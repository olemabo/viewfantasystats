import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "../../utils/useWindowDimensions";
import { TopMenuMobile } from "../topMenuMobile/topMenuMobile";
import "./topMenu.scss";

export const TopMenu = () => {
    const { height, width } = useWindowDimensions();
    const mobileMaxSize = 800;
    const webpageTitle = "FPL Webpage";
    const soccer_leauge = "FPL";

    console.log(height, width);

    return <>
    <div className="top-menu">
      { width > mobileMaxSize && 
          <div className="front-page-top-sky">
              <div className="top-navbar container">
                  <div className="top-navbar-container">
                      <a className="circle-link fpl" href="../../../fixture-planner/"></a>
                      {/* { <a className="circle-link eliteserien" href="../../../fixture-planner-eliteserien/"></a> } */}
                  </div>
              </div>
              <div className="navbar">
                  <div className="container flex">
                      <h1 className="logo">FPL Fixture Planner</h1>
                     <nav>
                        <ul>
                          { /* <li><a href="../../../statistics/">Statistics</a></li> */ }
                          <li><a href="../../../fixture-planner/">Fixture Planning</a></li>
                        </ul>
                      </nav>
                  </div>
              </div>
          </div>
      }
      { width <= mobileMaxSize && 
        <TopMenuMobile title={webpageTitle} soccer_leauge={soccer_leauge} />
      }
    </div>
    </>
};

export default TopMenu;