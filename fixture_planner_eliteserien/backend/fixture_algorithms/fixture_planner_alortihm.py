from fixture_planner_eliteserien.backend.utility_functions import create_Elitserien_FDR_dict
from fixture_planner.backend.utility_functions import calc_score
from utils.models.fixtures.FixtureDifficultyModel import FixtureDifficultyModel


def fdr_planner_eliteserien(fixture_list, start_gw, end_gw):
    fdr_fixture_data = []
    FDR_scores = []
    for idx, i in enumerate(fixture_list):
        fdr_dict = create_Elitserien_FDR_dict(i)
        sum = calc_score(fdr_dict, start_gw, end_gw)
        FDR_scores.append([i, sum])
    FDR_scores = sorted(FDR_scores, key=lambda x: x[1], reverse=False)
    number_of_teams = len(fixture_list)
    gws = end_gw - start_gw + 1
    gw_numbers = [gw for gw in range(start_gw, end_gw + 1)]
    
    for i in range(number_of_teams):
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
    
    return fdr_fixture_data