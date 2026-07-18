import Link from "next/link";
import { LeagueProps } from "../../../../types/league";
import { getTranslations } from "next-intl/server";
import { getSectionUrlsByLeague } from "../../get-menu-urls";
import styles from "./footer-section.module.css";

type FooterProps = LeagueProps;

export default async function FooterContainer({ leagueType }: FooterProps) {
  const sectionUrls = getSectionUrlsByLeague(leagueType);

  if (!sectionUrls) return null;

  const t = await getTranslations("Layout.Footer");

  return (
    <>
      {Object.entries(sectionUrls).map(([sectionKey, urls]) => (
        <div
          key={sectionKey}
          className={`${styles.footerSection} ${styles[leagueType] ?? ""}`}
        >
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
}
