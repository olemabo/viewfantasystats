import { useState, useEffect } from 'react';
import axios from 'axios';
import { LeagueType } from '../models/shared/LeagueType';
import { TeamNameAndIdModel } from '../models/playerOwnership/TeamNameAndIdModel';
import { ChipUsageModel } from '../models/playerOwnership/ChipUsageModel';
import { PlayerOwnershipModel } from '../models/playerOwnership/PlayerOwnershipModel';
import { getObjectDataFromKeys } from '../utils/getObjectDataFromKeys';

interface ChipStats {
    chipUsageRound: number[];
    chipUsageTotal: number[];
}

interface OwnershipMetaData {
    updatingGw: number;
    updatingPrecentage: number;
    topXPlayersList: any[];
    availableGws: any[];
    currentGW: number;
    teamNameAndIds: TeamNameAndIdModel[];
}

const usePlayerOwnership = (leagueType: LeagueType, currentUserGw: number, topXPlayers: number) => {
    const playeyOwnershipApiPath = '/statistics/player-ownership-api/';

    const [chipData, setChipData] = useState<ChipStats>({
        chipUsageRound: [],
        chipUsageTotal: [],
    });

    const [ownershipMetaData, setOwnershipMetaData] = useState<OwnershipMetaData>({
        updatingGw: 0.0,
        updatingPrecentage: 0,
        currentGW: 0,
        topXPlayersList: [],
        availableGws: [],
        teamNameAndIds: []
    });

    const [ allOwnershipData, setAllOwnershipData ] = useState<PlayerOwnershipModel[]>([]);

    const [ errorLoading, setErrorLoading] = useState<boolean>(false);
    const [ isLoading, setIsLoading] = useState<boolean>(false);
    const [ emptyDataMessage, setEmptyDataMessage ] = useState(false);
    
    const total_number_of_gws = 38;
    const gwKeys = Object.fromEntries(Array.from({ length: total_number_of_gws }, (_, i) => [i + 1, `gw_${i + 1}` ]));
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {      
                const response = await axios.get(`${playeyOwnershipApiPath}?league_name=${leagueType}&top_x_players=${topXPlayers}&current_gw=${currentUserGw}`);

                if (response?.data?.length === 0) {
                    setEmptyDataMessage(true)
                    setIsLoading(false);
                    return;
                }
                
                const data = JSON.parse(response?.data);

                const currentChipData = data.chip_data.find((x: ChipUsageModel) => x.gw === data.newest_updated_gw);
                const chipData = currentChipData ? currentChipData.chip_data : [];
                const totalChipUsage = currentChipData ? currentChipData.total_chip_usage : [];
                
                const tempOwnershipModel = data.ownershipdata.map((y: any) => {
                    const parsedData = JSON.parse(y);
                    const ownershipData = getObjectDataFromKeys(parsedData, data.newest_updated_gw, gwKeys);
                    return {
                        player_name: parsedData.player_name,
                        player_position_id: parsedData.player_position_id,
                        player_team_id: parsedData.player_team_id,
                        ownership: ownershipData,
                        filter_out: false
                    };
                });

                setChipData({
                    chipUsageRound: chipData,
                    chipUsageTotal: totalChipUsage
                });
                
                setOwnershipMetaData({
                    updatingGw: data?.is_updating_gw,
                    updatingPrecentage: data?.is_updating_precentage,
                    topXPlayersList: data?.top_x_managers_list,
                    teamNameAndIds: UpdateTeamNameAndIds(data.team_names_and_ids),
                    availableGws: data?.available_gws,
                    currentGW: data.newest_updated_gw,
                });

                setAllOwnershipData(tempOwnershipModel);

                setIsLoading(false);
                setErrorLoading(false);
            } catch (error) {
                setErrorLoading(true);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [leagueType, currentUserGw, topXPlayers]);

    function UpdateTeamNameAndIds(data: any) {
        return data.map((team: any) => {
            const parsed = JSON.parse(team);
            return {
                team_name: parsed.team_name,
                team_id: parsed.id
            };
        });
    }

    return { 
        isLoading, 
        errorLoading, 
        emptyDataMessage, 
        chipData, 
        allOwnershipData,
        ownershipMetaData,
     };
};

export default usePlayerOwnership;
