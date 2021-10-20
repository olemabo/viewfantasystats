from utils.models.Team_Fixture_Info_Eliteserien import Team_Fixture_Info_Eliteserien
import pandas as pd


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
            if pd.isnull(fixtures):
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

        dbObject = Team_Fixture_Info_Eliteserien(team_name=team_name,
                                                 team_id=id,
                                                 team_short_name=team_name_short,
                                                 date=dates[value - 1],
                                                 opp_team_name_list=temp_oppTeamNameList,
                                                 opp_team_home_away_list=temp_oppTeamHomeAwayList,
                                                 opp_team_difficulty_score=temp_oppTeamDifficultyScore,
                                                 gw=temp_gw)
        objectList.append(dbObject)

    return objectList, dates

