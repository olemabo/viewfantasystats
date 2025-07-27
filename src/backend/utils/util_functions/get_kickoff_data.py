from models.fixtures.models.KickOffTimesModel import KickOffTimesModel
from fixture_planner_eliteserien.models import EliteserienKickOffTime
from fixture_planner.models import KickOffTime
from datetime import datetime
from constants import esf


def getKickOffData(league_type = esf):
    temp_kick_off_time = []
    
    current_datetime = datetime.utcnow()
    first_upcoming_game = None
    
    kick_off_times_db = EliteserienKickOffTime.objects.all() if league_type == esf else  KickOffTime.objects.all() 
    for kick_of_time in kick_off_times_db:
        kickoff_time = datetime.strptime(kick_of_time.kickoff_time, "%Y-%m-%dT%H:%M:%SZ")
        if kickoff_time > current_datetime and first_upcoming_game is None:
            first_upcoming_game = kick_of_time.gameweek
        
        temp_kick_off_time.append(KickOffTimesModel(
            gameweek=kick_of_time.gameweek,
            kickoff_time=kick_of_time.kickoff_time,
            day_month=kick_of_time.day_month,
        ).toJson())

    return temp_kick_off_time, first_upcoming_game