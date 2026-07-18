import { NextIntlClientProvider } from "next-intl";
import Footer from "../../../components/layout/footer/footer";
import { LeaguePaths, LeagueTypeByPath } from "../../../types/league";
import PageContainer from "../../../components/shared/page-container";
import TopMenu from "../../../components/layout/top-menu/top-menu";
import { Locale } from "../../../i18n/routing";

export function generateStaticParams() {
  return Object.values(LeaguePaths).map((leagueName) => ({ leagueName }));
}

export default async function LeagueNameLayout({
  children,
  params,
}: LayoutProps<"/[locale]/[leagueName]">) {
  const { leagueName, locale } = await params;
  const leagueType =
    LeagueTypeByPath[leagueName as keyof typeof LeagueTypeByPath];

  return (
    <>
      <TopMenu leagueType={leagueType} language={locale as Locale} />
      <main className={leagueType}>
        <PageContainer>{children}</PageContainer>
      </main>
      <Footer leagueType={leagueType} />
    </>
  );
}
