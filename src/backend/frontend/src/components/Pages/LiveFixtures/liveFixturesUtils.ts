export function convertIdentifierToReadableName(identifier: string, content: any) {
    if (identifier === "goals_scored") return content.General.goal;
    if (identifier === "assists") return content.General.assists;
    if (identifier === "yellow_cards") return content.General.yellow_cards;
    if (identifier === "red_cards") return content.General.red_cards;
    if (identifier === "saves") return content.General.saves;
    if (identifier === "bonus") return content.General.bonus;
    if (identifier === "penalties_saved") return content.General.penalties_saved;
    if (identifier === "penalties_missed") return content.General.penalties_missed;
    if (identifier === "own_goals") return content.General.own_goals;
    if (identifier === "bps") return content.Statistics.PlayerStatistics.bps;
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
    const dateToTime = (date: any) => date.toLocaleString('no', {
        hour: "numeric",
        minute: "numeric",
      });

    const localDate = new Date(date);

    return dateToTime(localDate);
}