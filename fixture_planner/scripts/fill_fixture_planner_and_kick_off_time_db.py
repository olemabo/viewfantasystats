import django
import sys
import os

path = os.path.abspath('../..') if "OleMartinBorge" in os.getcwd() else "/home/olebo/viewfantasystats/"

sys.path.append(path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()

import fixture_planner.backend.create_data_objects as create_data_objects
import fixture_planner.backend.read_fixture_planner_data as read_data
from fixture_planner.models import PremierLeagueTeamInfo, KickOffTime
from constants import total_number_of_gameweeks


def fill_fixture_planner_and_kick_off_time_db():
    """
    Fill fixture planner db (PremierLeagueTeamInfo) and kick off times db (KickOffTime)
    :param request:
    :return:
    """
    df, names, short_names, ids = create_data_objects.return_fixture_names_shortnames("api")
    number_of_teams = len(names)
    for team_i in range(number_of_teams):
        print("Updating team: ", names[team_i])
        oppTeamNameList, oppTeamHomeAwayList, oppTeamDifficultyScore, gw = [], [], [], []
        team_info = df.loc[team_i]
        for j in range(total_number_of_gameweeks):
            gw_info_TEAM_HA_SCORE_GW = team_info.iloc[j + 1]
            oppTeamNameList.append(gw_info_TEAM_HA_SCORE_GW[0])
            oppTeamHomeAwayList.append(gw_info_TEAM_HA_SCORE_GW[1])
            oppTeamDifficultyScore.append(gw_info_TEAM_HA_SCORE_GW[2])
            gw.append(gw_info_TEAM_HA_SCORE_GW[3])

        fill_fixture_planner_model = PremierLeagueTeamInfo(team_name=names[team_i],
                                                    team_id=ids[team_i],
                                                    team_short_name=short_names[team_i],
                                                    oppTeamDifficultyScore=oppTeamDifficultyScore,
                                                    oppTeamHomeAwayList=oppTeamHomeAwayList,
                                                    oppTeamNameList=oppTeamNameList,
                                                    gw=gw)
        fill_fixture_planner_model.save()

    kick_off_time_info = read_data.return_kick_off_time("api")
    for gw_info in kick_off_time_info:
        fill_kick_off_time_model = KickOffTime(gameweek=gw_info[0], kickoff_time=gw_info[1], day_month=gw_info[2])
        fill_kick_off_time_model.save()


fill_fixture_planner_and_kick_off_time_db()

