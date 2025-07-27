"use server";

import * as externalUrls from '@/constants/urls/externalUrls';
import FooterContainer from './footer-section';
import { LeagueProps } from '@/types/league';
import Link from 'next/link';
import "./footer.css";

export default async function Footer({leagueType }: LeagueProps) {
  return (
    <footer className={`footer ${leagueType}`}>
        <div className="footer-container">
            <FooterContainer leagueType={leagueType} />
            <div className="footer-section-social-media">
                <div>
                    {/* <Twitter /> */}
                    <Link target="_blank" href={externalUrls.url_personal_twitter}>Twitters</Link>
                </div>
                <div>
                    {/* <Code /> */}
                    <Link target="_blank" href={externalUrls.url_personal_github}>Code</Link>
                </div>  
            </div>
          </div>
      </footer>
  );
};