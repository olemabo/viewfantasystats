import json

class KickOffTimeInfo:
    def __init__(self, gameweek, kickoff_time, day_month):
        ...
        self.gameweek = gameweek
        self.kickoff_time = kickoff_time
        self.day_month = day_month

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)