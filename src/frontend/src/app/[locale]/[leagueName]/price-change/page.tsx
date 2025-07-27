// "use server"

// import DefaultPageContainer from "@/components/layout/default-page-container/default-page-container";
// import PlayerOwnership from "@/components/pages/player-ownership/player-ownership";
// import Popover from "@/components/shared/Popover/Popover";
// import { TOP_X_MANAGERS_DEFAULT } from "@/constants/constants";
// import { LeaguePath, LeagueTypeByPath, LeagueTypes } from "@/types/league";
// import { getTranslations } from "next-intl/server";

// export default async function Page({
//   params
// }: {
//   params: Promise<{leagueName: LeaguePath}>;
// }) {
//   const {leagueName} = await params;
//   const leagueType = LeagueTypeByPath[leagueName];
//   const t = await getTranslations('Statistics.PlayerOwnership');

//   const ownershipDescription = leagueType === LeagueTypes.FPL ? t('OwnershiptDescriptionFPL') : t('OwnershiptDescription');

//   return (
//     <DefaultPageContainer 
//       pageClassName='player-ownership-container'
//       style={isLatestGw ? undefined : {maxWidth: 615}}
//       leagueType={leagueType}
//       heading={t('Title')} 
//       description={t('Description')}
//     >
//       <h1>
//           {t('Title')}
//           <Popover 
//               popoverTitle={t('Title')} 
//               iconSize={14}
//               iconPosition={[-10, 0, 0, 3]}
//               alignLeft
//           >
//               {ownershipDescription}
//           </Popover>
//       </h1>
//       <PlayerOwnership
//         leagueType={leagueType}
//         topXManagersDefault={TOP_X_MANAGERS_DEFAULT[leagueType]}
//       />
//     </DefaultPageContainer>
//   );
// }