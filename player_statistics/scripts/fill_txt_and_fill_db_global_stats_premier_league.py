import django
import sys
import os

path = os.path.abspath('../..') if "OleMartinBorge" in os.getcwd() else "/home/olebo/viewfantasystats/"

sys.path.append(path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fplwebpage.settings')
django.setup()

from player_statistics.backend.read_api_data_to_txt.read_global_statistics import save_all_global_stats_for_current_gw
from player_statistics.backend.fill_db_from_txt.fill_db_global_statistics import write_global_stats_to_db
from constants import fpl

current_gw = save_all_global_stats_for_current_gw(fpl)
if current_gw == -1:
    print("Data allready updated for current gw")
else:
    write_global_stats_to_db(current_gw) if current_gw > 0 else print("\nDid not successfully read all global stats data")