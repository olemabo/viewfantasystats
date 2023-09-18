from fixture_planner_eliteserien.backend.fixture_algorithms.fixture_periode_algorithm import find_best_fixture_with_min_length_each_team_eliteserien
from fixture_planner_eliteserien.backend.fixture_algorithms.fixture_rotation_algorithms import find_best_rotation_combosEliteserien_gw_list
from fixture_planner_eliteserien.backend.fixture_algorithms.fixture_planner_alortihm import fdr_planner_eliteserien_fixture_list
from fixture_planner_eliteserien.backend.read_team_players_from_team_id import read_team_players_from_team_id
from fixture_planner_eliteserien.backend.read_eliteserien_data import read_eliteserien_excel_to_db_format
from fixture_planner_eliteserien.backend.utility_functions import create_eliteserien_fdr_dict
from utils.util_functions.convertFDRdata_to_FDR_Model import convertFDRToModel
from utils.util_functions.get_player_data import getPlayerData
from utils.util_functions.get_upcoming_gw import get_upcoming_gw_eliteserien
from utils.util_functions.get_request_data import get_request_body
from utils.util_functions.get_kickoff_data import getKickOffData

from models.fixtures.apiResponse.FDRTeamIDApiResponse import FDRApiResponse, FDRTeamIDApiResponse
from models.fixtures.models.TeamNameShortPlayerNameModel import TeamNameShortPlayerNameModel
from fixture_planner_eliteserien.models import EliteserienKickOffTime
from models.fixtures.models.FDRTeamIdModel import FDRTeamIDModel
from django.http import JsonResponse
from constants import esf

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from models.fixtures.apiResponse.EliteserienFDRApiResponse import EliteserienFDRApiResponse
from models.fixtures.models.WhichTeamToCheckModel import WhichTeamToCheckModel
from models.fixtures.models.KickOffTimesModel import KickOffTimesModel


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

            excludeGws = request.data.get("excludeGws")

            current_gws = [gw for gw in range(start_gw, end_gw + 1)]
            if (excludeGws is not None):
                current_gws = [x for x in current_gws if x not in excludeGws]

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
                fdr_fixture_data = fdr_planner_eliteserien_fixture_list(fixture_list, current_gws)
                
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

                rotation_data = find_best_rotation_combosEliteserien_gw_list(
                    fixture_list_db, current_gws, teams_to_check=teams_to_check, 
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
                if (kick_off_time.gameweek in current_gws):
                    temp_kick_off_time.append(KickOffTimesModel(
                        kick_off_time.gameweek,
                        kick_off_time.kickoff_time,
                        kick_off_time.day_month
                    ).toJson())
            
            max_gw = len(dates)
            
            fdr_and_gws = EliteserienFDRApiResponse(fdr_fixture_data, temp_kick_off_time, fdr_to_colors_dict, team_name_color, start_gw, end_gw, max_gw) 
            
            return JsonResponse(fdr_and_gws.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class PostFDRFromTeamIDView(APIView):
    
    def get(self, request):
        fixture_list_db, dates, _, _ = read_eliteserien_excel_to_db_format("")
        fixture_list_db_def, dates, _, _ = read_eliteserien_excel_to_db_format("_defensivt")
        fixture_list_db_off, dates, _, _ = read_eliteserien_excel_to_db_format("_offensivt")
                
        current_gws = [gw for gw in range(0, len(dates) + 1)]
                
        number_of_gws = len(dates)
        
        fdr_data_list = getFixtureData(fixture_list_db, number_of_gws)
        fdr_data_defensive_list = getFixtureData(fixture_list_db_def, number_of_gws)
        fdr_data_offensive_list = getFixtureData(fixture_list_db_off, number_of_gws)
            
        temp_kick_off_time, first_upcoming_game = getKickOffData(esf)
        player_list = getPlayerData(esf)

        gw_end = first_upcoming_game + 6 if len(current_gws) > 7 else current_gws[-1]
        gw_start = current_gws[0]
        max_gw = current_gws[-1]
        
        fdr_and_gws = FDRApiResponse(fdr_data_list, fdr_data_defensive_list, fdr_data_offensive_list, temp_kick_off_time, gw_start, gw_end, first_upcoming_game, max_gw, player_list) 

        return JsonResponse(fdr_and_gws.toJson(), safe=False)


    def post(self, request):
        try:
            goal_keepers, defenders, midtfielders, forwards = [], [], [], []

            fdr_and_gws = FDRTeamIDApiResponse(goal_keepers, defenders, midtfielders, forwards) 

            current_gw = get_request_body(request, "current_gw", int)

            team_id = get_request_body(request, "team_id", int)

            if team_id < 1:
                return JsonResponse(fdr_and_gws.toJson(), safe=False)

            player_info = read_team_players_from_team_id(team_id, current_gw)
            
            if player_info == 0:
                return JsonResponse(fdr_and_gws.toJson(), safe=False)
                                                
            for player_i in player_info:
                
                team_player_name = TeamNameShortPlayerNameModel(
                    player_name=player_i.player_name,
                    team_name_short=player_i.team_name_short
                ).toJson()
                
                if (player_i.position_id == 1):
                    goal_keepers.append(team_player_name) 
                if (player_i.position_id == 2):
                    defenders.append(team_player_name) 
                if (player_i.position_id == 3):
                    midtfielders.append(team_player_name) 
                if (player_i.position_id == 4):
                    forwards.append(team_player_name)

            fdr_and_gws.goal_keepers = goal_keepers
            fdr_and_gws.defenders = defenders
            fdr_and_gws.midtfielders = midtfielders
            fdr_and_gws.forwards = forwards
            
            return JsonResponse(fdr_and_gws.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


def getFixtureData(fixture_list_db, number_of_gws):
    fdr_data_list = []
    for fdr_data in fixture_list_db:
        team_name_short = fdr_data.team_short_name
        team_id = fdr_data.team_id
        fdr_dict = create_eliteserien_fdr_dict(fdr_data)
        gw_i_list = [ convertFDRToModel(fdr_dict[gw_i]) for gw_i in range(1, number_of_gws + 1) ]
        
        fdr_data_list.append(FDRTeamIDModel(
            team_name_short,
            gw_i_list,
            team_id
        ).toJson())

    return fdr_data_list




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

    end_gw = max(dates) + 1 if max(dates) + 1 < 5 else 5 if (max(dates) + 1 < end_gw) else end_gw

    start_gw = 1 if start_gw > end_gw else start_gw    
    
    return start_gw, end_gw, min_num_fixtures, combinations