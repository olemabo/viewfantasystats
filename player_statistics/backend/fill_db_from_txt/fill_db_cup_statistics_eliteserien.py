from constants import current_season_name_eliteserien,cup_db_delimiter, cup_delimiter, cup_stats_folder_name, cup_data_file, esf, path_to_store_local_data
from player_statistics.db_models.eliteserien.cup_statistics_model_eliteserien import EliteserienCupStatistics
import numpy as np
import json


def write_cup_statistics_to_db_eliteserien():
    EliteserienCupStatistics.objects.all().delete()
    
    path = path_to_store_local_data + "/" + esf + "/" + current_season_name_eliteserien + "/" + cup_stats_folder_name + "/" + cup_data_file
    cup_statistics_data = np.loadtxt(path, dtype="str", comments="&&&&&&&&&&&", delimiter=cup_delimiter, skiprows=0, encoding="utf-8")
    new = 0
    update = 0
    print("\nWrite to DB \n")
    for idx, data in enumerate(cup_statistics_data):
        id = int(data[0])
        team_name = str(data[1][1:-1])
        name = str(data[2][1:-1])
        round_lost = int(data[3])
        qualification_rank = int(data[4])
        still_in_cup = True if int(round_lost) == -1 else False
        ranking_list = json.loads(data[5])
        cup_history_list = []
        for i in ranking_list:
            list_as_string = str(i).replace(", ", cup_db_delimiter).replace("[", "").replace("]", "")
            list_as_string = list_as_string.replace(cup_db_delimiter + "'", cup_db_delimiter).replace(cup_db_delimiter + " '", cup_db_delimiter).replace("'" + cup_db_delimiter, cup_db_delimiter)
            cup_history_list.append(list_as_string.replace(",", "."))
        

        if len(EliteserienCupStatistics.objects.filter(id = id)) > 0:
            update += 1 
            fill_model = EliteserienCupStatistics.objects.filter(id = id)
            fill_model.update(
                id=id, 
                name=name, 
                team_name=team_name,
                round_lost=round_lost,
                qualification_rank=qualification_rank,
                still_in_cup=still_in_cup,
                cup_history=cup_history_list)
        else:
            new += 1
            fill_model = EliteserienCupStatistics(
                id=id, 
                name=name, 
                team_name=team_name,
                round_lost=round_lost,
                qualification_rank=qualification_rank,
                still_in_cup=still_in_cup,
                cup_history=cup_history_list)
            fill_model.save()

        if ((idx + 1) % 100 == 0):
            print(idx + 1, " / ", len(cup_statistics_data), "(", new, "/", update, ")", " (new/update)")
        
        

