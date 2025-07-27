import { LanguageProps } from "../../../models/shared/LanguageType";
import { FunctionComponent } from "react";

interface TopMenuMobileProps  extends LanguageProps {
    sectionUrls: Record<string, Record<string, string>>;
    closeMenu: () => void
}

const TopMenuMobileSection: FunctionComponent<TopMenuMobileProps> = ({
    sectionUrls,
    languageContent,
    closeMenu
}) => {
    if (!sectionUrls || Object.keys(sectionUrls).length === 0) return null;
    
    return (
        <nav className="mobile-sub-menu-container">
            <ul>
                {Object.entries(sectionUrls).map(([sectionKey, urls]) => (
                    Object.entries(urls).map(([key, url]) => (
                        <li key={sectionKey} className="sub-menu-item">
                            <a key={key} onClick={() => closeMenu()} href={`/${url}`}>{languageContent[sectionKey]?.[key]?.title}</a>
                        </li>
                    ))
                ))}
            </ul>
        </nav>
    );
};

export default TopMenuMobileSection;