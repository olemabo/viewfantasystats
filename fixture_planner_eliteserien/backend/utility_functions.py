from datetime import date
from fixture_planner_eliteserien.backend.read_eliteserien_data import readEliteserienExcelToDBFormat


def get_current_gw_Eliteserien():
    fixture_list_db, dates = readEliteserienExcelToDBFormat()
    today_date = date.today()

    for gw_i in range(len(dates)):
        gw_i_kick_off_time = dates[gw_i].date()
        if gw_i_kick_off_time > today_date:
            return gw_i + 1

    return 1