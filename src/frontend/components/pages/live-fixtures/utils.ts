export function convertIdentifierToReadableName(identifier: string, t: (key: string) => string) {
  if (identifier === "goals_scored") return t("General.goal");
  if (identifier === "assists") return t("General.assists");
  if (identifier === "yellow_cards") return t("General.yellow_cards");
  if (identifier === "red_cards") return t("General.red_cards");
  if (identifier === "saves") return t("General.saves");
  if (identifier === "bonus") return t("General.bonus");
  if (identifier === "penalties_saved") return t("General.penalties_saved");
  if (identifier === "penalties_missed") return t("General.penalties_missed");
  if (identifier === "own_goals") return t("General.own_goals");
  if (identifier === "bps") return t("Statistics.PlayerStatistics.bps");
  return identifier;
}

export function convertListToString(list: any[]) {
    let temp: string[] = [];

    list.map(el => {
        temp.push(el?.element + " (" + el?.value + ")")
    })
    
    const myString = temp.join(", ");

    return myString;
}

export function convertDateToTimeString(date: string) {
    const localDate = new Date(date);
    return localDate.toLocaleString('no', {
        hour: "numeric",
        minute: "numeric",
      });
}