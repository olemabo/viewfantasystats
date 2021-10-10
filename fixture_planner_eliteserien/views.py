from django.shortcuts import render
import fixture_planner_eliteserien.fixture_algorithms as alg
import pandas as pd

# Create your views here.


class team_info:
    def __init__(self, opponent_team_name, difficulty_score, H_A, team_name, FDR_score):
        ...
        self.opponent_team_name = opponent_team_name
        self.difficulty_score = difficulty_score
        self.H_A = H_A
        self.team_name = team_name
        self.FDR_score = FDR_score
        self.Use_Not_Use = 0


class which_team_to_check:
    def __init__(self, team_name, checked, checked_must_be_in_solution=''):
        ...
        self.team_name = team_name
        self.checked = checked
        self.checked_must_be_in_solution = checked_must_be_in_solution


class AddPlTeamsToDB():
    def __init__(self, team_name, team_id, team_short_name, date, oppTeamNameList,
                 oppTeamHomeAwayList, oppTeamDifficultyScore, gw):
        self.team_name = team_name
        self.team_id = team_id
        self.team_short_name = team_short_name
        self.date = date
        self.oppTeamNameList = oppTeamNameList
        self.oppTeamHomeAwayList = oppTeamHomeAwayList
        self.oppTeamDifficultyScore = oppTeamDifficultyScore
        self.gw = gw


class KickOffTimeGameweeks():
    months_norwegian = ["Jan", "Feb", "Mar", "April", "Mai", "Juni", "Juli", "Aug", "Sep", "Okt", "Nov", "Des"]

    def __init__(self, gameweek, day_month):
        self.gameweek = gameweek
        self.day_month = self.convert_to_only_date(day_month)

    def convert_to_only_date(self, date):
        yyyymmdd = str(date).split(" ")[0].split("-")
        return yyyymmdd[2] + ". " + self.convert_month_number_to_string_norwegian(yyyymmdd[1])

    def convert_month_number_to_string_norwegian(self, month):
        return self.months_norwegian[int(month) - 1]



def readEliteserienExcelToDBFormat():
    df = pd.read_excel(r'stored_data/eliteserien/Eliteserien_fixtures.xlsx', engine='openpyxl')
    objectList = []
    dates = df.loc[df[0] == 'Dato'].values.tolist()[0][1:]

    for id, row in df.iterrows():
        if id == 0:
            continue
        temp_oppTeamNameList = []
        temp_oppTeamHomeAwayList = []
        temp_oppTeamDifficultyScore = []
        temp_gw = []
        team_name = row[0].split("(")[0]
        team_name_short = row[0].split("(")[1][:-1]
        for value in range(1, len(row)):
            fixtures = row[value]
            if (pd.isnull(fixtures)):
                continue
            check_fixtures = fixtures.split(";")
            for fixture in check_fixtures:
                info = fixture.split(",")
                opponent = info[0]
                home_away = info[1]
                fdr = int(info[2])
                temp_oppTeamNameList.append(opponent)
                temp_oppTeamHomeAwayList.append(home_away)
                temp_oppTeamDifficultyScore.append(fdr)
                temp_gw.append(value)

        dbObject = AddPlTeamsToDB(team_name, id, team_name_short, dates[value - 1],
                                  temp_oppTeamNameList, temp_oppTeamHomeAwayList,
                                  temp_oppTeamDifficultyScore, temp_gw)
        objectList.append(dbObject)

    return objectList, dates


def get_current_gw_Eliteserien():
    return 3


def get_max_gw_Eliteserien():
    return 30


def fixture_planner(request, start_gw=get_current_gw_Eliteserien(), end_gw=get_current_gw_Eliteserien()+5, combinations="FDR", teams_to_check=2, teams_to_play=1, min_num_fixtures=4):
    """View function for home page of site."""
    # Generate counts of some of the main objects
    if end_gw > get_max_gw_Eliteserien():
        end_gw = get_max_gw_Eliteserien()

    fixture_list_db, dates = readEliteserienExcelToDBFormat()

    team_name_list = []
    team_dict = {}
    number_of_teams = len(fixture_list_db)
    for i in range(number_of_teams):
        team_dict[fixture_list_db[i].team_name] = which_team_to_check(fixture_list_db[i].team_name, 'checked')

    fixture_list = [fixture_list_db[i] for i in range(0, number_of_teams)]

    fpl_teams = [-1]
    if request.method == 'POST':
        for i in range(number_of_teams):
            team_dict[fixture_list[i].team_name] = which_team_to_check(fixture_list[i].team_name, '')

        fpl_teams = request.POST.getlist('fpl-teams')
        for fpl_team in fpl_teams:
            team_dict[fpl_team] = which_team_to_check(team_dict[fpl_team].team_name, 'checked')

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

    kickofftime_db = []
    for gw_i in range(start_gw, end_gw + 1):
        kickofftime_db.append(KickOffTimeGameweeks(gw_i, dates[gw_i - 1]))

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
            fdr_dict = alg.create_FDR_dict(i)
            sum = alg.calc_score(fdr_dict, start_gw, end_gw)
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
                        team_info(team_i.oppTeamNameList[j],
                                                   team_i.oppTeamDifficultyScore[j],
                                                   team_i.oppTeamHomeAwayList[j],
                                                   team_i.team_name,
                                                   FDR_score)
                    ])
            for k in range(len(temp_list2)):
                if not temp_list2[k]:
                    temp_list2[k] = [[team_info("-", 0, " ", team_i.team_name, 0)]]

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
                    teams_to_check=teams_to_check, teams_to_play=teams_to_play,
                    team_names=fpl_teams, teams_in_solution=teams_in_solution, teams_not_in_solution=[],
                    top_teams_adjustment=False, one_double_up=False,
                    home_away_adjustment=True, include_extra_good_games=False,
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
                            GW_start=start_gw, GW_end=end_gw, min_length=min_num_fixtures)

    context = {
        'teams': teams,
        'gws': gws,
        'gw_numbers': kickofftime_db,
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



