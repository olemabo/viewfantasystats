import { useState, useEffect } from 'react';
import { LeagueType } from '../models/shared/LeagueType';
import { ChipUsageModel } from '../models/playerOwnership/ChipUsageModel';
import { PlayerOwnershipModel } from '../models/playerOwnership/PlayerOwnershipModel';
import { getObjectDataFromKeys } from '../utils/getObjectDataFromKeys';
import { ErrorLoading, emptyErrorLoadingState } from '../models/shared/errorLoading';
import { info, warning } from '@/components/shared/messages/messages';
import { useTranslations } from 'next-intl';
import { getApiUrl } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

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
}

interface PlayerOwnershipData {
  chip: ChipStats;
  metadata: OwnershipMetaData;
  ownership: PlayerOwnershipModel[];
}

const TOTAL_GWS = 38;
const gwKeys = Object.fromEntries(
  Array.from({ length: TOTAL_GWS }, (_, i) => [i + 1, `gw_${i + 1}`])
);

export default function usePlayerOwnership(
  leagueType: LeagueType,
  currentUserGw: number,
  topXPlayers: number
) {
  const t = useTranslations('General');
  const s = useTranslations('Statistics');

  const [ownershipData, setOwnershipData] = useState<PlayerOwnershipData>({
    chip: { chipUsageRound: [], chipUsageTotal: [] },
    metadata: {
      updatingGw: 0,
      updatingPrecentage: 0,
      topXPlayersList: [],
      availableGws: [],
      currentGW: 0,
    },
    ownership: [],
  });

  const [errorLoading, setErrorLoading] = useState<ErrorLoading>(emptyErrorLoadingState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const url = getApiUrl(API_ENDPOINTS.PLAYER_OWNERSHIP, {
          league_name: leagueType,
          top_x_players: topXPlayers,
          current_gw: currentUserGw,
        });

        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const raw = await res.text();
        const data = JSON.parse(raw);

        if (!data?.ownershipdata?.length) {
          setErrorLoading({
            errorMessage: s("PlayerOwnership.no_data_found"),
            messageType: info,
          });
          return;
        }

        const chip = data.chip_data?.find(
          (c: ChipUsageModel) => c.gw === data.newest_updated_gw
        );

        const chipStats: ChipStats = {
          chipUsageRound: chip?.chip_data ?? [],
          chipUsageTotal: chip?.total_chip_usage ?? [],
        };

        const ownershipModels: PlayerOwnershipModel[] = data.ownershipdata.map((item: string) => {
          const parsed = JSON.parse(item);
          return {
            player_name: parsed.player_name,
            player_position_id: parsed.player_position_id,
            player_team_id: parsed.player_team_id,
            ownership: getObjectDataFromKeys(parsed, data.newest_updated_gw, gwKeys),
            filter_out: false,
          };
        });

        const metadata: OwnershipMetaData = {
          updatingGw: data.is_updating_gw,
          updatingPrecentage: data.is_updating_precentage,
          topXPlayersList: data.top_x_managers_list ?? [],
          availableGws: data.available_gws ?? [],
          currentGW: data.newest_updated_gw ?? 0,
        };

        setOwnershipData({
          chip: chipStats,
          metadata,
          ownership: ownershipModels,
        });

        setErrorLoading(emptyErrorLoadingState);
      } catch (error) {
        console.error('Fetch error:', error);
        setErrorLoading({
          errorMessage: t('errorMessage') || 'An error occurred',
          messageType: warning,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [leagueType, currentUserGw, topXPlayers, t]);

  return {
    isLoading,
    errorLoading,
    ownershipData,
  };
}