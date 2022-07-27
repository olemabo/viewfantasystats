import React from "react";
import "./footer.scss";
import Twitter from '@material-ui/icons/Twitter';
import Code from '@material-ui/icons/Code';

export const Footer = () => {

    return <>
    <div className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Premier League</h2>
          <div>
            <a href="../../../fixture-planner/fdr-planner/">FDR Planner</a>
            <a href="../../../fixture-planner/rotation-planner/">Roation Planner</a>
            <a href="../../../fixture-planner/periode-planner/">Period Planner</a>
          </div>
        </div>
        <div className="footer-section">
          <h2>Eliteserien</h2>
          <div>
            <a href="../../../fixture-planner-eliteserien/">FDR Planner</a>
            <a href="../../../fixture-planner-eliteserien/rotation-planner/">Rotasjonsplanlegger</a>
            <a href="../../../fixture-planner-eliteserien/periode-planner/">Periodeplanlegger</a>
            <a className="dropbtn" href="../../../statistics/player-ownership/">Eierandel</a>                     
          </div>
        </div>
        {/* <div className="footer-section-social-media">
          <h2>Sosiale medier</h2>
          <div>
            <div><Twitter /><a target="_blank" href="https://twitter.com/Ole_Borge">Twitter</a></div>                  
            <div><Code /><a target="_blank" href="https://dev.azure.com/olemartinbo/_git/FPL-webpage">Open Source Project</a></div>                   
          </div>
        </div> */}
        {/* https://dev.azure.com/olemartinbo/_git/FPL-webpage
        @fplbot is an open source project made by Blank. The code is available on github. */}
        {/* Denne nettsiden er et "open source" prosjekt laget av Ole Martin */}
      </div>
  </div></>
};

export default Footer;