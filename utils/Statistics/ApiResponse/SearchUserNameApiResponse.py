import json

class SearchUserNameApiResponse:
    def __init__(self, fantasy_manager_url, list_of_hits):
        ...
        self.fantasy_manager_url = fantasy_manager_url
        self.list_of_hits = list_of_hits
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)