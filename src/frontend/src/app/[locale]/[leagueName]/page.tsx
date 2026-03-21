import { esf } from '@/models/shared/LeagueType';
import { LeaguePath, LeagueTypeByPath } from '@/types/league';
import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ leagueName: LeaguePath }>;
};

export default async function Page({
  params,
  
}: PageProps) {
    const {leagueName} = await params;

    const leagueType = LeagueTypeByPath[leagueName];

    if (leagueType === esf) {
      redirect('/no/eliteserien/player-ownership/');
    }

    redirect('/no/premier-league/fdr-planner');
}