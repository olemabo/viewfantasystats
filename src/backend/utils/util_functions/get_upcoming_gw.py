from fixture_planner_eliteserien.models import EliteserienKickOffTime
from fixture_planner.models import KickOffTime
from datetime import date, datetime


def get_upcoming_gw_eliteserien():
    """
    Find out which is the upcoming gw. 
    Extract kick off times from KickOffTime and compares with current date
    
    :return: current gameweek (int: 1)
    """
    kick_off_time_db = EliteserienKickOffTime.objects.all()
    
    return get_current_gw_from_kickoff_times(kick_off_time_db)


def get_upcoming_gw_premier_league():
    """
    Find out which is the upcoming gw. 
    Extract kick off times from KickOffTime and compares with current date
    
    :return: current gameweek (int: 1)
    """
    kick_off_time_db = KickOffTime.objects.all()
    
    return get_current_gw_from_kickoff_times(kick_off_time_db)


def get_current_gw_from_kickoff_times(kick_off_times_db):
    """
    Find out which is the upcoming gw. 
    Uses kick_off_times_db and compares with current date
    
    :param kick_off_times_db: list of all kickoff time db objects
    :return: current gameweek (int: 1)
    """

    today_date = datetime.today()

    for idx, kick_of_data_i in enumerate(kick_off_times_db):
        current_gw = idx + 1
        # dates = kick_of_data_i.kickoff_time.split("T")[0].split("-")
        # gw_i_date = date(int(dates[0]), int(dates[1]), int(dates[2]))
        datetime_obj = datetime.fromisoformat(kick_of_data_i.kickoff_time.replace("Z", ".000000"))
        if datetime_obj > today_date:
            return current_gw
    
    return 1