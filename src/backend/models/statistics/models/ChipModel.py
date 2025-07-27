import json 

class ChipModel:
    def __init__(self, gw, chip_data, total_chip_usage, global_chip_usage=0):
        ...
        self.gw = gw
        self.chip_data = chip_data
        self.total_chip_usage = total_chip_usage
        self.global_chip_usage = global_chip_usage
    
    # def toJson(self):
    #     return json.dumps(self, default=lambda o: o.__dict__)
    
    def toJson(self):
        # Return dict, not JSON string
        return self.__dict__
    
    def to_dict(self):
        return {
            "gw": self.gw,
            "chip_data": self.chip_data,
            "total_chip_usage": self.total_chip_usage,
            "global_chip_usage": self.global_chip_usage,
        }