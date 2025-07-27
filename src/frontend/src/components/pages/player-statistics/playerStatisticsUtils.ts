export const getMinWidth = (category: string, lastXGws: number, leagueType: string, categories: string[]): number => {
    const minWidthMap: Record<string, number> = {
        "Name": 140,
        "Yellow Cards": 120,
        "Red Cards": 110,
        "Opta": 88,
        "Bps": 80,
        "Assists": 90,
        "Goals": 90,
    };
    return minWidthMap[category] || (lastXGws === 0 || leagueType === 'esf' ? 100 : 1000 / categories.length);
};

export const convertCategoryToName = (category: string, content: any): string => {
    const categoryMap: Record<string, string> = {
        "Points": content.General.points,
        "Goals": content.General.goal,
        "Yellow Cards": content.General.yellow_cards,
        "Red Cards": content.General.red_cards,
    };
    return categoryMap[category] || category;
};