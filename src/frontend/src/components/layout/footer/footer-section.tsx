"use server";

import Link from 'next/link'
import { LeagueProps, LeagueType, LeagueTypes } from '@/types/league';
import { leagueUrls } from '@/constants/urls/menuUrls';
import { getTranslations } from 'next-intl/server';

type FooterProps = LeagueProps;

type SectionUrls = typeof leagueUrls.urlsFpl;

const urlsByLeague: Record<LeagueType, SectionUrls> = {
  [LeagueTypes.FPL]: leagueUrls.urlsFpl,
  [LeagueTypes.ESF]: leagueUrls.urlsEsf
} as const;

export default async function FooterContainer({ leagueType }: FooterProps) {
    const sectionUrls = urlsByLeague[leagueType];
    
    if (!sectionUrls || Object.keys(sectionUrls).length === 0) { 
        return null;
    }

    const t = await getTranslations('Layout.Footer');

    return (
        <> 
        {Object.entries(sectionUrls).map(([sectionKey, urls]) => (
            <div key={sectionKey} className="footer-section">
                <h2>{t(`${sectionKey}.Title`)}</h2>
                <div>
                    {Object.entries(urls).map(([key, url]) => (
                        <Link key={key} href={`/${url}`}>
                            {t(`${sectionKey}.${key}`)}
                        </Link>
                    ))}
                </div>
            </div>
        ))}
        </>
    );
};
