import json


class LiveFixtureModel:
    def __init__(self, finished, finished_provisional, id, kickoff_time, minutes, started, team_a, team_a_name, 
                 team_a_score, team_h, team_h_name, team_h_score, stats, players_a, players_h):
        ...
        self.finished = finished
        self.finished_provisional = finished_provisional
        self.id = id
        self.kickoff_time = kickoff_time
        self.started = started
        self.minutes = minutes
        self.team_a = team_a
        self.team_a_name = team_a_name
        self.team_a_score = team_a_score
        self.team_h = team_h
        self.team_h_name = team_h_name
        self.team_h_score = team_h_score
        self.is_live = True if started and not finished_provisional else False
        self.stats = stats
        self.players_a = players_a
        self.players_h = players_h
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)