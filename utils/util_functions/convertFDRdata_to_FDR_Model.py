from models.fixtures.models.FDRModel import FDRModel


def convertFDRToModel(fdr_data):
    temp = []
    for fdr_data_i in fdr_data:
        temp.append(FDRModel(
            opponent_team_name=fdr_data_i[0],
            H_A=fdr_data_i[1],
            this_difficulty_score=fdr_data_i[2],
            message=fdr_data_i[3]
        ).toJson())
    
    return temp