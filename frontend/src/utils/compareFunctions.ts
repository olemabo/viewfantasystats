import { PlayerOwnershipModel } from '../models/playerOwnership/PlayerOwnershipModel';
import { PlayerStatisticsModel } from '../models/playerStatistics/PlayerStatisticsModel';
import { PriceChangeModel } from '../models/priceChange/PriceChangeModel';
import { RankModel } from '../models/RankStatistics/RankStatistics';

export const propComparator = (sortIndex: number, increasing: boolean) =>
    (a: PlayerOwnershipModel, b: PlayerOwnershipModel) => {
    if (sortIndex == 0) {
        if (a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 > b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3) {
            return increasing ? -1 : 1;
        }
        if (a.ownership[0] + a.ownership[1] * 2 + a.ownership[2] * 3 < b.ownership[0] + b.ownership[1] * 2 + b.ownership[2] * 3) {
            return increasing ? 1 : -1;
        }
        return 0;
    }
    else {
        if ( a.ownership[sortIndex] > b.ownership[sortIndex]){
            return increasing ? -1 : 1;
        }
        if (a.ownership[sortIndex] < b.ownership[sortIndex]){
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

export const propComparatorRankModel = (prop: string, increasing: boolean) =>
    (a: RankModel, b: RankModel) => {
    if (prop === 'Rank') {
        if ( a.avg_rank < b.avg_rank){
            return increasing ? -1 : 1;
        }
        if (a.avg_rank > b.avg_rank){
            return increasing ? 1 : -1;
        }
        return 0;
    }
    if (prop === 'Points') {
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

export const propComparatorPriceChangeModel = (prop: string, increasing: boolean) =>
    (a: PriceChangeModel, b: PriceChangeModel) => {
    if (prop === 'Percentage') {
        if ( Number(a.selected_by_percent) > Number(b.selected_by_percent)){
            return increasing ? -1 : 1;
        }
        if (Number(a.selected_by_percent) < Number(b.selected_by_percent)){
            return increasing ? 1 : -1;
        }
        return 0;
    }

    if (prop === 'Status') {
        if ( a.status > b.status){
            return increasing ? -1 : 1;
        }
        if (a.status < b.status){
            return increasing ? 1 : -1;
        }
        return 0;
    }
    
    if (prop === 'Price') {
        if ( a.now_cost > b.now_cost){
            return increasing ? -1 : 1;
        }
        if (a.now_cost < b.now_cost){
            return increasing ? 1 : -1;
        }
        return 0;
    }
    if (prop === 'NetTransfers') {
        const netTransfersA = a.transfers_in_event - a.transfers_out_event;
        const netTransfersB = b.transfers_in_event - b.transfers_out_event;
        if ( netTransfersA > netTransfersB){
            return increasing ? -1 : 1;
        }
        if (netTransfersA < netTransfersB){
            return increasing ? 1 : -1;
        }
        return 0;
    }

    if (prop === 'TransfersIn') {
        if ( a.transfers_in_event > b.transfers_in_event){
            return increasing ? -1 : 1;
        }
        if (a.transfers_in_event < b.transfers_in_event){
            return increasing ? 1 : -1;
        }
        return 0;
    }

    if (prop === 'TransfersOut') {
        if ( a.transfers_out_event > b.transfers_out_event){
            return increasing ? -1 : 1;
        }
        if (a.transfers_out_event < b.transfers_out_event){
            return increasing ? 1 : -1;
        }
        return 0;
    }

    if (prop === 'Change') {
        if ( a.cost_change_event > b.cost_change_event){
            return increasing ? -1 : 1;
        }
        if (a.cost_change_event < b.cost_change_event){
            return increasing ? 1 : -1;
        }
        return 0;
    }
    
    return 0;
}

export const propComparatorPlayerStatistics = (sortIndex: number, increasing: boolean) =>
    (a: PlayerStatisticsModel, b: PlayerStatisticsModel) => {
    const first_value = a.player_statistics_list[sortIndex];
    const second_value = b.player_statistics_list[sortIndex];
    
    if (first_value > second_value){
        return increasing ? -1 : 1;
    }
    
    if (first_value < second_value){
        return increasing ? 1 : -1;
    }
    
    return 0;
} 