import django
import sys
import os

prod = "/home/olebo/viewfantasystats/"
local = os.path.abspath('../..')

sys.path.append(prod)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()

from fixture_planner_eliteserien.models import EliteserienKickOffTime, EliteserienTeamInfo
from utils.dictionaries import dict_month_number_to_month_name_short
from utils.dataFetch.DataFetch import DataFetch
from constants import eliteserien_api_url
from datetime import date


def fill_eliteserien_kickoff_times_and_team_info_db():
    eliteserien_client = DataFetch(eliteserien_api_url)
    static_bootstrap = eliteserien_client.get_current_fpl_info()
    teams = static_bootstrap['teams']
    
    if (len(teams) > 0):
        EliteserienTeamInfo.objects.all().delete()

        for team in teams:
            if not team['unavailable']:
                if len(EliteserienTeamInfo.objects.filter(team_id=team['id'])) > 0:
                    fill_model = EliteserienTeamInfo.objects.filter(team_id=team['id'])
                    fill_model.update(
                        team_name = team['name'], 
                        team_short_name = team['short_name'],
                        date = date.today()
                    )
                    print("Updated: ", team['name'], " whit team id: ", team['id'])
                else:
                    fill_model = EliteserienTeamInfo(
                        team_id = team['id'],
                        team_name = team['name'], 
                        team_short_name =  team['short_name'],
                        date = date.today()
                    )
                    fill_model.save()
                    print("Added: ", team['name'], " whit team id: ", team['id'])
    
    number_of_gws = len(static_bootstrap['events'])
    kick_off_time_info = []
    
    for gw in range(number_of_gws):
        gw_info = static_bootstrap['events'][gw]
        kick_off_time = gw_info['deadline_time']
        month = int(kick_off_time.split("-")[1])
        day = str(kick_off_time.split("T")[0].split("-")[2])
        kick_off_time_short = day + " " + dict_month_number_to_month_name_short[str(month)]
        kick_off_time_info.append([gw + 1, kick_off_time, kick_off_time_short])
    
    for gw_info in kick_off_time_info:
        fill_kick_off_time_model = EliteserienKickOffTime(gameweek=gw_info[0], kickoff_time=gw_info[1], day_month=gw_info[2])
        fill_kick_off_time_model.save()


fill_eliteserien_kickoff_times_and_team_info_db()

