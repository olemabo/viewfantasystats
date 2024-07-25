import { leagueTypeSelector } from '../../../store/selectors/leagueTypeSelector';
import { LanguageProps, fpl, esf } from '../../../models/shared/PageProps';
import * as ex_urls from '../../../static_urls/externalUrls';
import * as urls from '../../../static_urls/internalUrls';
import { FunctionComponent } from "react";
import Twitter from '@mui/icons-material/Twitter';
import { Link } from '../../Shared/Link/Link';
import Code from '@mui/icons-material/Code';
import FooterSection from './FooterSection';
import { useSelector } from "react-redux";
import "./Footer.scss";


const Footer: FunctionComponent<LanguageProps> = (props) => {
  const leagueType = useSelector(leagueTypeSelector);
  
  const fixturePlannerUrlsFpl = {
    Fixture: {
      FixturePlanner: urls.url_premier_league_fdr_planner,
      RotationPlanner: urls.url_premier_league_rotation_planner,
      PeriodPlanner: urls.url_premier_league_periode_planner,
      TeamPlanner: urls.url_premier_league_fdr_planner_team_id
    }
  };

  const statisticsUrlsFpl = {
    Statistics: {
      PlayerOwnership: urls.url_premier_league_player_ownership,
      LiveFixtures: urls.url_premier_league_live_fixtures,
      PlayerStatistics: urls.url_premier_league_player_statistics
    }
  };

  const fixturePlannerUrlsEsf = {
    Fixture: {
        FixturePlanner: urls.url_eliteserien_fdr_planner,
        RotationPlanner: urls.url_eliteserien_rotation_planner,
        PeriodPlanner: urls.url_eliteserien_periode_planner,
        TeamPlanner: urls.url_eliteserien_fdr_planner_team_id
    },
  };

  const statisticsUrlsEsf = {
    Statistics: {
        PlayerOwnership: urls.url_eliteserien_player_ownership,
        LiveFixtures: urls.url_eliteserien_live_fixtures,
        PlayerStatistics: urls.url_eliteserien_player_statistics,
        PriceChange: urls.url_eliteserien_price_change,
        RankStatistics: urls.url_eliteserien_rank_statistics,
    },
  };

  return (
      <footer className={`footer ${leagueType}`}>
          <div className="footer-container">
              {leagueType === fpl && (
                  <>
                      <FooterSection
                          title={props.languageContent.Fixture.fixture}
                          sectionUrls={fixturePlannerUrlsFpl}
                          languageContent={props.languageContent}
                      />
                      <FooterSection
                          title={props.languageContent.Statistics.statistic}
                          sectionUrls={statisticsUrlsFpl}
                          languageContent={props.languageContent}
                      />
                  </>
              )}
              {leagueType === esf && (
                  <>
                      <FooterSection
                          title={props.languageContent.Fixture.fixture}
                          sectionUrls={fixturePlannerUrlsEsf}
                          languageContent={props.languageContent}
                      />
                      <FooterSection
                          title={props.languageContent.Statistics.statistic}
                          sectionUrls={statisticsUrlsEsf}
                          languageContent={props.languageContent}
                      />
                  </>
              )}
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
      </footer>
  );
};

export default Footer;