from django.http import JsonResponse
from fixture_planner_eliteserien.backend.read_eliteserien_data import readEliteserienExcelToDBFormat
from fixture_planner_eliteserien.backend.utility_functions import get_current_gw_Eliteserien
from constants import total_number_of_gameweeks_in_eliteserien, initial_extra_gameweeks
from utils.models.Kick_Off_Time_Info_Eliteserien import KickOffTimeGameweeks
from fixture_planner.backend.create_data_objects import create_FDR_dict
from fixture_planner.backend.utility_functions import calc_score
import fixture_planner_eliteserien.fixture_algorithms as alg
from utils.models.WhichTeamToCheck import WhichTeamToCheck
from utils.models.FDR_team import FixtureDifficultyInfo
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from fixture_planner.models import KickOffTime
from fixture_planner.serializers import GetKickOffTimeSerializer
from utils.models.KickOffTimeInfo import KickOffTimeInfo
from rest_framework import generics, status
from fixture_planner.models import AddPlTeamsToDB
import fixture_planner.backend.create_data_objects as create_data_objects
from fixture_planner.backend.fixture_planner_best_algorithms import find_best_fixture_with_min_length_each_team
from fixture_planner.backend.fixture_rotation_algorithms import find_best_rotation_combos_json
from fixture_planner.backend.fixture_rotation_algorithms import find_best_rotation_combos
from fixture_planner_eliteserien.backend.read_eliteserien_data import readEliteserienExcelFromDagFinnToDBFormat
from fixture_planner_eliteserien.backend.utility_functions import create_Elitserien_FDR_dict
from utils.models.Eliteserien.EliteserienFDRResponse import EliteserienFDRResponse
from django.http import HttpResponse
from fixture_planner_eliteserien.models import EliteserienKickOffTime, EliteserienTeamInfo
from constants import premier_league_api_url, eliteserien_api_url, web_global_league_eliteserien, eliteserien_folder_name, premier_league_folder_name, name_of_extra_info_file, name_of_nationality_file, path_to_store_local_data, web_global_league, all_top_x_players, time_to_sleep_for_each_iteration, name_of_ownership_file
from utils.models.DataFetch import DataFetch
from datetime import date
from utils.dictionaries import dict_month_number_to_month_name_short


