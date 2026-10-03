import Footer from "@/components/layout/footer/footer";
import { LeagueTypes } from "@/types/league";
import TopMenu from "@/components/layout/top-menu/top-menu";
import { Locale, routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LeagueNameLayout({
  children,
}: LayoutProps<"/[locale]/eliteserien">) {
  const locale = await getLocale();

  return (
    <>
      <TopMenu leagueType={LeagueTypes.ESF} language={locale as Locale} />
      <main className={LeagueTypes.ESF}>{children}</main>
      <Footer leagueType={LeagueTypes.ESF} />
    </>
  );
}
