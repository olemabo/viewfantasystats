import { Link } from "react-router-dom";
import { LanguageProps } from "../../../models/shared/LanguageType";
import { FunctionComponent } from "react";

interface TopMenuProps  extends LanguageProps {
    sectionUrls: Record<string, Record<string, string>>;
}

const MenuSection: FunctionComponent<TopMenuProps> = ({
    sectionUrls,
    languageContent,
}) => {
    if (!sectionUrls || Object.keys(sectionUrls).length === 0) return null;
    
    return (
        <nav >
            <ul>
                {Object.entries(sectionUrls).map(([sectionKey, urls]) => (
                    <li key={sectionKey} className="dropdown">
                        <button className="dropbtn">{languageContent?.[sectionKey]?.title}</button>
                        <div className="dropdown-content">
                            {Object.entries(urls).map(([key, url]) => (
                                <Link key={key} className="dropbtn" to={`/${url}`}>
                                    {languageContent[sectionKey]?.[key]?.title}
                                </Link>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default MenuSection;