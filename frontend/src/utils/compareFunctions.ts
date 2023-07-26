import { PlayerOwnershipModel } from '../models/playerOwnership/PlayerOwnershipModel';
import { RankModel } from '../models/RankStatistics/RankStatistics';

export const propComparator = (prop:number, increasing: boolean) =>
    (a:PlayerOwnershipModel, b:PlayerOwnershipModel) => {
    if (prop == 0) {
        if (a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 > b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3) {
            return increasing ? -1 : 1;
        }
        if (a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 < b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3) {
            return increasing ? 1 : -1;
        }
        return 0;
    }
    else {
        if ( a.ownership[prop] > b.ownership[prop]){
            return increasing ? -1 : 1;
        }
        if (a.ownership[prop] < b.ownership[prop]){
            return increasing ? 1 : -1;
        }
        return 0;
    }
} 

export function compare( a: any, b: any ) {
    if ( a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 > b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3){
        return -1;
    }
    if ( a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 < b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3){
        return 1;
    }

    return 0;
}

export const propComparatorRankModel = (prop:number, increasing: boolean) =>
    (a:RankModel, b:RankModel) => {
    if (prop == 0) {
        if ( a.avg_rank < b.avg_rank){
            return increasing ? -1 : 1;
        }
        if (a.avg_rank > b.avg_rank){
            return increasing ? 1 : -1;
        }
        return 0;
    }
    if (prop == 1) {
        if ( a.avg_points > b.avg_points){
            return increasing ? -1 : 1;
        }
        if (a.avg_points < b.avg_points){
            return increasing ? 1 : -1;
        }
        return 0;
    }
    return 0;
} 