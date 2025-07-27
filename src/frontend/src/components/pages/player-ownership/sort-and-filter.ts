import { PLAYER_POSITIONS_IDS } from "@/constants/constants";
import { PlayerOwnershipModel } from "../../../models/playerOwnership/PlayerOwnershipModel";
import { propComparator } from "../../../utils/compareFunctions";

export const SORTING_KEYWORDS = {
  All: "All",
  Goalkeepers: "Goalkeepers",
  Defenders: "Defenders",
  Midfielders: "Midfielders",
  Forwards: "Forwards",
};

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

    if (sortingKeyword == SORTING_KEYWORDS.Goalkeepers) {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == PLAYER_POSITIONS_IDS.Goalkeeper;
        });
    }
    else if (sortingKeyword == SORTING_KEYWORDS.Defenders) {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == PLAYER_POSITIONS_IDS.Defender;
        });
    }
    else if (sortingKeyword == SORTING_KEYWORDS.Midfielders) {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == PLAYER_POSITIONS_IDS.Midfielder;
        });
    }
    else if (sortingKeyword == SORTING_KEYWORDS.Forwards) {
        queryFilteredList = queryFilteredList.filter(function (el) {
            return el.player_position_id == PLAYER_POSITIONS_IDS.Forward;
        });
    }
    else if (sortingKeyword !== SORTING_KEYWORDS.All) {
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

