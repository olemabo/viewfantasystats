import { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorLoading, emptyErrorLoadingState } from '../models/shared/errorLoading';
import { warning } from '../components/Shared/Messages/Messages';
import { LeagueType } from '../models/shared/LeagueType';
import { PriceChangeModel } from '../models/priceChange/PriceChangeModel';
import { TeamNameAndIdModel } from '../models/playerOwnership/TeamNameAndIdModel';

const usePriceChange = (leagueType: LeagueType, languageContent: any) => {
    const playerOwnershipApiPath = "/statistics/price-change-api/";

    const [priceChange, setPriceChange] = useState<PriceChangeModel[]>([]);
    const [teamNameAndIds, setTeamNameAndIds] = useState<TeamNameAndIdModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorLoading, setErrorLoading] = useState<ErrorLoading>(emptyErrorLoadingState);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(playerOwnershipApiPath, {
                    params: { league_name: leagueType }
                });
                
                const data = JSON.parse(response.data);
                
                const priceChangeModel: PriceChangeModel[] = [];
                data.player_transfers.map((rank: string) => {
                    const parsedData: PriceChangeModel = JSON.parse(rank);
                    priceChangeModel.push({
                        cost_change_event: parsedData.cost_change_event,
                        cost_change_start: parsedData.cost_change_start,
                        transfers_in: parsedData.transfers_in,
                        transfers_in_event: parsedData.transfers_in_event,
                        transfers_out: parsedData.transfers_out,
                        transfers_out_event: parsedData.transfers_out_event,
                        web_name: parsedData.web_name,
                        team_code: parsedData.team_code,
                        element_type: parsedData.element_type,
                        status: parsedData.status,
                        now_cost: parsedData.now_cost,
                        selected_by_percent: parsedData.selected_by_percent,
                        net_transfer_prev_gws: parsedData.net_transfer_prev_gws,
                    });
                });
                
                setPriceChange(priceChangeModel);
                setTeamNameAndIds(UpdateTeamNameAndIds(data.team_names_and_ids))
                
                setIsLoading(false);
                setErrorLoading(emptyErrorLoadingState);
            } catch (error) {
                setErrorLoading({
                    errorMessage: languageContent.General.errorMessage || 'An error occurred',
                    messageType: warning,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [leagueType]);

    function UpdateTeamNameAndIds(data: any) {
        return data.map((team: any) => {
            const parsed = JSON.parse(team);
            return {
                team_name: parsed.team_name,
                team_id: parsed.id
            };
        });
    }

    return { priceChange, teamNameAndIds, isLoading, errorLoading };
};

export default usePriceChange;
