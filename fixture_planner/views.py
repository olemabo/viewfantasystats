from fixture_planner.backend.fixture_planner_best_algorithms import find_best_fixture_with_min_length_each_team
from fixture_planner.backend.fixture_rotation_algorithms import find_best_rotation_combos
from fixture_planner.backend.utility_functions import calc_score
from utils.util_functions.get_request_data import get_request_params, parse_queryparams_to_string_list

from .serializers import PremierLeagueTeamInfoSerializer, GetKickOffTimeSerializer
import fixture_planner.backend.create_data_objects as create_data_objects
from fixture_planner.models import PremierLeagueTeamInfo, KickOffTime
from django.http import JsonResponse

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from utils.util_functions.get_upcoming_gw import get_upcoming_gw_premier_league

from models.fixtures.apiResponse.FdrApiResponse import FdrApiResponse
from models.fixtures.models.FixtureDifficultyModel import FixtureDifficultyModel

from models.fixtures.models.WhichTeamToCheckModel import WhichTeamToCheckModel
from models.fixtures.models.KickOffTimesModel import KickOffTimesModel
from constants import fdrPlanner, fdrPeriode, fdrRotation

class PremierLeagueTeamInfoView(generics.ListAPIView):
    queryset = PremierLeagueTeamInfo.objects.all()
    serializer_class = PremierLeagueTeamInfoSerializer


class KickOffTimeView(generics.ListAPIView):
    queryset = KickOffTime.objects.all()
    serializer_class = GetKickOffTimeSerializer


class GetKickOffTimes(APIView):
    serializer_class = GetKickOffTimeSerializer

    def get(self, request):
        try:
            kick_off_time_db = KickOffTime.objects.all()
            temp_kick_off_time = []
            for gw_i in range(len(kick_off_time_db)):
                temp_kick_off_time.append(KickOffTimesModel(
                    kick_off_time_db[gw_i].gameweek,
                    kick_off_time_db[gw_i].kickoff_time,
                    kick_off_time_db[gw_i].day_month
                ).toJson())
            return JsonResponse(temp_kick_off_time, safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class PostFDRView(APIView):
    serializer_class = PremierLeagueTeamInfoSerializer

    def get(self, request, format=None):
        try:
            start_gw = int(request.GET.get("startGw"))
            end_gw = int(request.GET.get("endGw"))
            min_num_fixtures = int(request.GET.get("minNumFixtures"))
            combinations = str(request.GET.get("fixturePlanningType"))

            if (combinations == fdrPlanner or combinations == fdrRotation) and start_gw < 0:
                start_gw = get_upcoming_gw_premier_league()
                end_gw = start_gw + 6
                if (end_gw > 38):
                    end_gw = 38

            if (combinations == fdrPeriode and start_gw < 0):
                start_gw = get_upcoming_gw_premier_league()
                end_gw = 38
                        
            fdr_fixture_data = []

            gws = end_gw - start_gw + 1
            current_gws = [gw for gw in range(start_gw, end_gw + 1)]

            fixture_list_db = PremierLeagueTeamInfo.objects.all()

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

            teams = len(fixture_list)

            home_away_adjustment = 0.1
            blank_score = 10

            if combinations == fdrPlanner:
                fdr_fixture_data, FDR_scores = [], []
                for i in fixture_list:
                    fdr_dict = create_data_objects.create_FDR_dict(i, blank_score=blank_score, home_away_adjustment=home_away_adjustment)
                    sum = calc_score(fdr_dict, start_gw, end_gw)
                    FDR_scores.append([i, sum])
                
                FDR_scores = sorted(FDR_scores, key=lambda x: x[1], reverse=False)
                
                for i in range(teams):
                    temp_list2 = [[] for i in range(gws)]
                    team_i = FDR_scores[i][0]
                    FDR_score = FDR_scores[i][1]
                    temp_gws = team_i.gw
                    for j in range(len(team_i.gw)):
                        temp_gw = temp_gws[j]
                        if temp_gw in current_gws:
                            possible_blank = ""
                            if len(team_i.possibleBlank) > 0 and len(team_i.possibleBlank) >= j:
                                 possible_blank = team_i.possibleBlank[j]
                            temp_list2[current_gws.index(temp_gw)].append([
                                FixtureDifficultyModel(team_name=team_i.team_name,
                                                      opponent_team_name=team_i.oppTeamNameList[j],
                                                      this_difficulty_score=team_i.oppTeamDifficultyScore[j],
                                                      double_blank=possible_blank,
                                                      total_fdr_score=FDR_score,
                                                      H_A=team_i.oppTeamHomeAwayList[j],
                                                      Use_Not_Use=0).toJson()])

                    for k in range(len(temp_list2)):
                        if not temp_list2[k]:
                            temp_list2[k] = [[FixtureDifficultyModel(opponent_team_name="-",
                                                                   this_difficulty_score=0,
                                                                   H_A=" ",
                                                                   team_name=team_i.team_name,
                                                                   total_fdr_score=0,
                                                                   Use_Not_Use=0).toJson()]]

                    fdr_fixture_data.append(temp_list2)

            if abs(min_num_fixtures) > (end_gw - start_gw):
                min_num_fixtures = abs(end_gw - start_gw) + 1
                if min_num_fixtures == 0:
                    min_num_fixtures = 1
                    end_gw = start_gw + 1

            if combinations == fdrPeriode:
                fdr_fixture_data = find_best_fixture_with_min_length_each_team(fixture_list,
                        GW_start=start_gw, GW_end=end_gw, min_length=min_num_fixtures, 
                        home_away_adjustment=home_away_adjustment, blank_score=blank_score)
           
            if combinations == fdrRotation:
                teams_to_check = get_request_params(request, "teamsToCheck", int)
                teams_to_play = get_request_params(request, "teamsToPlay", int)
                teams_in_solution = parse_queryparams_to_string_list(request.GET.get("teamsInSolution"))
                fpl_teams = parse_queryparams_to_string_list(request.GET.get("fplTeams"))

                if (len(fpl_teams) == 0):
                    fpl_teams = [-1]

                remove_these_teams = []
                for team_sol in teams_in_solution:
                    if team_sol not in fpl_teams:
                        remove_these_teams.append(team_sol)
                
                for remove_team in remove_these_teams:
                    teams_in_solution.remove(remove_team)
                
                for i in team_name_list:
                    if i.team_name in teams_in_solution:
                        i.checked_must_be_in_solution = 'checked'

                rotation_data = find_best_rotation_combos(fixture_list_db, start_gw, end_gw,
                                                            teams_to_check=teams_to_check, 
                                                            teams_to_play=teams_to_play,
                                                            team_names=fpl_teams, 
                                                            teams_in_solution=teams_in_solution,
                                                            teams_not_in_solution=[],
                                                            top_teams_adjustment=False, 
                                                            one_double_up=False,
                                                            include_extra_good_games=False)

                rotation_data = [['Wrong input', [], [], 0, 0, [[]]]] if rotation_data == -1 else rotation_data[:(min(len(rotation_data), 50))]
                
                fdr_fixture_data = rotation_data 
            
            kick_off_time_db = KickOffTime.objects.all()
            temp_kick_off_time = []
            for kick_off_time in kick_off_time_db:
                if (kick_off_time.gameweek in current_gws):
                    temp_kick_off_time.append(KickOffTimesModel(
                        kick_off_time.gameweek,
                        kick_off_time.kickoff_time,
                        kick_off_time.day_month
                    ).toJson())

            response = FdrApiResponse(fdr_fixture_data, temp_kick_off_time, [], [], start_gw, end_gw) 

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)