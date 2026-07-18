import { redirect } from "next/navigation";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  redirect(`/${locale}/premier-league`);
}
