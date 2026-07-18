// "use client"

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FDRData, FDR_GW_i, SimpleTeamFDRDataModel } from '../models/fixturePlanning/TeamFDRData';
// import { KickOffTimesModel } from '../models/fixturePlanning/KickOffTimes';
// import { FixturePlanningProps, PageProps, fdrRotation } from '../models/shared/PageProps';
// import { RotationPlannerTeamInfoModel } from '../models/fixturePlanning/RotationPlannerTeamInfo';
// import { RotationPlannerTeamModel } from '../models/fixturePlanning/RotationPlannerTeam';
// import { FDRFormInput } from '../models/fixturePlanning/FDRFormInput';
// import { ErrorLoading, emptyErrorLoadingState } from '../models/shared/errorLoading';
// import { warning } from '@/components/shared/messages/messages';
// import { FixturePlanningType } from '@/types/fixturePlanningType';
// import { useTranslations } from 'next-intl';
// import { getApiUrl } from '@/lib/api';
// import { API_ENDPOINTS } from '@/lib/api-endpoints';

// interface FixtureDataResult {
//   fdrData: SimpleTeamFDRDataModel[];
//   fdrRotationData: RotationPlannerTeamModel[];
//   kickOffTimes: KickOffTimesModel[];
// }

// export default function useFixtureDataFPL(
//   searchQuery: string,
//   setFormInput: React.Dispatch<React.SetStateAction<FDRFormInput>>,
//   fixturePlanningType: FixturePlanningType
// ) {
//   const t = useTranslations('General');

//   const [data, setData] = useState<FixtureDataResult>({
//     fdrData: [],
//     fdrRotationData: [],
//     kickOffTimes: [],
//   });

//   const [errorLoading, setErrorLoading] = useState<ErrorLoading>(emptyErrorLoadingState);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);

//       try {
//         const url = getApiUrl(API_ENDPOINTS.FIXTURE_PLANNER, {
            
//         });
//         const res = await fetch(url);
//         console.log(res, "res", url)
//         if (!res.ok) throw new Error(`API error: ${res.status}`);

//         const raw = await res.text();
//         const parsed = JSON.parse(raw);

//         const { gw_start, gw_end, fdr_data, gws_and_dates } = parsed;

//         setFormInput(prev => ({
//           ...prev,
//           startGw: gw_start,
//           endGw: gw_end,
//         }));

//         const kickOffTimes: KickOffTimesModel[] = gws_and_dates?.map((item: string) => JSON.parse(item)) ?? [];

//         if (fixturePlanningType === 'rotation') {
//           const rotationData: RotationPlannerTeamModel[] = fdr_data.map((team: string) => {
//             const parsedTeam = JSON.parse(team);
//             return {
//               avg_Score: parsedTeam.avg_Score,
//               id_list: parsedTeam.id_list,
//               team_name_list: parsedTeam.team_name_list,
//               extra_fixtures: parsedTeam.extra_fixtures,
//               home_games: parsedTeam.home_games,
//               fixture_list: parsedTeam.fixture_list,
//             };
//           });

//           setData(prev => ({
//             ...prev,
//             fdrRotationData: rotationData,
//             kickOffTimes,
//           }));
//         } else {
//           const fdrTeamData: SimpleTeamFDRDataModel[] = fdr_data.map((team: any[]) => {
//             const teamName = JSON.parse(team[0][0][0]).team_name;
//             const FDR_gw_i: FDR_GW_i[] = [];
//             let totalScore = 0;

//             team.forEach((gw: any[]) => {
//               const gwData: FDRData[] = gw.map((fixture: string) => {
//                 const parsedFixture = JSON.parse(fixture);
//                 totalScore = parsedFixture.FDR_score;

//                 return {
//                   opponent_team_name: parsedFixture.opponent_team_name,
//                   difficulty_score: parsedFixture.difficulty_score,
//                   H_A: parsedFixture.H_A,
//                   double_blank: parsedFixture.double_blank,
//                   Use_Not_Use: parsedFixture.Use_Not_Use,
//                 };
//               });

//               FDR_gw_i.push({ fdr_gw_i: gwData });
//             });

//             return {
//               team_name: teamName,
//               FDR: FDR_gw_i,
//               checked: true,
//               fdr_total_score: totalScore,
//             };
//           });

//           setData(prev => ({
//             ...prev,
//             fdrData: fdrTeamData,
//             kickOffTimes,
//           }));
//         }

//         setErrorLoading(emptyErrorLoadingState);
//       } catch (error) {
//         console.error('Fetch error:', error);
//         setErrorLoading({
//           errorMessage: t('errorMessage') || 'An error occurred',
//           messageType: warning,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [searchQuery, fixturePlanningType, setFormInput, t]);

//   return {
//     isLoading,
//     errorLoading,
//     fdrData: data.fdrData,
//     fdrRotationData: data.fdrRotationData,
//     kickOffTimes: data.kickOffTimes,
//   };
// }