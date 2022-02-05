import React from "react";

export const TopMenu = () => {
    var a = 1;

    return <div className="front-page-top-sky">
      <div className="top-navbar container">
          <div className="top-navbar-container">
              <a className="circle-link fpl" href="../../../fixture-planner/"></a>
              { /* <a className="circle-link eliteserien" href="../../../fixture-planner-eliteserien/"></a> */ }
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
};

export default TopMenu;