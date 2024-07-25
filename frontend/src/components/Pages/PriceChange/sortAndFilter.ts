import { PlayerStatisticsModel } from "../../../models/playerStatistics/PlayerStatisticsModel";
import { PriceChangeModel } from "../../../models/priceChange/PriceChangeModel";
import { propComparatorPlayerStatistics, propComparatorPriceChangeModel } from "../../../utils/compareFunctions";

export function sortAndFilterPriceChange(priceChange: PriceChangeModel[], query: string, teamId: string, positionId: string, sortType: string, decreasing: boolean) {
    const temp: PriceChangeModel[] = [];
    
    let queryFilteredList: PriceChangeModel[] = [];
        
    priceChange.map(x => {
        if (query != "" && !x.web_name.toLowerCase().includes(query.toLowerCase())) {
            
        }
        else {
            queryFilteredList.push(x);
        }
    });

    if (positionId == "Goalkeepers") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.element_type == 1;
        });
    }
    else if (positionId == "Defenders") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.element_type == 2;
        });
    }
    else if (positionId == "Midfielders") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.element_type == 3;
        });
    }
    else if (positionId == "Forwards") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.element_type == 4;
        });
    }
    
    if (teamId != "All") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.team_code.toString() == teamId;
        });
    }


    const sorted = queryFilteredList.sort(propComparatorPriceChangeModel(sortType, decreasing));

    return sorted;
}

