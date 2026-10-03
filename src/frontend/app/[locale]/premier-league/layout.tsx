import Footer from "../../../components/layout/footer/footer";
import { LeagueTypes } from "../../../types/league";
import TopMenu from "../../../components/layout/top-menu/top-menu";
import { Locale, routing } from "../../../i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LeagueNameLayout({
  children,
  params,
}: LayoutProps<"/[locale]/premier-league">) {
  const { locale } = await params;

  return (
    <>
      <TopMenu leagueType={LeagueTypes.FPL} language={locale as Locale} />
      <main className={LeagueTypes.FPL}>{children}</main>
      <Footer leagueType={LeagueTypes.FPL} />
    </>
  );
}
