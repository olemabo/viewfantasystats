from utils.models.Team_Fixture_Info_Eliteserien import Team_Fixture_Info_Eliteserien
from openpyxl.utils.cell import get_column_letter
from openpyxl import load_workbook
import pandas as pd


def readEliteserienExcelToDBFormat(path=r'stored_data/eliteserien/Eliteserien_fixtures.xlsx'):
    df = pd.read_excel(path, engine='openpyxl')
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

    #for i in objectList:
    #    print(i.team_name, i.oppTeamDifficultyScore, i.gw)
    return objectList, dates


def readEliteserienExcelFromDagFinnToDBFormat(path=r'stored_data/eliteserien/fixture_data/Eliteserien_fixtures.xlsx'):
    max_teams = 18
    max_games = 30
    wb = load_workbook(path, data_only=True)
    sheet_names = wb.sheetnames
    ws_fdr = wb[sheet_names[0]]
    sheet_owner = ws_fdr['A1']
    # print("Owner: ", sheet_owner.value,  ws_fdr)

    color_to_fdr_dict = get_fdr_colors_to_difficulty_rating_dict(ws_fdr)
    #print(color_to_fdr_dict)
    objectList = []

    column_letters_list = get_list_of_column_letters_from_int_range(2, max_games)
    row_numbers_list = get_list_of_row_numbers_from_int_range(3, max_teams + 1)

    team_name_hexcolor = []

    max_gws = 0
    idss = 1
    for row in row_numbers_list:
        temp_oppTeamNameList = []
        temp_oppTeamHomeAwayList = []
        temp_oppTeamDifficultyScore = []
        temp_gw = []
        team_name_cell_name = "{}{}".format('A', row)
        team_name = ws_fdr[team_name_cell_name].value.split("(")[0]
        team_name_short = ws_fdr[team_name_cell_name].value.split("(")[1][:-1]
        team_color_hex = ws_fdr[team_name_cell_name].fill.start_color.index
        if (team_color_hex == "00000000"): 
            team_color_hex = "0"
        team_font_color_hex = ws_fdr[team_name_cell_name].font.color.index
        team_name_hexcolor.append([team_name, team_color_hex, team_font_color_hex, idss])
        for idx, column in enumerate(column_letters_list):
            cell_name = "{}{}".format(column, row)
            gw_number = "{}{}".format(column, 2)
            value = ws_fdr[cell_name].value
            if value is not None:
                all_games_in_gw = value.split("+")
                for game in all_games_in_gw:
                    fdr = color_to_fdr_dict[ws_fdr[cell_name].fill.start_color.index]
                    opponent = game
                    home_away = "H"
                    if game.islower():
                        home_away = "A"
                    temp_oppTeamNameList.append(opponent)
                    temp_oppTeamHomeAwayList.append(home_away)
                    temp_oppTeamDifficultyScore.append(fdr)
                    temp_gw.append(ws_fdr[gw_number].value)

        max_gws = max(temp_gw)
        # print(idx, team_name, row, id)
        dbObject = Team_Fixture_Info_Eliteserien(team_name=team_name,
                                                 team_id=idss,
                                                 team_short_name=team_name_short,
                                                 date="",
                                                 opp_team_name_list=temp_oppTeamNameList,
                                                 opp_team_home_away_list=temp_oppTeamHomeAwayList,
                                                 opp_team_difficulty_score=temp_oppTeamDifficultyScore,
                                                 gw=temp_gw)
        objectList.append(dbObject)
        idss += 1

    #for i in objectList:
    #    print(i.team_name, i.team_id, len(i.oppTeamNameList), i.team_short_name, i.oppTeamDifficultyScore, i.oppTeamNameList, i.oppTeamHomeAwayList, i.gw)
    
    dates = [gw_i for gw_i in range(max_gws)]

    fdr_to_colors_dict = get_difficulty_rating_to_fdr_colors_dict(ws_fdr)

    return objectList, dates, fdr_to_colors_dict, team_name_hexcolor


def get_fdr_colors_to_difficulty_rating_dict(data, DG_score=0.5, blank_score=10):
    dict = {
        data['H1'].fill.start_color.index: DG_score,
        data['B1'].fill.start_color.index: 1,
        data['C1'].fill.start_color.index: 2,
        data['D1'].fill.start_color.index: 3,
        data['E1'].fill.start_color.index: 4,
        data['F1'].fill.start_color.index: 5,
    }
    return dict


def get_difficulty_rating_to_fdr_colors_dict(data, DG_score=0.5, blank_score=10):
    dict = {
        DG_score: data['H1'].fill.start_color.index,
        1: data['B1'].fill.start_color.index,
        2: data['C1'].fill.start_color.index,
        3: data['D1'].fill.start_color.index,
        4: data['E1'].fill.start_color.index,
        5: data['F1'].fill.start_color.index,
    }
    return dict

def get_list_of_column_letters_from_int_range(start, stop):
    return [get_column_letter(idx) for idx in range(start, stop)]


def get_list_of_row_numbers_from_int_range(start, stop):
    return [idx for idx in range(start, stop)]


# return team name object:   FULL TEAM NAME : SHORT TEAM NAME : TEAM HEX COLOR



#readEliteserienExcelFromDagFinnToDBFormat('./R6-R15.xlsx')
#a, b = readEliteserienExcelToDBFormat('Eliteserien_fixtures.xlsx')
#print(a[0], b[0])