import json


class KickOffTimesModel:
    def __init__(self, gameweek, kickoff_time, day_month):
        ...
        self.gameweek = gameweek
        self.kickoff_time = kickoff_time
        self.day_month = day_month

    def to_dict(self):
        return {
            "gameweek": self.gameweek,
            "kickoff_time": self.kickoff_time,
            "day_month": self.day_month
        }
 