import { esf } from "../../../models/shared/LeagueType";
import { LeagueTypeByPath } from "../../../types/league";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: PageProps<"/[locale]/[leagueName]">) {
  const { leagueName, locale } = await params;

  const leagueType =
    LeagueTypeByPath[leagueName as keyof typeof LeagueTypeByPath];

  if (leagueType === esf) {
    redirect(`/${locale}/eliteserien/player-ownership/`);
  }

  redirect(`/${locale}/premier-league/fdr-planner`);
}
