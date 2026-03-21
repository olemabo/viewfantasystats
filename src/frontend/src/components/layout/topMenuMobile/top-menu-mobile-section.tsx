import { LeagueProps } from "@/types/league";
import { getSectionUrlsByLeague } from "../get-menu-urls";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface TopMenuMobileProps extends LeagueProps {
    closeMenu: () => void
}

export default function TopMenuMobileSection({
    leagueType,
    closeMenu
}: TopMenuMobileProps) {
    const sectionUrls = getSectionUrlsByLeague(leagueType);
    if (!sectionUrls) return null;

    const t = useTranslations('Layout.Footer');

    return (
        <nav className="nav-menu-container">
            <ul>
                {Object.entries(sectionUrls).map(([sectionKey, urls]) => (
                    Object.entries(urls).map(([key, url]) => (
                        <li key={sectionKey} className="sub-menu-item">
                            <Link key={key} onClick={() => closeMenu()} href={`/${url}`}>
                                {t(`${sectionKey}.${key}`)}
                            </Link>
                        </li>
                    ))
                ))}
            </ul>
        </nav>
    );
};