import { RankModel } from "../../../models/RankStatistics/RankStatistics";
import { propComparatorRankModel } from "../../../utils/compareFunctions";

export function sortAndFilterRankData(ranks: RankModel[], query: string, sortType: string, decreasing: boolean) {
    const temp: RankModel[] = [];
    
    ranks.map(x => {
        if (x.name.toLowerCase().includes(query.toLowerCase()) 
        || x.team_name.toLowerCase().includes(query.toLowerCase())) {
            temp.push(x);
        }
    });

    const sorted = temp.sort(propComparatorRankModel(sortType, decreasing));

    return sorted;
}