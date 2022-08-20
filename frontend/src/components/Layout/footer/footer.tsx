import React, { FunctionComponent } from "react";
import "./footer.scss";
import Twitter from '@material-ui/icons/Twitter';
import Code from '@material-ui/icons/Code';
import { useSelector } from "react-redux";

type LanguageProps = {
  content: any;
}

export const Footer : FunctionComponent<LanguageProps> = (props) => {
  const league_type = useSelector((state: any) => state?.league_type);
  
  return <>
    <div className={"footer " + league_type}>
      <div className="footer-container">
        <div className="footer-section">
          <h2>Premier League</h2>
          <div>
            <a href="../../../fixture-planner/fdr-planner/">{props.content.Fixture.FixturePlanner.title}</a>
            <a href="../../../fixture-planner/rotation-planner/">{props.content.Fixture.RotationPlanner.title}</a>
            <a href="../../../fixture-planner/periode-planner/">{props.content.Fixture.PeriodPlanner.title}</a>
            <a className="dropbtn" href="../../../statistics-premier-league/player-ownership/">{props.content.Statistics.PlayerOwnership.title}</a>
          </div>
        </div>
        <div className="footer-section">
          <h2>Eliteserien</h2>
          <div>
            <a href="../../../fixture-planner-eliteserien/">{props.content.Fixture.FixturePlanner.title}</a>
            <a href="../../../fixture-planner-eliteserien/rotation-planner/">{props.content.Fixture.RotationPlanner.title}</a>
            <a href="../../../fixture-planner-eliteserien/periode-planner/">{props.content.Fixture.PeriodPlanner.title}</a>
            <a className="dropbtn" href="../../../statistics/player-ownership/">{props.content.Statistics.PlayerOwnership.title}</a>                     
            {/* <a className="dropbtn" href="../../../statistics/search-user-names/">{props.content.Statistics.SearchUserName.title}</a> */}
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