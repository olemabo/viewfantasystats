import { NextIntlClientProvider } from 'next-intl';
import Footer from '@/components/layout/footer/footer';
import { LeaguePath, LeagueTypeByPath } from '@/types/league';
import PageContainer from '@/components/shared/page-container';
import TopMenu from '@/components/layout/top-menu/top-menu';
import { Locale } from '@/i18n/routing';

export default async function LeagueNameLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{leagueName: LeaguePath, locale: Locale}>;
}) {
  const {leagueName, locale} = await params;
  const leagueType = LeagueTypeByPath[leagueName];

  return (
    <>
      <NextIntlClientProvider>
        <TopMenu leagueType={leagueType} language={locale} />
        <main className={leagueType}>
          <PageContainer>
              {children}
          </PageContainer>
        </main>
      </NextIntlClientProvider>
      <Footer leagueType={leagueType} />
    </>
  );
}