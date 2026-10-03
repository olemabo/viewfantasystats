import { redirect } from "next/navigation";

export default async function Page({
  params,
}: PageProps<"/[locale]/eliteserien">) {
  const { locale } = await params;
  redirect(`/${locale}/eliteserien/player-ownership`);
}
