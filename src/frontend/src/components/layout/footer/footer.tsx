"use server";

import FooterContainer from './footer-section';
import { LeagueProps } from '@/types/league';
import Link from 'next/link';
import { Code, Twitter } from '@mui/icons-material';
import { URLS } from '@/constants/urls';
import "./footer.css";

export default async function Footer({leagueType }: LeagueProps) {
  return (
    <footer className={`footer ${leagueType}`}>
        <div className="footer-container">
            <FooterContainer leagueType={leagueType} />
            <div className="footer-section-social-media">
                <div>
                    <Twitter />
                    <Link target="_blank" href={URLS.EXTERNAL.PERSONAL.TWITTER}>Twitters</Link>
                </div>
                <div>
                    <Code />
                    <Link target="_blank" href={URLS.EXTERNAL.PERSONAL.GITHUB}>Code</Link>
                </div>  
            </div>
          </div>
      </footer>
  );
};