import { leagueTypeSelector } from '../../../store/selectors/leagueTypeSelector';
import { LanguageProps, fpl, esf } from '../../../models/shared/PageProps';
import * as ex_urls from '../../../staticUrls/externalUrls';
import { FunctionComponent } from "react";
import Twitter from '@mui/icons-material/Twitter';
import { Link } from '../../Shared/Link/Link';
import Code from '@mui/icons-material/Code';
import FooterContainer from './FooterSection';
import { useSelector } from "react-redux";
import "./Footer.scss";
import { leagueUrls } from '../../../staticUrls/menuUrls';


const Footer: FunctionComponent<LanguageProps> = ({
    languageContent
}) => {
  const leagueType = useSelector(leagueTypeSelector);

  return (
      <footer className={`footer ${leagueType}`}>
          <div className="footer-container">
              {leagueType === fpl && (
                <FooterContainer
                    sectionUrls={leagueUrls.urlsFpl}
                    languageContent={languageContent} 
                />
              )}
              {leagueType === esf && (
                  <FooterContainer
                    sectionUrls={leagueUrls.urlsEsf}
                    languageContent={languageContent} 
                  />
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