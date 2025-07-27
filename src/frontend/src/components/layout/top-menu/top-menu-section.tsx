"use server"

import Link from "next/link";
import { LeagueProps, LeagueType, LeagueTypes } from "@/types/league";
import { leagueUrls } from '@/constants/urls/menuUrls';
import { getTranslations } from "next-intl/server";

type HeaderProps = LeagueProps;

type SectionUrls = typeof leagueUrls.urlsFpl;

const urlsByLeague: Record<LeagueType, SectionUrls> = {
  [LeagueTypes.FPL]: leagueUrls.urlsFpl,
  [LeagueTypes.ESF]: leagueUrls.urlsEsf
} as const;

export default async function  MenuSection({ 
    leagueType
}: HeaderProps){
    const sectionUrls = urlsByLeague[leagueType];
    
    if (!sectionUrls || Object.keys(sectionUrls).length === 0) { 
        return null;
    }

    const t = await getTranslations('Layout.Footer');

    return (
        <nav >
            <ul>
                {Object.entries(sectionUrls).map(([sectionKey, urls]) => (
                    <li key={sectionKey} className="dropdown">
                        <button className="dropbtn">{t(`${sectionKey}.Title`)}</button>
                        <div className="dropdown-content">
                            {Object.entries(urls).map(([key, url]) => (
                                <Link key={key} className="dropbtn" href={`/${url}`}>
                                    {t(`${sectionKey}.${key}`)}
                                </Link>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
