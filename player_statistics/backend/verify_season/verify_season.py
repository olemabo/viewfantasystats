from constants import current_season_name_premier_league, current_season_name_eliteserien, esf
from fixture_planner.models import KickOffTime, PremierLeagueTeamInfo
from fixture_planner.scripts.fill_fixture_planner_and_kick_off_time_db import fill_fixture_planner_and_kick_off_time_db
from fixture_planner_eliteserien.models import EliteserienKickOffTime, EliteserienTeamInfo
from fixture_planner_eliteserien.scripts.fill_eliteserien_kickoff_times_and_team_info_db import fill_eliteserien_kickoff_times_and_team_info_db
from player_statistics.db_models.eliteserien.season_metadata_model import EliteserienSeasonMetadata
from player_statistics.db_models.premier_league.season_metadata_model import PremierLeagueSeasonMetadata
from datetime import date
from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers
from player_statistics.db_models.eliteserien.ownership_statistics_model_eliteserien import EliteserienChipsAndUserInfo, EliteserienGlobalOwnershipStats5000, \
    EliteserienGlobalOwnershipStats1000, EliteserienGlobalOwnershipStats100, EliteserienGwsChecked
from player_statistics.db_models.eliteserien.nationality_statistics_model_eliteserien import EliteserienNationalityStatistics
from player_statistics.db_models.premier_league.nationality_statistics_model import PremierLeagueNationalityStatistics
from player_statistics.db_models.premier_league.ownership_statistics_model import PremierLeagueChipsAndUserInfo, PremierLeagueGlobalOwnershipStats100, \
    PremierLeagueGlobalOwnershipStats1000, PremierLeagueGlobalOwnershipStats10000, PremierLeagueGwsChecked
import datetime

def verify_season(league_name):
    # Determine the current season name and the appropriate model based on the league
    if league_name == esf:
        current_season_name = current_season_name_eliteserien
        SeasonMetadataModel = EliteserienSeasonMetadata
        PlayerModel = EliteserienPlayerStatistic
        leagueLabel = "EliteserienPlayerStatistic"
        FixtureDataModel = EliteserienTeamInfo
        fixtureLabel = "EliteserienTeamInfo"
        KickOffTimeModel = EliteserienKickOffTime
        KickOffTimeLabel = "EliteserienKickOffTime"
        updateFixtureAndKickoffTimesFunction = fill_eliteserien_kickoff_times_and_team_info_db
        GwsCheckedModel = EliteserienGwsChecked
        GwsCheckedLabel = "EliteserienGwsChecked"
        GlobalOwnershipStats_1_Model = EliteserienGlobalOwnershipStats100
        GlobalOwnershipStats_1_Label = "EliteserienGlobalOwnershipStats100"
        GlobalOwnershipStats_2_Model = EliteserienGlobalOwnershipStats1000
        GlobalOwnershipStats_2_Label = "EliteserienGlobalOwnershipStats1000"
        GlobalOwnershipStats_3_Model = EliteserienGlobalOwnershipStats5000
        GlobalOwnershipStats_3_Label = "EliteserienGlobalOwnershipStats5000"
        ChipsAndUserInfoModel = EliteserienChipsAndUserInfo
        ChipsAndUserInfoLabel = "EliteserienChipsAndUserInfo"
        NationalityStatisticsModel = EliteserienNationalityStatistics
        NationalityStatisticsLabel = "EliteserienNationalityStatistics"
        initGwsChecked = EliteserienGwsChecked(id=1, date_modified=datetime.datetime.today(),
            gws_updated_100=[0],
            gws_updated_1000=[0],
            gws_updated_5000=[0]
        )
    else:
        current_season_name = current_season_name_premier_league
        SeasonMetadataModel = PremierLeagueSeasonMetadata
        PlayerModel = PremierLeaguePlayers
        leagueLabel = "PremierLeaguePlayers"
        FixtureDataModel = PremierLeagueTeamInfo
        fixtureLabel = "PremierLeagueTeamInfo"
        KickOffTimeModel = KickOffTime
        KickOffTimeLabel = "KickOffTime"
        updateFixtureAndKickoffTimesFunction = fill_fixture_planner_and_kick_off_time_db
        GwsCheckedModel = PremierLeagueGwsChecked
        GwsCheckedLabel = "PremierLeagueGwsChecked"
        GlobalOwnershipStats_1_Model = PremierLeagueGlobalOwnershipStats100
        GlobalOwnershipStats_1_Label = "PremierLeagueGlobalOwnershipStats100"
        GlobalOwnershipStats_2_Model = PremierLeagueGlobalOwnershipStats1000
        GlobalOwnershipStats_2_Label = "PremierLeagueGlobalOwnershipStats1000"
        GlobalOwnershipStats_3_Model = PremierLeagueGlobalOwnershipStats10000
        GlobalOwnershipStats_3_Label = "PremierLeagueGlobalOwnershipStats10000"
        ChipsAndUserInfoModel = PremierLeagueChipsAndUserInfo
        ChipsAndUserInfoLabel = "PremierLeagueChipsAndUserInfo"
        NationalityStatisticsModel = PremierLeagueNationalityStatistics
        NationalityStatisticsLabel = "PremierLeagueNationalityStatistics"
        initGwsChecked = PremierLeagueGwsChecked(id=1, date_modified=datetime.datetime.today(),
            gws_updated_100=[0],
            gws_updated_1000=[0],
            gws_updated_10000=[0]
        )


    # Check if the current season exists in the database
    season_metadata_exists = SeasonMetadataModel.objects.filter(season_name=current_season_name).exists()

    if season_metadata_exists:
        print(f"Season: {current_season_name} exists")
    else:
        print(f"Season: {current_season_name} does not exist. Creating a new entry in {leagueLabel}.\n")

        new_metadata = SeasonMetadataModel(
                season_name=current_season_name,
                date_modified=date.today()
            )

        new_metadata.save()

        # Delete all previous rows in the season metadata table
        print(f"Deleting all rows in {leagueLabel}.")
        PlayerModel.objects.all().delete()

        # Delete all previous fixture data
        print(f"Deleting all rows in {fixtureLabel}.")
        FixtureDataModel.objects.all().delete()

        # Delete all previous kickofftimes data
        print(f"Deleting all rows in {KickOffTimeLabel}.")
        KickOffTimeModel.objects.all().delete()

        # Refill db with fixture and kickoff-times
        print(f"Updating fixuture and kickoff-times in {fixtureLabel} and {KickOffTimeLabel}.")
        updateFixtureAndKickoffTimesFunction()

        # Delete global stats from db
        print(f"Deleting all rows in {GwsCheckedLabel}.")
        GwsCheckedModel.objects.all().delete()

        print(f"Creating an initial state for {GwsCheckedLabel}.")
        initGwsChecked.save()

        print(f"Deleting all rows in {GlobalOwnershipStats_1_Label}.")
        GlobalOwnershipStats_1_Model.objects.all().delete()

        print(f"Deleting all rows in {GlobalOwnershipStats_2_Label}.")
        GlobalOwnershipStats_2_Model.objects.all().delete()

        print(f"Deleting all rows in {GlobalOwnershipStats_3_Label}.")
        GlobalOwnershipStats_3_Model.objects.all().delete()

        print(f"Deleting all rows in {ChipsAndUserInfoLabel}.")
        ChipsAndUserInfoModel.objects.all().delete()

        print(f"Deleting all rows in {NationalityStatisticsLabel}.")
        NationalityStatisticsModel.objects.all().delete()