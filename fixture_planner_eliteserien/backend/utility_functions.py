def create_eliteserien_fdr_dict(fdr_data, blank_score=10):
    num_gws = len(fdr_data.gw) + 2
    new_dict = {new_list: [] for new_list in range(num_gws + 1)}
    for gw, H_A, opponent, FDR in zip(fdr_data.gw, fdr_data.oppTeamHomeAwayList, fdr_data.oppTeamNameList, fdr_data.oppTeamDifficultyScore):
        new_dict[gw].append([opponent, H_A, FDR])
    
    for i in range(num_gws + 1):
        if not new_dict[i]:
            new_dict[i] = [['-', ' ', blank_score]]
    
    return new_dict

