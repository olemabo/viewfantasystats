import json 


class LiveFixturesApiResponse:
    def __init__(self, previous_gw, next_gw, current_gameweek, fixture_data, has_ownership_data):
        ...
        self.previous_gw = previous_gw
        self.next_gw = next_gw
        self.current_gameweek = current_gameweek
        self.fixture_data = fixture_data
        self.has_ownership_data = has_ownership_data
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
