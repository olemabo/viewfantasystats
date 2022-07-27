from datetime import date
from fixture_planner_eliteserien.models import EliteserienKickOffTime
from fixture_planner.models import KickOffTime


def get_upcoming_gw_eliteserien():
    """
    Find out which is the upcoming gw. 
    Extract kick off times from KickOffTime and compares with current date
    
    :return: current gameweek (int: 1)
    """
    # find current gw
    today_date = date.today()
    kick_off_time_db = EliteserienKickOffTime.objects.all()
    for idx, kick_of_data_i in enumerate(kick_off_time_db):
        current_gw = idx + 1
        dates = kick_of_data_i.kickoff_time.split("T")[0].split("-")
        gw_i_date = date(int(dates[0]), int(dates[1]), int(dates[2]))
        if gw_i_date > today_date:
            return current_gw
    return 1