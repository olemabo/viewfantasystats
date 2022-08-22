from math import comb
from fixture_planner.backend.fixture_planner_best_algorithms import find_best_fixture_with_min_length_each_team
from fixture_planner.backend.fixture_rotation_algorithms_new import find_best_rotation_combos_new
from fixture_planner.backend.fixture_rotation_algorithms import find_best_rotation_combos_json
from fixture_planner.backend.fixture_rotation_algorithms import find_best_rotation_combos
import fixture_planner.backend.create_data_objects as create_data_objects
from constants import total_number_of_gameweeks, initial_extra_gameweeks
import fixture_planner.backend.read_fixture_planner_data as read_data
from fixture_planner.backend.utility_functions import calc_score
from fixture_planner.models import PremierLeagueTeamInfo, KickOffTime
from utils.models.fixtures.WhichTeamToCheck import WhichTeamToCheck
from utils.models.fixtures.FixtureDifficultyModel import FixtureDifficultyModel
from utils.models.KickOffTimeInfo import KickOffTimeInfo
from django.views.decorators.csrf import csrf_exempt
from utils.utility_functions import get_current_gw
from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import render
import json
from rest_framework import generics, status
from fixture_planner.models import PremierLeagueTeamInfo, KickOffTime
from .serializers import PremierLeagueTeamInfoSerializer
from .serializers import GetKickOffTimeSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core import serializers
from utils.util_functions.fixture.get_upcoming_gw import get_upcoming_gw_premier_league
from utils.models.fixtures.FdrApiResponse import FdrApiResponse


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
                temp_kick_off_time.append(KickOffTimeInfo(
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
        kick_off_time_db = KickOffTime.objects.filter(gameweek__range=(0, 38))
        for i in range(len(kick_off_time_db)):
            dates = kick_off_time_db[i].kickoff_time.split("T")[0].split("-")
        return JsonResponse(kick_off_time_db[0], safe=False)

    def post(self, request, format=None):
        try:
            start_gw = int(request.data.get("start_gw"))
            end_gw = int(request.data.get("end_gw"))
            min_num_fixtures = int(request.data.get("min_num_fixtures"))
            combinations = str(request.data.get("combinations"))
            
            if combinations == "FDR" and start_gw < 0:
                start_gw = get_upcoming_gw_premier_league()
                end_gw = start_gw + 6
                if (end_gw > 38):
                    end_gw = 38
            
            if (combinations == "FDR-best" and start_gw < 0):
                start_gw = get_upcoming_gw_premier_league()
                end_gw = 38

            fdr_fixture_data = []

            gws = end_gw - start_gw + 1
            gw_numbers = [gw for gw in range(start_gw, end_gw + 1)]

            fixture_list_db = PremierLeagueTeamInfo.objects.all()

            team_dict = {}
            number_of_teams = len(fixture_list_db)

            fixture_list = [fixture_list_db[i] for i in range(0, number_of_teams)]

            for i in range(number_of_teams):
                team_dict[fixture_list[i].team_name] = WhichTeamToCheck(fixture_list[i].team_name, 'checked')
            
            team_name_list = []
            fixture_list = []

            for i in range(number_of_teams):
                temp_object = team_dict[fixture_list_db[i].team_name]
                team_name_list.append(team_dict[fixture_list_db[i].team_name])
                if temp_object.checked == 'checked':
                    fixture_list.append(fixture_list_db[i])

            teams = len(fixture_list)

            if combinations == 'FDR':
                fdr_fixture_data = []
                FDR_scores = []
                for idx, i in enumerate(fixture_list):
                    fdr_dict = create_data_objects.create_FDR_dict(i)
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
                        if temp_gw in gw_numbers:
                            temp_list2[gw_numbers.index(temp_gw)].append([
                                FixtureDifficultyModel(team_name=team_i.team_name,
                                                      opponent_team_name=team_i.oppTeamNameList[j],
                                                      this_difficulty_score=team_i.oppTeamDifficultyScore[j],
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

            if combinations == 'FDR-best':
                fdr_fixture_data = find_best_fixture_with_min_length_each_team(fixture_list,
                                                                               GW_start=start_gw,
                                                                               GW_end=end_gw,
                                                                               min_length=min_num_fixtures)
           
            if combinations == 'Rotation':
                teams_to_check = int(request.data.get("teams_to_check"))
                teams_to_play = int(request.data.get("teams_to_play"))
                teams_in_solution = request.data.get("teams_in_solution")
                fpl_teams = request.data.get("fpl_teams")
                # print("teams_to_check: ", teams_to_check)
                # print("teams_to_play: ", teams_to_play)
                # print("teams_in_solution: ", teams_in_solution)
                # print("fpl_teams: ", fpl_teams)

                fdr_fixture_data = []

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
                # print(" \n teams_in_solution after: ", teams_in_solution)
                # print("fpl_teams after: ", fpl_teams, fixture_list_db)
                # print("fixture_list_db: ", fixture_list_db)
                # rotation_data = find_best_rotation_combos(fixture_list_db, start_gw, end_gw,
                #                                             teams_to_check=teams_to_check, 
                #                                             teams_to_play=teams_to_play,
                #                                             team_names=fpl_teams, 
                #                                             teams_in_solution=teams_in_solution,
                #                                             teams_not_in_solution=[],
                #                                             top_teams_adjustment=False, 
                #                                             one_double_up=False,
                #                                             home_away_adjustment=True, 
                #                                             include_extra_good_games=False,
                #                                             num_to_print=0)
                rotation_data = find_best_rotation_combos_new(fixture_list_db, start_gw, end_gw,
                                                            teams_to_check=teams_to_check, 
                                                            teams_to_play=teams_to_play,
                                                            team_names=fpl_teams, 
                                                            teams_in_solution=teams_in_solution,
                                                            teams_not_in_solution=[],
                                                            top_teams_adjustment=False, 
                                                            one_double_up=False,
                                                            home_away_adjustment=True, 
                                                            include_extra_good_games=False,
                                                            )

                if rotation_data == -1:
                    rotation_data = [['Wrong input', [], [], 0, 0, [[]]]]
                else:
                    rotation_data = rotation_data[:(min(len(rotation_data), 50))]
                
                fdr_fixture_data = rotation_data 

            response = FdrApiResponse(fdr_fixture_data, [], [], [], start_gw, end_gw) 

            return JsonResponse(response.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


def fixture_planner(request, start_gw=get_current_gw(), end_gw=get_current_gw() + initial_extra_gameweeks, combinations="FDR", teams_to_check=2, teams_to_play=1, min_num_fixtures=4):
    if end_gw > total_number_of_gameweeks:
        end_gw = total_number_of_gameweeks
    # collect data from database [[PremierLeagueTeamInfo], [PremierLeagueTeamInfo], ... ]
    fixture_list_db = PremierLeagueTeamInfo.objects.all()
    team_name_list = []
    teams_in_solution = []
    team_dict = {}
    number_of_teams = len(fixture_list_db)
    for i in range(number_of_teams):
        team_dict[fixture_list_db[i].team_name] = WhichTeamToCheck(fixture_list_db[i].team_name, 'checked')

    fixture_list = [fixture_list_db[i] for i in range(0, number_of_teams)]
    fpl_teams = [-1]
    if request.method == 'POST':
        for i in range(number_of_teams):
            team_dict[fixture_list[i].team_name] = WhichTeamToCheck(fixture_list[i].team_name, '')

        fpl_teams = request.POST.getlist('fpl-teams')
        for fpl_team in fpl_teams:
            team_dict[fpl_team] = WhichTeamToCheck(team_dict[fpl_team].team_name, 'checked')

        # gameweek info
        gw_info = request.POST.getlist('gw-info')
        start_gw = int(gw_info[0])
        end_gw = int(gw_info[1])

        combinations = request.POST.getlist('combination')[0]

        min_num_fixtures = int(request.POST.getlist('min_num_fixtures')[0])

        teams_to_check = int(request.POST.getlist('teams_to_check')[0])
        teams_to_play = int(request.POST.getlist('teams_to_play')[0])

        teams_in_solution = request.POST.getlist('fpl-teams-in-solution')

    if end_gw < start_gw:
        end_gw = start_gw + 1

    number_of_gws = end_gw - start_gw + 1
    kick_off_time_db = KickOffTime.objects.filter(gameweek__range=(start_gw, end_gw))

    fixture_list = []
    for i in range(number_of_teams):
        temp_object = team_dict[fixture_list_db[i].team_name]
        team_name_list.append(team_dict[fixture_list_db[i].team_name])

        if temp_object.checked == 'checked':
            fixture_list.append(fixture_list_db[i])

    for team_i in team_name_list:
        if team_i.team_name in teams_in_solution:
            team_i.checked_must_be_in_solution = 'checked'

    context = {
        'gws': number_of_gws,
        'gw_numbers': kick_off_time_db,
        'gw_start': start_gw,
        'gw_end': end_gw,
        'combinations': combinations,
        'teams_to_play': teams_to_play,
        'teams_to_check': teams_to_check,
        'min_num_fixtures': min_num_fixtures,
        'team_name_list': team_name_list,
        'fixture_list': fixture_list,
        'fpl_teams': json.dumps(fpl_teams),
        'teams_in_solution': json.dumps(teams_in_solution),
    }
    return render(request, 'fixture_planner.html', context=context)


@csrf_exempt
def get_fdr_data(request):
    if request.is_ajax():
        if request.method == 'POST':
            my_json = request.body.decode('utf8').replace("'", '"')
            data = json.loads(my_json)

    fdr_fixture_data = []

    start_gw = data['start_gw']
    end_gw = data['end_gw']
    if end_gw > total_number_of_gameweeks:
        end_gw = total_number_of_gameweeks
    fpl_teams = data['fpl_teams']
    combinations = data['combinations']
    min_num_fixtures = data['min_num_fixtures']
    gws = end_gw - start_gw + 1
    gw_numbers = [gw for gw in range(start_gw, end_gw + 1)]

    fixture_list_db = PremierLeagueTeamInfo.objects.all()
    team_dict = {}
    number_of_teams = len(fixture_list_db)

    fixture_list = [fixture_list_db[i] for i in range(0, number_of_teams)]

    for i in range(number_of_teams):
        if fpl_teams[0] == -1:
            team_dict[fixture_list[i].team_name] = WhichTeamToCheck(fixture_list[i].team_name, 'checked')
        else:
            team_dict[fixture_list[i].team_name] = WhichTeamToCheck(fixture_list[i].team_name, '')

    if fpl_teams[0] != -1:
        for fpl_team in fpl_teams:
            team_dict[fpl_team] = WhichTeamToCheck(team_dict[fpl_team].team_name, 'checked')

    fixture_list_db = PremierLeagueTeamInfo.objects.all()

    team_name_list = []
    fixture_list = []

    for i in range(number_of_teams):
        temp_object = team_dict[fixture_list_db[i].team_name]
        team_name_list.append(team_dict[fixture_list_db[i].team_name])

        if temp_object.checked == 'checked':
            fixture_list.append(fixture_list_db[i])

    teams = len(fixture_list)

    if combinations == 'FDR':
        fdr_fixture_data = []
        FDR_scores = []
        for idx, i in enumerate(fixture_list):
            fdr_dict = create_data_objects.create_FDR_dict(i)
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
                if temp_gw in gw_numbers:
                    temp_list2[gw_numbers.index(temp_gw)].append([
                        FixtureDifficultyModel(team_name=team_i.team_name,
                                              opponent_team_name=team_i.oppTeamNameList[j],
                                              this_difficulty_score=team_i.oppTeamDifficultyScore[j],
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


    if abs(min_num_fixtures) > (end_gw-start_gw):
            min_num_fixtures = abs(end_gw-start_gw) + 1
            if min_num_fixtures == 0:
                min_num_fixtures = 1
                end_gw = start_gw + 1

    if combinations == 'FDR-best':
        fdr_fixture_data = find_best_fixture_with_min_length_each_team(fixture_list,
                                                                       GW_start=start_gw,
                                                                       GW_end=end_gw,
                                                                       min_length=min_num_fixtures)

    data = {
        "fdr_fixture_data": fdr_fixture_data
    }
    return JsonResponse(data, safe=False)


@csrf_exempt
def get_rotation_data(request):
    if request.is_ajax():
        if request.method == 'POST':
            my_json = request.body.decode('utf8').replace("'", '"')
            data = json.loads(my_json)
    start_gw = data['start_gw']
    end_gw = data['end_gw']
    fpl_teams = data['fpl_teams']
    combinations = data['combinations']
    teams_to_check = data['teams_to_check']
    teams_to_play = data['teams_to_play']
    teams_in_solution = data['teams_in_solution']

    fixture_list_db = PremierLeagueTeamInfo.objects.all()
    team_dict = {}
    number_of_teams = len(fixture_list_db)

    fixture_list = [fixture_list_db[i] for i in range(0, number_of_teams)]

    for i in range(number_of_teams):
        team_dict[fixture_list[i].team_name] = WhichTeamToCheck(fixture_list[i].team_name, '')

    for fpl_team in fpl_teams:
        team_dict[fpl_team] = WhichTeamToCheck(team_dict[fpl_team].team_name, 'checked')

    team_name_list = []
    fixture_list = []
    for i in range(number_of_teams):
        temp_object = team_dict[fixture_list_db[i].team_name]
        team_name_list.append(team_dict[fixture_list_db[i].team_name])

        if temp_object.checked == 'checked':
            fixture_list.append(fixture_list_db[i])

    rotation_data = []
    if combinations == 'Rotation':
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
                                                       teams_to_check=teams_to_check, teams_to_play=teams_to_play,
                                                       team_names=fpl_teams, teams_in_solution=teams_in_solution,
                                                       teams_not_in_solution=[],
                                                       top_teams_adjustment=False, one_double_up=False,
                                                       home_away_adjustment=True, include_extra_good_games=False,
                                                       num_to_print=0)
        if rotation_data == -1:
            rotation_data = [['Wrong input', [], [], 0, 0, [[]]]]
        else:
            rotation_data = rotation_data[:(min(len(rotation_data), 50))]
    data = {
        "fdr_fixture_data": rotation_data
    }
    return JsonResponse(data, safe=False)


def fill_fixture_planner_and_kick_off_time_db(request):
    """
    Fill fixture planner db (PremierLeagueTeamInfo) and kick off times db (KickOffTime)
    :param request:
    :return:
    """
    df, names, short_names, ids = create_data_objects.return_fixture_names_shortnames("api")
    number_of_teams = len(names)
    for team_i in range(number_of_teams):
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

    return HttpResponse("Successfully filled 'PremierLeagueTeamInfo' and 'KickOffTime' Databases")
