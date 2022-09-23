from fixture_planner_eliteserien.backend.fixture_algorithms.fixture_periode_algorithm import find_best_fixture_with_min_length_each_team_eliteserien
from fixture_planner_eliteserien.backend.fixture_algorithms.fixture_rotation_algorithms import find_best_rotation_combosEliteserien
from fixture_planner_eliteserien.backend.fixture_algorithms.fixture_planner_alortihm import fdr_planner_eliteserien
from fixture_planner_eliteserien.backend.read_eliteserien_data import readEliteserienExcelFromDagFinnToDBFormat
from fixture_planner_eliteserien.models import EliteserienKickOffTime, EliteserienTeamInfo
from utils.util_functions.fixture.get_upcoming_gw import get_upcoming_gw_eliteserien
from utils.dictionaries import dict_month_number_to_month_name_short
from django.http import HttpResponse, JsonResponse
from utils.dataFetch.DataFetch import DataFetch
from constants import eliteserien_api_url, current_season_name_eliteserien, eliteserien_folder_name, path_to_store_local_data, fixture_folder_name

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from datetime import date

from utils.fixtures.apiResponse.EliteserienFDRApiResponse import EliteserienFDRApiResponse
from utils.fixtures.models.WhichTeamToCheckModel import WhichTeamToCheckModel
from utils.fixtures.models.KickOffTimesModel import KickOffTimesModel

class GetKickOffTimesEliteserien(APIView):

    def get(self, request, format=None):
        response_list = []
        
        kick_off_times_db = EliteserienKickOffTime.objects.all()
        for kick_of_time in kick_off_times_db:
            response_list.append(KickOffTimesModel(
                gameweek=kick_of_time.gameweek,
                kickoff_time=kick_of_time.kickoff_time,
                day_month=kick_of_time.day_month,
            ).toJson())
        
        return JsonResponse(response_list, safe=False)
 

class PostEliteserienFDRData(APIView):

    def post(self, request, format=None):
        try:
            start_gw = int(request.data.get("start_gw"))
            end_gw = int(request.data.get("end_gw"))
            min_num_fixtures = int(request.data.get("min_num_fixtures"))
            combinations = str(request.data.get("combinations"))

            fdr_fixture_data = []
            xlsx_path = path_to_store_local_data  + "/" + eliteserien_folder_name + "/" + current_season_name_eliteserien + "/" + fixture_folder_name + "/" + "Eliteserien_fixtures.xlsx"
            fixture_list_db, dates, fdr_to_colors_dict, team_name_color = readEliteserienExcelFromDagFinnToDBFormat()
            
            if start_gw < 0:
                start_gw = get_upcoming_gw_eliteserien()
                end_gw = start_gw + 5
                if (end_gw > len(dates)):
                    end_gw = len(dates)
            
            team_dict = {}

            number_of_teams = len(fixture_list_db)
            fixture_list = [fixture_list_db[i] for i in range(0, number_of_teams)]

            for i in range(number_of_teams):
                team_dict[fixture_list[i].team_name] = WhichTeamToCheckModel(fixture_list[i].team_name, 'checked')
            
            team_name_list = []
            fixture_list = []

            for i in range(number_of_teams):
                temp_object = team_dict[fixture_list_db[i].team_name]
                team_name_list.append(team_dict[fixture_list_db[i].team_name])
                if temp_object.checked == 'checked':
                    fixture_list.append(fixture_list_db[i])

            if (max(dates) + 1 < end_gw):
                end_gw = max(dates) + 1
                        
            fdr_fixture_data = []
             
            if combinations == 'FDR':
                fdr_fixture_data = fdr_planner_eliteserien(fixture_list, start_gw, end_gw)
                
            if abs(min_num_fixtures) > (end_gw - start_gw):
                min_num_fixtures = abs(end_gw - start_gw) + 1
                if min_num_fixtures == 0:
                    min_num_fixtures = 1
                    end_gw = start_gw + 1

            if combinations == 'FDR-best':
                fdr_fixture_data = find_best_fixture_with_min_length_each_team_eliteserien(
                    fixture_list,
                    GW_start=start_gw,
                    GW_end=end_gw,
                    min_length=min_num_fixtures)
            
            if combinations == 'Rotation':
                teams_to_check = int(request.data.get("teams_to_check"))
                teams_to_play = int(request.data.get("teams_to_play"))
                teams_in_solution = request.data.get("teams_in_solution")
                fpl_teams = request.data.get("fpl_teams")

                rotation_data = []
                remove_these_teams = []
                for team_sol in teams_in_solution:
                    if team_sol not in fpl_teams:
                        remove_these_teams.append(team_sol)
                for remove_team in remove_these_teams:
                    teams_in_solution.remove(remove_team)
                for i in team_name_list:
                    if i.team_name in teams_in_solution:
                        i.checked_must_be_in_solution = 'checked'

                rotation_data = find_best_rotation_combosEliteserien(fixture_list_db, start_gw, end_gw,
                                                            teams_to_check=teams_to_check, teams_to_play=teams_to_play,
                                                            team_names=fpl_teams, 
                                                            teams_in_solution=teams_in_solution,
                                                            teams_not_in_solution=[],
                                                            top_teams_adjustment=False, one_double_up=False,
                                                            home_away_adjustment=True, include_extra_good_games=False,
                                                            num_to_print=0)

                if rotation_data == -1:
                    rotation_data = [['Wrong input', [], [], 0, 0, [[]]]]
                else:
                    rotation_data = rotation_data[:(min(len(rotation_data), 50))]
                
                fdr_fixture_data = rotation_data
            
            kick_off_times_db = EliteserienKickOffTime.objects.all()
            temp_kick_off_time = []
            for kick_off_time in kick_off_times_db:
                if (kick_off_time.gameweek - 1 in dates):
                    temp_kick_off_time.append(KickOffTimesModel(
                        kick_off_time.gameweek,
                        kick_off_time.kickoff_time,
                        kick_off_time.day_month
                    ).toJson())
            
            fdr_and_gws = EliteserienFDRApiResponse(fdr_fixture_data, temp_kick_off_time, fdr_to_colors_dict, team_name_color, start_gw, end_gw) 

            return JsonResponse(fdr_and_gws.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)



def FillEliteserienKickOffTimesAndTeamInfoDB(request):
    elObject = DataFetch(eliteserien_api_url)
    static_bootstrap = elObject.get_current_fpl_info()
    teams = static_bootstrap['teams']
    if (len(teams) > 0):
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

    return HttpResponse("Successfully filled 'EliteserienTeamInfo' and 'EliteserienKickOffTime' Databases")