class GetKickOffTimesEliteserien(APIView):

    def get(self, request):
        try:
            temp_kick_off_time = [KickOffTimeInfo(gw_i + 1,"","").toJson() for gw_i in range(10) ]
            return JsonResponse(temp_kick_off_time, safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


class GetAllEliteserienFDRData(APIView):

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
            print(start_gw, end_gw, min_num_fixtures, combinations)
            fdr_fixture_data = []

            fixture_list_db = AddPlTeamsToDB.objects.all()

            fixture_list_db, dates, fdr_to_colors_dict, team_name_color = readEliteserienExcelFromDagFinnToDBFormat()

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

            if (max(dates) + 1 < end_gw):
                end_gw = max(dates) + 1

            gws = end_gw - start_gw + 1
            gw_numbers = [gw for gw in range(start_gw, end_gw + 1)]
            
            # for i in fixture_list_db:
            #    print(i.team_id, i.team_name)
            
            if combinations == 'FDR':
                fdr_fixture_data = []
                FDR_scores = []
                for idx, i in enumerate(fixture_list):
                    fdr_dict = create_Elitserien_FDR_dict(i)
                    sum = calc_score(fdr_dict, start_gw, end_gw)
                    # print(sum, "sum")
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
                                FixtureDifficultyInfo(team_name=team_i.team_name,
                                                      opponent_team_name=team_i.oppTeamNameList[j],
                                                      this_difficulty_score=team_i.oppTeamDifficultyScore[j],
                                                      total_fdr_score=FDR_score,
                                                      H_A=team_i.oppTeamHomeAwayList[j],
                                                      Use_Not_Use=0).toJson()])

                    for k in range(len(temp_list2)):
                        if not temp_list2[k]:
                            temp_list2[k] = [[FixtureDifficultyInfo(opponent_team_name="-",
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
                fdr_fixture_data = find_best_fixture_with_min_length_each_team_eliteserien(fixture_list,
                                                                               GW_start=start_gw,
                                                                               GW_end=end_gw,
                                                                               min_length=min_num_fixtures)
            
            if combinations == 'Rotation':
                teams_to_check = int(request.data.get("teams_to_check"))
                teams_to_play = int(request.data.get("teams_to_play"))
                teams_in_solution = request.data.get("teams_in_solution")
                fpl_teams = request.data.get("fpl_teams")
                # print("Rotation", teams_to_check, teams_to_play, teams_in_solution)
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
                # for i in fixture_list_db:
                    # print(i.team_id)

                rotation_data = alg.find_best_rotation_combosEliteserien(fixture_list_db, start_gw, end_gw,
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
            
            temp_kick_off_time = [KickOffTimeInfo(gw_i + 1,"","").toJson() for gw_i in dates]

            fdr_and_gws = EliteserienFDRResponse(fdr_fixture_data, temp_kick_off_time, fdr_to_colors_dict, team_name_color) 

            return JsonResponse(fdr_and_gws.toJson(), safe=False)

        except:
            return Response({'Bad Request': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)



def FillEliteserienDB(request):
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



def find_best_fixture_with_min_length_each_team_eliteserien(data, GW_start, GW_end, min_length=5):
    #df = adjust_df_for_blanks(df, adjust_blank_to=6)
    #df = adjust_df_for_home_away(df)
    #df = adjust_df_for_difficult_teams(df)
    best_fixtures_min_length = []
    for team_id in range(len(data)):
        print(team_id, GW_start, GW_end, min_length)
        info = compute_best_fixtures_one_team_db_data(data, GW_start, GW_end, team_id + 1, min_length)
        best_fixtures_min_length.append(info)
    return best_fixtures_min_length


def compute_best_fixtures_one_team_db_data(data, gw_start, gw_end, team_idx, min_length, toJson=True):
    """
    Find best gameweek region with respect to fixture values between GW_start and GW_end with a lenght
    >= min_length.
    :param data: dataframe with fixture data. create_data_frame()
    :param gw_start: first GW to count. GW_start > 0. (1)
    :param gw_end: last GW to count. GW_start <= GW_end <= 38 (38)
    :param team_idx:
    :param min_length: must be smaller than GW_end - GW_start + 1
    :return:
    """
    if min_length > (gw_end - gw_start + 1):
        print('min_length: must be smaller than GW_end - GW_start + 1')
        return -1
    fdr_dict = create_Elitserien_FDR_dict(data[team_idx - 1])
    number_of_gameweeks = gw_end - gw_start + 1
    ii, jj, length = gw_start, gw_end, number_of_gameweeks
    max_score = calc_score(fdr_dict, gw_start, gw_end) / (gw_end - gw_start + 1)
    for i in range(gw_start, gw_end + 1):
        for j in range(i + min_length - 1, gw_end + 1):
            #temp_score = np.sum(max_info[3][i:j+1]) / (j - i + 1)
            temp_len = j - i + 1
            temp_score = calc_score(fdr_dict, gw_start=i, gw_end=j) / temp_len
            if temp_score <= max_score:
                if temp_score == max_score and temp_len > length:
                    ii, jj, length = i, j, temp_len
                    max_score = temp_score
                if temp_score != max_score:
                    ii, jj, length = i, j, temp_len
                    max_score = temp_score
    fixture_list = []
    for gw in range(gw_start, gw_end + 1):
        gw_fixtures = fdr_dict[gw]
        temp_list = []
        good_gw = 0
        if gw >= ii and gw <= jj:
            good_gw = 1
        for gw_fixture in gw_fixtures:
            if toJson:
                temp_list.append([FixtureDifficultyInfo(data[team_idx - 1].team_name, gw_fixture[0].upper(),
                                       gw_fixture[2], gw_fixture[1], good_gw).toJson()])
            else:
                temp_list.append([FixtureDifficultyInfo(data[team_idx - 1].team_name, gw_fixture[0].upper(),
                                                        gw_fixture[2], gw_fixture[1], good_gw)])
        fixture_list.append(temp_list)
    return fixture_list








# def fixture_planner(request, start_gw=get_current_gw_Eliteserien(), end_gw=get_current_gw_Eliteserien() +
#                     initial_extra_gameweeks, combinations="FDR", teams_to_check=2, teams_to_play=1, min_num_fixtures=4):
#     """View function for home page of site."""
#     print("HEEELLO")
#     # Generate counts of some of the main objects
#     if end_gw > total_number_of_gameweeks_in_eliteserien:
#         end_gw = total_number_of_gameweeks_in_eliteserien

#     fixture_list_db, dates = readEliteserienExcelToDBFormat()

#     team_name_list = []
#     team_dict = {}
#     number_of_teams = len(fixture_list_db)
#     for i in range(number_of_teams):
#         team_dict[fixture_list_db[i].team_name] = WhichTeamToCheck(fixture_list_db[i].team_name, 'checked')

#     fixture_list = [fixture_list_db[i] for i in range(0, number_of_teams)]

#     fpl_teams = [-1]
#     if request.method == 'POST':
#         for i in range(number_of_teams):
#             team_dict[fixture_list[i].team_name] = WhichTeamToCheck(fixture_list[i].team_name, '')

#         fpl_teams = request.POST.getlist('fpl-teams')
#         for fpl_team in fpl_teams:
#             team_dict[fpl_team] = WhichTeamToCheck(team_dict[fpl_team].team_name, 'checked')

#         # gameweek info
#         gw_info = request.POST.getlist('gw-info')
#         start_gw = int(gw_info[0])
#         end_gw = int(gw_info[1])

#         combinations = request.POST.getlist('combination')[0]
#         min_num_fixtures = int(request.POST.getlist('min_num_fixtures')[0])

#         teams_to_check = int(request.POST.getlist('teams_to_check')[0])
#         teams_to_play = int(request.POST.getlist('teams_to_play')[0])

#     if end_gw < start_gw:
#         end_gw = start_gw + 1

#     gws = end_gw - start_gw + 1
#     gw_numbers = [i for i in range(start_gw, end_gw + 1)]

#     kick_off_time_list = []
#     for gw_i in range(start_gw, end_gw + 1):
#         kick_off_time_list.append(KickOffTimeGameweeks(gw_i, dates[gw_i - 1]))

#     fixture_list = []
#     for i in range(number_of_teams):
#         temp_object = team_dict[fixture_list_db[i].team_name]
#         team_name_list.append(team_dict[fixture_list_db[i].team_name])
#         if temp_object.checked == 'checked':
#             fixture_list.append(fixture_list_db[i])
#     teams = len(fixture_list)

#     fdr_fixture_data = []
#     if combinations == 'FDR':
#         FDR_scores = []
#         for idx, i in enumerate(fixture_list):
#             fdr_dict = create_FDR_dict(i)
#             sum = calc_score(fdr_dict, start_gw, end_gw)
#             FDR_scores.append([i, sum])
#         FDR_scores = sorted(FDR_scores, key=lambda x: x[1], reverse=False)

#         for i in range(teams):
#             temp_list2 = [[] for i in range(gws)]
#             team_i = FDR_scores[i][0]
#             FDR_score = FDR_scores[i][1]
#             temp_gws = team_i.gw
#             for j in range(len(team_i.gw)):
#                 temp_gw = temp_gws[j]
#                 if temp_gw in gw_numbers:
#                     temp_list2[gw_numbers.index(temp_gw)].append([
#                         FixtureDifficultyInfo(team_name=team_i.team_name,
#                                               opponent_team_name=team_i.oppTeamNameList[j],
#                                               this_difficulty_score=team_i.oppTeamDifficultyScore[j],
#                                               total_fdr_score=FDR_score,
#                                               H_A=team_i.oppTeamHomeAwayList[j],
#                                               Use_Not_Use=0)
#                     ])
#             for k in range(len(temp_list2)):
#                 if not temp_list2[k]:
#                     temp_list2[k] = [[FixtureDifficultyInfo(opponent_team_name="-",
#                                                             this_difficulty_score=0,
#                                                             H_A=" ",
#                                                             team_name=team_i.team_name,
#                                                             total_fdr_score=0,
#                                                             Use_Not_Use=0)]]

#             fdr_fixture_data.append(temp_list2)

#     rotation_data = []
#     if combinations == 'Rotation':
#         teams_in_solution = []
#         if request.method == 'POST':
#             teams_in_solution = request.POST.getlist('fpl-teams-in-solution')
#         remove_these_teams = []
#         for team_sol in teams_in_solution:
#             if team_sol not in fpl_teams:
#                 remove_these_teams.append(team_sol)
#         for remove_team in remove_these_teams:
#             teams_in_solution.remove(remove_team)
#         for i in team_name_list:
#             if i.team_name in teams_in_solution:
#                 i.checked_must_be_in_solution = 'checked'
#         rotation_data = alg.find_best_rotation_combosEliteserien(fixture_list_db, start_gw, end_gw,
#                                                                  teams_to_check=teams_to_check,
#                                                                  teams_to_play=teams_to_play,
#                                                                  team_names=fpl_teams,
#                                                                  teams_in_solution=teams_in_solution,
#                                                                  teams_not_in_solution=[],
#                                                                  top_teams_adjustment=False,
#                                                                  one_double_up=False,
#                                                                  home_away_adjustment=True,
#                                                                  include_extra_good_games=False,
#                                                                  num_to_print=0)
#         if rotation_data == -1:
#             rotation_data = [['Wrong input', [], [], 0, 0, [[]]]]
#         else:
#             rotation_data = rotation_data[:(min(len(rotation_data), 50))]

#     if abs(min_num_fixtures) > (end_gw-start_gw):
#         min_num_fixtures = abs(end_gw-start_gw)
#         if min_num_fixtures == 0:
#             min_num_fixtures = 1
#             end_gw = start_gw + 1
#     if combinations == 'FDR-best':
#         fdr_fixture_data = alg.find_best_fixture_with_min_length_each_teamElitserien(fixture_list,
#                                                                                      gw_start=start_gw,
#                                                                                      gw_end=end_gw,
#                                                                                      min_length=min_num_fixtures)

#     context = {
#         'teams': teams,
#         'gws': gws,
#         'gw_numbers': kick_off_time_list,
#         'gw_start': start_gw,
#         'gw_end': end_gw,
#         'combinations': combinations,
#         'rotation_data': rotation_data,
#         'teams_to_play': teams_to_play,
#         'teams_to_check': teams_to_check,
#         'fdr_fixture_data': fdr_fixture_data,
#         'min_num_fixtures': min_num_fixtures,
#         'team_name_list': team_name_list,
#     }

#     # Render the HTML template index_catalog.html with the data in the context variable
#     return render(request, 'fixture_planner_eliteserien.html', context=context)






