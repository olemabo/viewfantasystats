import django
import sys
import os

prod = "/home/olebo/viewfantasystats/"
local = os.path.abspath('../..')

sys.path.append(prod)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()

from player_statistics.backend.fill_db_from_txt.fill_db_cup_statistics_eliteserien import write_cup_statistics_to_db_eliteserien
from player_statistics.backend.read_api_data_to_txt.read_cup_info_statistics import read_cup_info_statistics_eliteserien

response = read_cup_info_statistics_eliteserien()
write_cup_statistics_to_db_eliteserien() if response == 1 else print("\nDid not successfully read all data")