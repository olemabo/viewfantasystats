class LiveFixturesApiResponse:
    def __init__(self, previous_gw, next_gw, current_gameweek, fixture_data, has_ownership_data):
        ...
        self.previous_gw = previous_gw
        self.next_gw = next_gw
        self.current_gameweek = current_gameweek
        self.fixture_data = fixture_data
        self.has_ownership_data = has_ownership_data
    
    
    def to_dict(self):
        return {
            "previous_gw": self.previous_gw,
            "next_gw": self.next_gw,
            "current_gameweek": self.current_gameweek,
            "fixture_data": [
                fixture.to_dict() if hasattr(fixture, "to_dict") else fixture
                for fixture in self.fixture_data
            ],
            "has_ownership_data": self.has_ownership_data
        }
