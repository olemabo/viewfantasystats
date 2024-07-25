import { LanguageProps } from "../../../models/shared/LanguageType";
import { FunctionComponent } from "react";

interface FooterProps extends LanguageProps {
    sectionUrls: Record<string, Record<string, string>>;
    title: string;
}

const FooterSection: FunctionComponent<FooterProps> = ({
    sectionUrls,
    title,
    languageContent,
}) => {
    if (!title || !sectionUrls || Object.keys(sectionUrls).length === 0) return null;

    return (
        <div className="footer-section">
            <h2>{title}</h2>
            <div>
                {Object.entries(sectionUrls).map(([sectionType, urls]) => (
                    Object.entries(urls).map(([key, url]) => (
                        <a key={key} href={`/${url}`}>
                            {languageContent?.[sectionType]?.[key]?.title}
                        </a>
                    ))
                ))}
            </div>
        </div>
    )
};

export default FooterSection;