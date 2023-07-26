import json 

class TeamAndIdModel:
    def __init__(self, team_name, id):
        ...
        self.team_name = team_name
        self.id = id
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)