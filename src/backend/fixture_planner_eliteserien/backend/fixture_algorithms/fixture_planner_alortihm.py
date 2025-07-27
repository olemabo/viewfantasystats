from fixture_planner_eliteserien.backend.utility_functions import create_eliteserien_fdr_dict
from models.fixtures.models.FixtureDifficultyModel import FixtureDifficultyModel
from fixture_planner.backend.utility_functions import calc_score, calc_score_from_list
from models.fixtures.models.TeamFixtureInfoEliteserienModel import TeamFixtureInfoEliteserienModel


def fdr_planner_eliteserien(fixture_list, start_gw, end_gw):
    fdr_fixture_data, FDR_scores = [], []

    for fixture in fixture_list:
        fdr_dict = create_eliteserien_fdr_dict(fixture)
        sum = calc_score(fdr_dict, start_gw, end_gw)
        FDR_scores.append([fixture, sum])
    
    FDR_scores = sorted(FDR_scores, key=lambda x: x[1], reverse=False)
    number_of_teams = len(fixture_list)
    gws = end_gw - start_gw + 1
    gw_numbers = [gw for gw in range(start_gw, end_gw + 1)]
    
    for i in range(number_of_teams):
        temp_fixture_data = [[] for _ in range(gws)]
        team_i = FDR_scores[i][0]
        FDR_score = FDR_scores[i][1]
        temp_gws = team_i.gw

        for j in range(len(team_i.gw)):
            temp_gw = temp_gws[j]
            if temp_gw in gw_numbers:
                temp_fixture_data[gw_numbers.index(temp_gw)].append([
                    FixtureDifficultyModel(team_name=team_i.team_name,
                                            opponent_team_name=team_i.oppTeamNameList[j],
                                            this_difficulty_score=team_i.oppTeamDifficultyScore[j],
                                            total_fdr_score=FDR_score,
                                            H_A=team_i.oppTeamHomeAwayList[j],
                                            Use_Not_Use=0).toJson()])

        for k in range(len(temp_fixture_data)):
            if not temp_fixture_data[k]:
                temp_fixture_data[k] = [[FixtureDifficultyModel(opponent_team_name="-",
                                                        this_difficulty_score=0,
                                                        H_A=" ",
                                                        team_name=team_i.team_name,
                                                        total_fdr_score=0,
                                                        Use_Not_Use=0).toJson()]]

        fdr_fixture_data.append(temp_fixture_data)
    
    return fdr_fixture_data


def fdr_planner_eliteserien_fixture_list(fixture_list, gw_list):
    fdr_fixture_data, FDR_scores = [], []

    for fixture in fixture_list:
        fdr_dict = create_eliteserien_fdr_dict(fixture)
        sum = calc_score_from_list(fdr_dict, gw_list)
        FDR_scores.append([fixture, sum])
    
    FDR_scores = sorted(FDR_scores, key=lambda x: x[1], reverse=False)
    number_of_teams = len(fixture_list)
    gw_numbers = gw_list
    
    for i in range(number_of_teams):
        temp_fixture_data = [[] for _ in range(len(gw_list))]
        team_i: TeamFixtureInfoEliteserienModel
        team_i = FDR_scores[i][0]
        FDR_score = FDR_scores[i][1]
        temp_gws = team_i.gw
        for j in range(len(team_i.gw)):
            temp_gw = temp_gws[j]
            if temp_gw in gw_numbers:
                temp_fixture_data[gw_numbers.index(temp_gw)].append([
                    FixtureDifficultyModel(team_name=team_i.team_name,
                                            opponent_team_name=team_i.oppTeamNameList[j],
                                            this_difficulty_score=team_i.oppTeamDifficultyScore[j],
                                            total_fdr_score=FDR_score,
                                            double_blank="",
                                            H_A=team_i.oppTeamHomeAwayList[j],
                                            Use_Not_Use=0, message=team_i.messagesList[j]).toJson()])

        for k in range(len(temp_fixture_data)):
            if not temp_fixture_data[k]:
                temp_fixture_data[k] = [[FixtureDifficultyModel(opponent_team_name="-",
                                                        this_difficulty_score=0,
                                                        H_A=" ",
                                                        team_name=team_i.team_name,
                                                        total_fdr_score=0,
                                                        Use_Not_Use=0,
                                                        message=team_i.messagesList[j]).toJson()]]

        fdr_fixture_data.append(temp_fixture_data)

    return fdr_fixture_data


def fdr_planner_eliteserien_gw_list(fixture_data, gw_list):
    FDR_scores = []
    fdr_dict = create_eliteserien_fdr_dict(fixture_data)
    sum = calc_score_from_list(fdr_dict, gw_list)
    FDR_scores.append([fixture_data, sum])
    
    FDR_scores = sorted(FDR_scores, key=lambda x: x[1], reverse=False)
    gw_numbers = gw_list
    
    temp_fixture_data = [[] for _ in range(len(gw_list))]
    team_i: TeamFixtureInfoEliteserienModel
    team_i = FDR_scores[0][0]
    FDR_score = FDR_scores[0][1]
    temp_gws = team_i.gw
    for j in range(len(team_i.gw)):
        temp_gw = temp_gws[j]
        if temp_gw in gw_numbers:
            temp_fixture_data[gw_numbers.index(temp_gw)].append([
                FixtureDifficultyModel(team_name=team_i.team_name,
                                        opponent_team_name=team_i.oppTeamNameList[j],
                                        this_difficulty_score=team_i.oppTeamDifficultyScore[j],
                                        total_fdr_score=FDR_score,
                                        H_A=team_i.oppTeamHomeAwayList[j],
                                        Use_Not_Use=0,
                                        message=team_i.messagesList[j]).toJson()])

    for k in range(len(temp_fixture_data)):
        if not temp_fixture_data[k]:
            temp_fixture_data[k] = [[FixtureDifficultyModel(opponent_team_name="-",
                                                    this_difficulty_score=0,
                                                    H_A=" ",
                                                    team_name=team_i.team_name,
                                                    total_fdr_score=0,
                                                    Use_Not_Use=0,
                                                    message="").toJson()]]

    return temp_fixture_data