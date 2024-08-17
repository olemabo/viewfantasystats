import { Link } from "react-router-dom";
import { LanguageProps } from "../../../models/shared/LanguageType";
import { FunctionComponent } from "react";

interface FooterProps extends LanguageProps {
    sectionUrls: Record<string, Record<string, string>>;
}

const FooterContainer: FunctionComponent<FooterProps> = ({
    sectionUrls,
    languageContent,
}) => {
    if (!sectionUrls || Object.keys(sectionUrls).length === 0) return null;

    return (
        <> 
        {Object.entries(sectionUrls).map(([sectionKey, urls]) => (
            <div key={sectionKey} className="footer-section">
                <h2>{languageContent?.[sectionKey]?.title}</h2>
                <div>
                    {Object.entries(urls).map(([key, url]) => (
                        <Link key={key} to={`/${url}`}>
                            {languageContent?.[sectionKey]?.[key]?.title}
                        </Link>
                    ))}
                </div>
            </div>
        )
        )}
        </>
    );
};

export default FooterContainer;