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


def fixture_planner(request, start_gw=get_current_gw_Eliteserien(), end_gw=get_current_gw_Eliteserien() +
                    initial_extra_gameweeks, combinations="FDR", teams_to_check=2, teams_to_play=1, min_num_fixtures=4):
    """View function for home page of site."""

    # Generate counts of some of the main objects
    if end_gw > total_number_of_gameweeks_in_eliteserien:
        end_gw = total_number_of_gameweeks_in_eliteserien

    fixture_list_db, dates = readEliteserienExcelToDBFormat()

    team_name_list = []
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

    if end_gw < start_gw:
        end_gw = start_gw + 1

    gws = end_gw - start_gw + 1
    gw_numbers = [i for i in range(start_gw, end_gw + 1)]

    kick_off_time_list = []
    for gw_i in range(start_gw, end_gw + 1):
        kick_off_time_list.append(KickOffTimeGameweeks(gw_i, dates[gw_i - 1]))

    fixture_list = []
    for i in range(number_of_teams):
        temp_object = team_dict[fixture_list_db[i].team_name]
        team_name_list.append(team_dict[fixture_list_db[i].team_name])
        if temp_object.checked == 'checked':
            fixture_list.append(fixture_list_db[i])
    teams = len(fixture_list)

    fdr_fixture_data = []
    if combinations == 'FDR':
        FDR_scores = []
        for idx, i in enumerate(fixture_list):
            fdr_dict = create_FDR_dict(i)
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
                        FixtureDifficultyInfo(team_name=team_i.team_name,
                                              opponent_team_name=team_i.oppTeamNameList[j],
                                              this_difficulty_score=team_i.oppTeamDifficultyScore[j],
                                              total_fdr_score=FDR_score,
                                              H_A=team_i.oppTeamHomeAwayList[j],
                                              Use_Not_Use=0)
                    ])
            for k in range(len(temp_list2)):
                if not temp_list2[k]:
                    temp_list2[k] = [[FixtureDifficultyInfo(opponent_team_name="-",
                                                            this_difficulty_score=0,
                                                            H_A=" ",
                                                            team_name=team_i.team_name,
                                                            total_fdr_score=0,
                                                            Use_Not_Use=0)]]

            fdr_fixture_data.append(temp_list2)

    rotation_data = []
    if combinations == 'Rotation':
        teams_in_solution = []
        if request.method == 'POST':
            teams_in_solution = request.POST.getlist('fpl-teams-in-solution')
        remove_these_teams = []
        for team_sol in teams_in_solution:
            if team_sol not in fpl_teams:
                remove_these_teams.append(team_sol)
        for remove_team in remove_these_teams:
            teams_in_solution.remove(remove_team)
        for i in team_name_list:
            if i.team_name in teams_in_solution:
                i.checked_must_be_in_solution = 'checked'
        rotation_data = alg.find_best_rotation_combosEliteserien(fixture_list_db, start_gw, end_gw,
                                                                 teams_to_check=teams_to_check,
                                                                 teams_to_play=teams_to_play,
                                                                 team_names=fpl_teams,
                                                                 teams_in_solution=teams_in_solution,
                                                                 teams_not_in_solution=[],
                                                                 top_teams_adjustment=False,
                                                                 one_double_up=False,
                                                                 home_away_adjustment=True,
                                                                 include_extra_good_games=False,
                                                                 num_to_print=0)
        if rotation_data == -1:
            rotation_data = [['Wrong input', [], [], 0, 0, [[]]]]
        else:
            rotation_data = rotation_data[:(min(len(rotation_data), 50))]

    if abs(min_num_fixtures) > (end_gw-start_gw):
        min_num_fixtures = abs(end_gw-start_gw)
        if min_num_fixtures == 0:
            min_num_fixtures = 1
            end_gw = start_gw + 1
    if combinations == 'FDR-best':
        fdr_fixture_data = alg.find_best_fixture_with_min_length_each_teamElitserien(fixture_list,
                                                                                     gw_start=start_gw,
                                                                                     gw_end=end_gw,
                                                                                     min_length=min_num_fixtures)

    context = {
        'teams': teams,
        'gws': gws,
        'gw_numbers': kick_off_time_list,
        'gw_start': start_gw,
        'gw_end': end_gw,
        'combinations': combinations,
        'rotation_data': rotation_data,
        'teams_to_play': teams_to_play,
        'teams_to_check': teams_to_check,
        'fdr_fixture_data': fdr_fixture_data,
        'min_num_fixtures': min_num_fixtures,
        'team_name_list': team_name_list,
    }

    # Render the HTML template index_catalog.html with the data in the context variable
    return render(request, 'fixture_planner_eliteserien.html', context=context)



