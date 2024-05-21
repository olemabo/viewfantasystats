import { PlayerOwnershipModel } from "../../../models/playerOwnership/PlayerOwnershipModel";
import { propComparator } from "../../../utils/compareFunctions";

export function sortAndFilterPlayerOwnership(
    players: PlayerOwnershipModel[],
    teamNameAndIds: any[],
    query: string, 
    sortingKeyword: string, 
    sortIndex: number, 
    decreasing: boolean
) {
    const temp: PlayerOwnershipModel[] = [];
    
    var queryFilteredList: PlayerOwnershipModel[] = [];
        
    players.map(x => {
        if (query != "" && !x.player_name.toLowerCase().includes(query.toLowerCase())) {
            
        }
        else {
            queryFilteredList.push(x);
        }
    });

    if (sortingKeyword == "Goalkeepers") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == "1";
        });
    }
    else if (sortingKeyword == "Defenders") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == "2";
        });
    }
    else if (sortingKeyword == "Midfielders") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == "3";
        });
    }
    else if (sortingKeyword == "Forwards") {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == "4";
        });
    }
    else if (sortingKeyword !== "All") {
        teamNameAndIds.map(x => {
            if (x.team_id == sortingKeyword) {
                queryFilteredList = queryFilteredList.filter(function (el) {
                    return el.player_team_id == x.team_id;
                });
            }
        })
    }


    const sorted = queryFilteredList.sort(propComparator(sortIndex, decreasing));

    return sorted;
}

