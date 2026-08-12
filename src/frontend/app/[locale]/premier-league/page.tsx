import { redirect } from "next/navigation";

export default async function Page({
  params,
}: PageProps<"/[locale]/premier-league">) {
  const { locale } = await params;

  redirect(`/${locale}/premier-league/fdr-planner`);
}
