from fixture_planner_eliteserien.backend.fixture_algorithms.fixture_periode_algorithm import find_best_fixture_with_min_length_each_team_eliteserien
from fixture_planner_eliteserien.backend.fixture_algorithms.fixture_rotation_algorithms import find_best_rotation_combosEliteserien
from fixture_planner_eliteserien.backend.fixture_algorithms.fixture_planner_alortihm import fdr_planner_eliteserien
from fixture_planner_eliteserien.backend.read_eliteserien_data import read_eliteserien_excel_to_db_format
from utils.util_functions.fixture.get_upcoming_gw import get_upcoming_gw_eliteserien
from fixture_planner_eliteserien.models import EliteserienKickOffTime
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from utils.fixtures.apiResponse.EliteserienFDRApiResponse import EliteserienFDRApiResponse
from utils.fixtures.models.WhichTeamToCheckModel import WhichTeamToCheckModel
from utils.fixtures.models.KickOffTimesModel import KickOffTimesModel

class KickoffTimes(APIView):

    def get(self):
        response_list = []
        
        kick_off_times_db = EliteserienKickOffTime.objects.all()
        
        for kick_of_time in kick_off_times_db:
            response_list.append(KickOffTimesModel(
                gameweek=kick_of_time.gameweek,
                kickoff_time=kick_of_time.kickoff_time,
                day_month=kick_of_time.day_month,
            ).toJson())
        
        return JsonResponse(response_list, safe=False)
 

class FDRData(APIView):

    def post(self, request):
        try:
            fdr_type = get_request_body(request, "fdr_type", str)

            fixture_list_db, dates, fdr_to_colors_dict, team_name_color = read_eliteserien_excel_to_db_format(fdr_type)

            start_gw, end_gw, min_num_fixtures, combinations = get_data_from_body(request, dates)

            number_of_teams = len(fixture_list_db)
            fixture_list = [fixture_list_db[i] for i in range(0, number_of_teams)]

            team_dict = {}
            for i in range(number_of_teams):
                team_dict[fixture_list[i].team_name] = WhichTeamToCheckModel(fixture_list[i].team_name, 'checked')
            
            team_name_list = []
            fixture_list = []
            fdr_fixture_data = []

            for i in range(number_of_teams):
                temp_object = team_dict[fixture_list_db[i].team_name]
                team_name_list.append(team_dict[fixture_list_db[i].team_name])
                if temp_object.checked == 'checked':
                    fixture_list.append(fixture_list_db[i])
                        
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
                teams_to_check = get_request_body(request, "teams_to_check", int)
                teams_to_play = get_request_body(request, "teams_to_play", int)
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

                rotation_data = find_best_rotation_combosEliteserien(
                    fixture_list_db, start_gw, end_gw, teams_to_check=teams_to_check, 
                    teams_to_play=teams_to_play, team_names=fpl_teams, 
                    teams_in_solution=teams_in_solution, teams_not_in_solution=[],
                    top_teams_adjustment=False, one_double_up=False,
                    home_away_adjustment=True, include_extra_good_games=False)
                
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



def get_data_from_body(request, dates):
    start_gw = get_request_body(request, "start_gw", int)
    end_gw = get_request_body(request, "end_gw", int)
    min_num_fixtures = get_request_body(request, "min_num_fixtures", int)
    combinations = get_request_body(request, "combinations", str)
     
    if start_gw < 0:
        start_gw = get_upcoming_gw_eliteserien()
        end_gw = start_gw + 5
        if (end_gw > len(dates)):
            end_gw = len(dates)
        if (start_gw == 1):
            end_gw = len(dates)
    
    end_gw = max(dates) + 1 if (max(dates) + 1 < end_gw) else end_gw

    start_gw = 1 if start_gw > end_gw else start_gw    
    
    return start_gw, end_gw, min_num_fixtures, combinations


def get_request_body(request, parameter_name, parameter_type):
    return parse_input(request.data.get(parameter_name), parameter_type)

def parse_input(input_str, data_type):
    try:
        parsed_input = data_type(input_str)
        return parsed_input
    except ValueError:
        print("Error: could not parse input as", data_type.__name__)
        return None