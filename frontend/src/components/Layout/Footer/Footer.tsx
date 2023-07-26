import { LanguageProps, fpl, esf } from '../../../models/shared/PageProps';
import * as ex_urls from '../../../static_urls/externalUrls';
import * as urls from '../../../static_urls/internalUrls';
import React, { FunctionComponent } from "react";
import Twitter from '@mui/icons-material/Twitter';
import { Link } from '../../Shared/Link/Link';
import Code from '@mui/icons-material/Code';
import { useSelector } from "react-redux";
import "./Footer.scss";


export const Footer : FunctionComponent<LanguageProps> = (props) => {
  const leagueType = useSelector((state: any) => state?.league_type);

  return <>
    <footer className={`footer ${leagueType}`}>
      <div className="footer-container">
        { leagueType === fpl && <>
          <div className="footer-section">
            <h2>{props.content.Fixture.fixture}</h2>
              <div>
                <a href={`/${urls.url_premier_league_fdr_planner}`}>{props.content.Fixture.FixturePlanner?.title}</a>
                <a href={`/${urls.url_premier_league_rotation_planner}`}>{props.content.Fixture.RotationPlanner?.title}</a>
                <a href={`/${urls.url_premier_league_periode_planner}`}>{props.content.Fixture.PeriodPlanner?.title}</a>
              </div>
          </div>
          <div className="footer-section">
            <h2>{props.content.Statistics.statistic}</h2>
              <div>
                <a href={`/${urls.url_premier_league_player_ownership}`}>{props.content.Statistics.PlayerOwnership?.title}</a>
                <a href={`/${urls.url_premier_league_player_statistics}`}>{props.content.Statistics.PlayerStatistics?.title}</a>
                <a href={`/${urls.url_premier_league_live_fixtures}`}>{props.content.Statistics.LiveFixtures?.title}</a>
             </div>
          </div>
        </> }
        { leagueType === esf && <>
          <div className="footer-section">
            <h2>{props.content.Fixture.fixture}</h2>
              <div>
                <a href={`/${urls.url_elitserien_fdr_planner}`}>{props.content.Fixture.FixturePlanner?.title}</a>
                <a href={`/${urls.url_eliteserien_rotation_planner}`}>{props.content.Fixture.RotationPlanner?.title}</a>
                <a href={`/${urls.url_eliteserien_periode_planner}`}>{props.content.Fixture.PeriodPlanner?.title}</a>
              </div>
          </div>
          <div className="footer-section">
            <h2>{props.content.Statistics.statistic}</h2>
              <div>
                <a href={`/${urls.url_eliteserien_player_ownership}`}>{props.content.Statistics.PlayerOwnership?.title}</a>
                <a href={`/${urls.url_eliteserien_live_fixtures}`}>{props.content.Statistics.LiveFixtures?.title}</a>
                <a href={`/${urls.url_eliteserien_rank_statistics}`}>{props.content.Statistics.RankStatistics?.title}</a>
              </div>
          </div>
        </> }
        <div className="footer-section-social-media">
          <div>
            <Twitter />
            <Link target="_blank" href={ex_urls.url_personal_twitter}>Twitter</Link>
          </div>
          <div>
            <Code />
            <Link target="_blank" href={ex_urls.url_personal_github}>Code</Link>
          </div>
        </div>
      </div>
  </footer></>
};

export default Footer;