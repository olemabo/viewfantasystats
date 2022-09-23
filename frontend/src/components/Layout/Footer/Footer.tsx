import * as urls from '../../../internal_urls/internalUrls';
import React, { FunctionComponent } from "react";
import Twitter from '@material-ui/icons/Twitter';
import Code from '@material-ui/icons/Code';
import { useSelector } from "react-redux";
import "./Footer.scss";

type LanguageProps = {
  content: any;
}

export const Footer : FunctionComponent<LanguageProps> = (props) => {
  const league_type = useSelector((state: any) => state?.league_type);
  
  return <>
    <div className={"footer " + league_type}>
      <div className="footer-container">
        { league_type == "FPL" && <>
          <div className="footer-section">
            <h2>{props.content.Fixture.fixture}</h2>
            <div>
              <a href={"../../../" + urls.url_premier_league_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
              <a href={"../../../" + urls.url_premier_league_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
              <a href={"../../../" + urls.url_premier_league_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
            </div>
          </div>
          <div className="footer-section">
            <h2>{props.content.Statistics.statistic}</h2>
            <div>
              <a href={"../../../" + urls.url_premier_league_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>
              <a href={"../../../" + urls.url_premier_league_player_statistics}>{props.content.Statistics.PlayerStatistics?.title}</a>
              {/* <a href={"../../../" + urls.url_elitserien_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
              <a href={"../../../" + urls.url_eliteserien_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
              <a href={"../../../" + urls.url_eliteserien_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
              <a href={"../../../" + urls.url_eliteserien_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>                      */}
              {/* <a className="dropbtn" href="../../../statistics/search-user-names/">{props.content.Statistics.SearchUserName?.title}</a> */}
            </div>
          </div>
        </> }
        { league_type == "Eliteserien" && <>
          <div className="footer-section">
            <h2>{props.content.Fixture.fixture}</h2>
            <div>
              <a href={"../../../" + urls.url_elitserien_fdr_planner}>{props.content.Fixture.FixturePlanner?.title}</a>
              <a href={"../../../" + urls.url_eliteserien_rotation_planner}>{props.content.Fixture.RotationPlanner?.title}</a>
              <a href={"../../../" + urls.url_eliteserien_periode_planner}>{props.content.Fixture.PeriodPlanner?.title}</a>
              </div>
          </div>
          <div className="footer-section">
            <h2>{props.content.Statistics.statistic}</h2>
            <div>
              <a href={"../../../" + urls.url_eliteserien_player_ownership}>{props.content.Statistics.PlayerOwnership?.title}</a>                     
              <a href={"../../../" + urls.url_eliteserien_rank_statistics}>{props.content.Statistics.RankStatistics?.title}</a>                     
            </div>
          </div>
          {/* <div className="footer-section">
            <h2>{props.content.Statistics.search}</h2>
            <div>
              <a href={"../../../" + urls.url_eliteserien_search_user_name}>{props.content.Statistics.SearchUserName?.title}</a>                     
            </div>
          </div> */}
        </> }
        <div className="footer-section-social-media">
          {/* <h2>Sosiale medier</h2> */}
          <div className="">
            <div><Twitter /><a className="" target="_blank" href="https://twitter.com/Ole_Borge">Twitter</a></div>                  
            <div><Code /><a target="_blank" href="https://dev.azure.com/olemartinbo/_git/FPL-webpage">Open Source Project</a></div>                   
          </div>
        </div>
        {/* https://dev.azure.com/olemartinbo/_git/FPL-webpage
        @fplbot is an open source project made by Blank. The code is available on github. */}
        {/* Denne nettsiden er et "open source" prosjekt laget av Ole Martin */}
      </div>
  </div></>
};

export default Footer;