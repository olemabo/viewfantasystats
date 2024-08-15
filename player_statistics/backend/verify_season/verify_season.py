from constants import current_season_name_premier_league, current_season_name_eliteserien, esf
from player_statistics.db_models.eliteserien.season_metadata_model import EliteserienSeasonMetadata
from player_statistics.db_models.premier_league.season_metadata_model import PremierLeagueSeasonMetadata
from datetime import date
from player_statistics.db_models.eliteserien.player_statistics_model import EliteserienPlayerStatistic
from player_statistics.db_models.premier_league.player_statistics_model import PremierLeaguePlayers

def verify_season(league_name):
    # Determine the current season name and the appropriate model based on the league
    if league_name == esf:
        current_season_name = current_season_name_eliteserien
        SeasonMetadataModel = EliteserienSeasonMetadata
        PlayerModel = EliteserienPlayerStatistic
        league_label = "EliteserienPlayerStatistic"
    else:
        current_season_name = current_season_name_premier_league
        SeasonMetadataModel = PremierLeagueSeasonMetadata
        PlayerModel = PremierLeaguePlayers
        league_label = "PremierLeaguePlayers"

    # Check if the current season exists in the database
    season_metadata_exists = SeasonMetadataModel.objects.filter(season_name=current_season_name).exists()

    if season_metadata_exists:
        print(f"Season: {current_season_name} exists")
    else:
        print(f"Season: {current_season_name} does not exist. Creating a new entry in {league_label}.")

        new_metadata = SeasonMetadataModel(
                season_name=current_season_name,
                date_modified=date.today()
            )

        new_metadata.save()

        # Delete all previous rows in the season metadata table
        print(f"Deleting all rows in {league_label}.")
        PlayerModel.objects.all().delete()

        # TODO: Delete global stats from db