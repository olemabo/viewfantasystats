"use client";

import Link from "next/link";
import { LeagueProps } from "../../../types/league";
import { getSectionUrlsByLeague } from "../get-menu-urls";
import { useTranslations } from "next-intl";

type HeaderProps = LeagueProps;

export default function MenuSection({ leagueType }: HeaderProps) {
  const sectionUrls = getSectionUrlsByLeague(leagueType);
  if (!sectionUrls) return null;

  const t = useTranslations("Layout.Footer");

  return (
    <nav>
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
}
