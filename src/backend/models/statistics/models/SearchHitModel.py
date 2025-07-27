import json 

class SearchHitModel:
    def __init__(self, hit_text, user_team_name, user_first_name, user_last_name, user_id):
        ...
        self.hit_text = hit_text
        self.user_team_name = user_team_name
        self.user_first_name = user_first_name
        self.user_last_name = user_last_name
        self.user_id = user_id
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)