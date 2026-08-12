import Footer from "@/components/layout/footer/footer";
import { LeaguePaths, LeagueTypes } from "@/types/league";
import PageContainer from "@/components/shared/page-container";
import TopMenu from "@/components/layout/top-menu/top-menu";
import { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return Object.values(LeaguePaths).map((leagueName) => ({ leagueName }));
}

export default async function LeagueNameLayout({
  children,
  params,
}: LayoutProps<"/[locale]/eliteserien">) {
  const { locale } = await params;

  return (
    <>
      <TopMenu leagueType={LeagueTypes.ESF} language={locale as Locale} />
      <main className={LeagueTypes.ESF}>
        <PageContainer>{children}</PageContainer>
      </main>
      <Footer leagueType={LeagueTypes.ESF} />
    </>
  );
}
