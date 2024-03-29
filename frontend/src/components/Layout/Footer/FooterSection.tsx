import { LanguageProps } from "../../../models/shared/LanguageType";
import React, { FunctionComponent } from "react";

interface FooterProps extends LanguageProps {
    sectionUrls: Record<string, Record<string, string>>; // Change type to nested object
    content: any;
    title: string;
}

const FooterSection: FunctionComponent<FooterProps> = ({
    sectionUrls,
    content,
    title,
}) => {
    if (!title || !sectionUrls || Object.keys(sectionUrls).length === 0) return null;

    return (
        <div className="footer-section">
            <h2>{title}</h2>
            <div>
                {Object.entries(sectionUrls).map(([sectionType, urls]) => (
                    Object.entries(urls).map(([key, url]) => (
                        <a key={key} href={`/${url}`}>
                            {content?.[sectionType]?.[key]?.title}
                        </a>
                    ))
                ))}
            </div>
        </div>
    )
};

export default FooterSection;