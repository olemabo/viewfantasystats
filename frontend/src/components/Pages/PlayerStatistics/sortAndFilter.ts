import { PlayerStatisticsModel } from "../../../models/playerStatistics/PlayerStatisticsModel";
import { propComparatorPlayerStatistics } from "../../../utils/compareFunctions";

export function sortAndFilterPlayerStatistics(players: PlayerStatisticsModel[], query: string, teamId: string, positionId: string, sortIndex: number, decreasing: boolean) {
    const temp: PlayerStatisticsModel[] = [];
    
    let queryFilteredList: PlayerStatisticsModel[] = [];
        
    players.map(x => {
        if (query != "" && !x.Name.toLowerCase().includes(query.toLowerCase())) {
            
        }
        else {
            queryFilteredList.push(x);
        }
    });

    if (positionId == "Goalkeepers") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == 1;
        });
    }
    else if (positionId == "Defenders") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == 2;
        });
    }
    else if (positionId == "Midfielders") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == 3;
        });
    }
    else if (positionId == "Forwards") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == 4;
        });
    }
    
    if (teamId != "All") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_team_id.toString() == teamId;
        });
    }


    const sorted = queryFilteredList.sort(propComparatorPlayerStatistics(sortIndex, decreasing));

    return sorted;
}

