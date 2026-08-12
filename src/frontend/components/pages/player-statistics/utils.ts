import { LeagueType, LeagueTypes } from "@/types/league";

type CategoryTranslator = (
  key: "points" | "goal" | "yellow_cards" | "red_cards",
) => string;

export const getMinWidth = (
  category: string,
  lastXGws: number,
  leagueType: LeagueType,
  categories: string[],
): number => {
  const minWidthMap: Record<string, number> = {
    Name: 140,
    "Yellow Cards": 120,
    "Red Cards": 110,
    Opta: 88,
    Bps: 80,
    Assists: 90,
    Goals: 90,
  };

  return (
    minWidthMap[category] ||
    (lastXGws === 0 || leagueType === LeagueTypes.ESF
      ? 100
      : 1000 / categories.length)
  );
};

export const convertCategoryToName = (
  category: string,
  t: CategoryTranslator,
): string => {
  const categoryMap: Partial<Record<string, string>> = {
    Points: t("points"),
    Goals: t("goal"),
    "Yellow Cards": t("yellow_cards"),
    "Red Cards": t("red_cards"),
  };

  return categoryMap[category] ?? category;
};