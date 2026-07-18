"use client";

import { Locale, routing } from "../../../i18n/routing";
import { LanguageProps } from "../../../types/language";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PublicIcon from "@mui/icons-material/Public";

export default function LocaleSwitcher({ language }: LanguageProps) {
  const pathname = usePathname();

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  console.log(language, "lang");

  if (language === "en") {
    return (
      <>
        <Link href={redirectedPathname("no")} className="button-with-icon">
          {/* <PublicIcon fontSize="small" className="adjust-height-lang"/> */}
          <span className="adjust-height-lang lang">Norsk</span>
        </Link>
      </>
    );
  }

  return (
    // <div className="dropdown-content">
    //   <p>Locale switcher:</p>
    //   <ul>
    //     {routing.locales.map((locale) => {
    //       return (
    //         <li key={locale}>
    //           <Link href={redirectedPathname(locale)}>{locale}</Link>
    //         </li>
    //       );
    //     })}
    //   </ul>
    // </div>
    <>
      <Link href={redirectedPathname("en")} className="button-with-icon">
        <PublicIcon fontSize="small" className="adjust-height-lang" />
        <span className="adjust-height-lang lang">English</span>
      </Link>
    </>
  );
}
